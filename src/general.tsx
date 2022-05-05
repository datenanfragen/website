import { render } from 'preact';
import Cookie from 'js-cookie';
import { I18nWidget, I18nButton } from './Components/I18nWidget';
import { CommentsWidget } from './Components/CommentsWidget';
import { FlashMessage, flash } from './Components/FlashMessage';
import Footnote from './Components/Footnote';
import { t_r } from './Utility/i18n';
import { parameters, fallback_countries } from './Utility/common';

// Has to run before any rendering, will be removed in prod by bundlers.
if (process.env.NODE_ENV === 'development') require('preact/debug');

// TypeScript complains that `PARAMETERS` is readonly but we do need to set it once.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.PARAMETERS = parameters;

Object.defineProperty(window.globals, 'country', {
    set(country) {
        Cookie.set('country', country, { expires: 365, secure: true, sameSite: 'strict' });
        this._country_listeners.forEach((listener: (country: string) => void) => listener(country));
    },
    get() {
        return Cookie.get('country');
    },
});

if (!window.globals.country) window.globals.country = guessUserCountry();

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
function notifyOtherLanguages(preferred_language: string, website_language: string) {
    if (!preferred_language || !website_language) return;
    const recommend_language = t_r('recommend-language', preferred_language);
    flash(
        <FlashMessage type="info" duration={-1}>
            {recommend_language} <I18nWidget minimal={true} showLanguageOnly={true} />
        </FlashMessage>
    );
}

// This uses the `navigator.language` property (similar-ish to the `Accept-Language` header which we cannot access from
// JS) which may not necessarily represent the user's country (or even include region information at all).
// The more reliable way would be to feed the user's IP into a geolocation service but that is not an option, so we have
// to stick with this.
function guessUserCountry(): typeof window.globals.country {
    const navigator_lang = navigator.language;

    // Taken from: https://github.com/gagle/node-bcp47/blob/a74d98d43d16b0094b2f4ea8e7a58f4b5830c15b/lib/index.js#L4
    const bcp47_regex =
        /^(?:(en-gb-oed|i-ami|i-bnn|i-default|i-enochian|i-hak|i-klingon|i-lux|i-mingo|i-navajo|i-pwn|i-tao|i-tay|i-tsu|sgn-be-fr|sgn-be-nl|sgn-ch-de)|(art-lojban|cel-gaulish|no-bok|no-nyn|zh-guoyu|zh-hakka|zh-min|zh-min-nan|zh-xiang))$|^((?:[a-z]{2,3}(?:(?:-[a-z]{3}){1,3})?)|[a-z]{4}|[a-z]{5,8})(?:-([a-z]{4}))?(?:-([a-z]{2}|\d{3}))?((?:-(?:[\da-z]{5,8}|\d[\da-z]{3}))*)?((?:-[\da-wyz](?:-[\da-z]{2,8})+)*)?(-x(?:-[\da-z]{1,8})+)?$|^(x(?:-[\da-z]{1,8})+)$/i;
    const bcp47_country = (bcp47_regex.exec(navigator_lang)?.[5] || '').toLowerCase() as typeof window.globals.country;

    const bcp47_preferred_language = (bcp47_regex.exec(navigator_lang)?.[3] || '').toLowerCase();
    const bcp47_website_language = (bcp47_regex.exec(document.documentElement.lang)?.[3] || '').toLowerCase();

    if (bcp47_preferred_language !== bcp47_website_language && bcp47_preferred_language in fallback_countries) {
        notifyOtherLanguages(bcp47_preferred_language, bcp47_website_language);
    }

    // If we cannot guess the user's country, it makes sense to fallback to the language.
    if (!navigator_lang || !bcp47_country) return fallback_countries[window.LOCALE];

    // If however we *can* guess the country but just don't support it, we show all companies.
    return window.SUPPORTED_COUNTRIES.includes(bcp47_country) ? bcp47_country : 'all';
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
