import { render } from 'preact';
import Cookie from 'js-cookie';
import { useAppStore, Country } from './store/app';
import { I18nWidget, I18nButton } from './Components/I18nWidget';
import { CommentsWidget } from './Components/CommentsWidget';
import { FlashMessage, flash } from './Components/FlashMessage';
import Footnote from './Components/Footnote';
import { t_r } from './Utility/i18n';
import { parameters, parseBcp47Tag, fallback_countries } from './Utility/common';
import { guessUserCountry } from './Utility/browser';
import { UserRequests } from './DataType/UserRequests';
import { proceedingFromRequest, useProceedingsStore } from './store/proceedings';
import type { Message } from './types/proceedings';
import { REQUEST_TYPES } from './Utility/requests';
import { PrivacyAsyncStorage } from './Utility/PrivacyAsyncStorage';
import type localforage from 'localforage';
import { ProceedingsBadge } from './Components/ProceedingsBadge';

// Has to run before any rendering, will be removed in prod by bundlers.
if (process.env.NODE_ENV === 'development') require('preact/debug');

// TypeScript complains that `PARAMETERS` is readonly but we do need to set it once.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.PARAMETERS = parameters();

document.querySelectorAll('.i18n-button-container').forEach((el) => render(<I18nButton />, el));

const i18n_widget_div = document.getElementById('personal-menu-i18n-widget');
if (i18n_widget_div) render(<I18nWidget minimal={true} showLanguageOnly={false} />, i18n_widget_div);

const comments_div = document.getElementById('comments-widget');
if (comments_div) {
    render(
        <CommentsWidget
            allowRating={comments_div.dataset.ratingEnabled === '1'}
            displayWarning={comments_div.dataset.displayWarning === '1'}
        />,
        comments_div.parentElement!,
        comments_div
    );
}

const myRequestsLinks = document.getElementsByClassName('my-requests-link');
const menuLink = document.getElementById('main-nav-menu-link');
for (const link of myRequestsLinks) {
    render(<ProceedingsBadge visualParent={menuLink?.parentElement?.contains(link) ? menuLink : undefined} />, link);
}

/**
 * Notify the user if they are visiting a language version different from the language their browser reports, i.e. if
 * someone visits the English site, but their browser reports German, let's notify them to change the lang.
 * @param preferred_language bcp47 substring of target language, e.g. `en-US` becomes `en`
 * @param website_language bcp47 substring of current website language, e.g. `en-US` becomes `en`
 */
function notifyOtherLanguages(preferred_language?: string, website_language?: string) {
    if (!preferred_language || !website_language) return;
    const recommend_language = t_r('recommend-language', preferred_language);
    flash(
        <FlashMessage type="info" duration={-1}>
            {recommend_language} <I18nWidget minimal={true} showLanguageOnly={true} />
        </FlashMessage>
    );
}

if (!useAppStore.getState().countrySet) {
    // TODO: Remove the cookie migration code in a year or so.
    useAppStore
        .getState()
        .changeCountry((Cookie.get('country') as Country) || guessUserCountry(useAppStore.getState().savedLocale));
    Cookie.remove('country');

    const { language: preferred_language } = parseBcp47Tag(navigator.language);
    const { language: website_language } = parseBcp47Tag(document.documentElement.lang);

    if (preferred_language !== website_language && preferred_language! in fallback_countries)
        notifyOtherLanguages(preferred_language, website_language);
}

// TODO: remove the my requests migration code and notify users about the migration
const unsubscribeFromHydration = useProceedingsStore.persist.onFinishHydration((proceedingsState) => {
    if (!proceedingsState._migratedLegacyRequests) {
        PrivacyAsyncStorage.doesStoreExist('Datenanfragen.de', 'my-requests')
            .then((exists) => {
                if (!exists) return;
                const userRequests = new UserRequests();
                return userRequests
                    .getRequests()
                    .then(async (requests) => {
                        if (!requests) return;
                        for (const [dbId, request] of Object.entries(requests)) {
                            if (request.migrated) continue;

                            if (request.response_type) {
                                const messageFromRequest: Omit<Message, 'id'> = {
                                    reference: request.reference,
                                    correspondent_address: request.recipient,
                                    transport_medium: request.via,
                                    type: request.response_type,
                                    date: new Date(request.date),
                                    correspondent_email: request.email,
                                    sentByMe: true,
                                };

                                const createStubProceeding = () => {
                                    // If the parent request is missing we create a stub to put the message in.
                                    proceedingsState.addProceeding({
                                        reference: request.reference,
                                        messages: {},
                                        status: 'done',
                                    });
                                    proceedingsState.addMessage(messageFromRequest);
                                };

                                // Search for the parent request in the already created proceedings
                                if (
                                    Object.keys(useProceedingsStore.getState().proceedings).includes(request.reference)
                                ) {
                                    proceedingsState.addMessage(messageFromRequest);
                                } else {
                                    // If no proceeding was found, search the database and create a new proceeding
                                    const parentRequestId = await userRequests.localforage_instance
                                        ?.keys()
                                        .then((keys) =>
                                            keys?.find(
                                                (key) =>
                                                    key !== dbId &&
                                                    key.match(new RegExp(`^${request.reference}-${REQUEST_TYPES}`))
                                            )
                                        );

                                    if (parentRequestId) {
                                        const parentRequest = await userRequests.getRequest(parentRequestId);
                                        if (!parentRequest) {
                                            createStubProceeding();
                                        } else {
                                            proceedingsState.addProceeding(proceedingFromRequest(parentRequest));
                                            proceedingsState.addMessage(messageFromRequest);

                                            await userRequests.storeRequest(parentRequestId, {
                                                ...parentRequest,
                                                migrated: true,
                                            });
                                        }
                                    } else createStubProceeding();
                                }
                            } else {
                                proceedingsState.addProceeding(proceedingFromRequest(request));
                            }
                            await userRequests.storeRequest(dbId, {
                                ...request,
                                migrated: true,
                            });
                        }
                    })
                    .then(
                        () =>
                            userRequests.localforage_instance?.driver() === 'asyncStorage' &&
                            (
                                userRequests.localforage_instance as typeof localforage & {
                                    _dbInfo: { db: IDBDatabase };
                                }
                            )._dbInfo.db.close()
                    );
            })
            .then(() => proceedingsState.migrationDone())
            .then(() => unsubscribeFromHydration());
    } else {
        unsubscribeFromHydration();
    }
});

const renderNewFootnotes = (hugoFootnotes: Element[]) => {
    hugoFootnotes.forEach((hugoFootnote, index) => {
        const footnoteContent = document.querySelector(`li[id="fn:${index + 1}"]`)?.cloneNode(true) as Element;
        // Since the text content is taken from the bottom footnotes, it contains an arrow at the end that needs to be
        // removed when the content is displayed within the embedded footnote.
        footnoteContent?.querySelector('.footnote-backref')?.remove();

        render(
            <Footnote index={index + 1} id={hugoFootnote.id}>
                {/*
                    I unfortunately don't see a way to avoid the dangerouslySetInnerHTML here… I'd also love to avoid
                    the nested div.
                */}
                {/* eslint-disable-next-line react/no-danger */}
                <div dangerouslySetInnerHTML={{ __html: footnoteContent.innerHTML }} />
            </Footnote>,
            hugoFootnote.parentElement!,
            hugoFootnote
        );

        // Manually remove the Hugo rendered footnote since Preact doesn't do it as part of the render() method.
        hugoFootnote.remove();
    });
};

window.addEventListener('load', () => {
    const hugoFootnotes = Array.from(document.querySelectorAll("[id^='fnref']"));
    if (hugoFootnotes.length > 0) renderNewFootnotes(hugoFootnotes);
});
