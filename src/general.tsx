import { render } from 'preact';
import Cookie from 'js-cookie';
import { useAppStore, Country } from './store/app';
import { I18nWidget, I18nButton } from './Components/I18nWidget';
import { CommentsWidget } from './Components/CommentsWidget';
import { FlashMessage, flash } from './Components/FlashMessage';
import Footnote from './Components/Footnote';
import { t_r } from './Utility/i18n';
import { parameters, parseBcp47Tag } from './Utility/common';
import { guessUserCountry } from './Utility/browser';

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
    useAppStore.getState().changeCountry((Cookie.get('country') as Country) || guessUserCountry());
    Cookie.remove('country');

    const { language: preferred_language } = parseBcp47Tag(navigator.language);
    const { language: website_language } = parseBcp47Tag(document.documentElement.lang);

    if (
        preferred_language !== website_language &&
        Object.prototype.isPrototypeOf.call(window.SUPPORTED_LANGUAGES, preferred_language!)
    )
        notifyOtherLanguages(preferred_language, website_language);
}

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
