import { render } from 'preact';
import t, { t_r } from './Utility/i18n';
import I18nWidget, { I18nButton } from './Components/I18nWidget';
import CommentsWidget from './Components/CommentsWidget';
import FlashMessage, { flash } from './Components/FlashMessage';
import Cookie from 'js-cookie';
import { PARAMETERS } from './Utility/common';

// has to run before any rendering, webpack will remove this if the condition is false
if (process.env.NODE_ENV === 'development') {
    require('preact/debug');
}

window.PARAMETERS = PARAMETERS;

Object.defineProperty(globals, 'country', {
    set: function (country) {
        Cookie.set('country', country, { expires: 365 });
        this._country_listeners.forEach(function (listener) {
            listener(country);
        });
    },
    get: function () {
        return Cookie.get('country');
    },
});

if (!globals.country) globals.country = guessUserCountry();

document.querySelectorAll('.i18n-button-container').forEach((el) => {
    render(<I18nButton />, el);
});
render(<I18nWidget minimal={true} />, document.getElementById('personal-menu-i18n-widget'));

const comments_div = document.getElementById('comments-widget');
if (comments_div) {
    render(
        <CommentsWidget
            allow_rating={comments_div.dataset.ratingEnabled === '1'}
            displayWarning={comments_div.dataset.displayWarning === '1'}
        />,
        comments_div.parentElement,
        comments_div
    );
}

/**
 * Notify the user that other languages may exist from their current browser. I.e. if someone visits the English site,
 * but the browser is configured in German, let's notify them to change the lang.
 * @param  {string} preferred_language - bcp47 substring of target language, e.g. `en-US` becomes `en`
 * @param  {string} website_language - bcp47 substring of current website language, e.g. `en-US` becomes `en`
 */
function notifyOtherLanguages(preferred_language, website_language) {
    if (!preferred_language || !website_language) return;
    let recommend_language = t_r('recommend-language', preferred_language);
    flash(
        <FlashMessage type="info" duration={-1}>
            {recommend_language} <I18nWidget minimal={true} showLanguageOnly={true} />
        </FlashMessage>
    );
}

// This uses the `navigator.language` property (similar-ish to the `Accept-Language`header which we cannot access from JS) which may not necessarily represent the user's country (or even include region-information at all).
// The more reliable way would be to feed the user's IP into a geolocation service but that is not an option, so we have to stick with this.
function guessUserCountry() {
    // maps from language to country
    const FALLBACK_COUNTRIES = { de: 'de', en: 'gb', fr: 'fr', pt: 'pt', es: 'es', hr: 'hr' };

    // see https://stackoverflow.com/a/52112155/3211062
    const navigator_lang = navigator.language;

    // taken from https://github.com/gagle/node-bcp47/blob/master/lib/index.js#L4
    const bcp47_regex = /^(?:(en-gb-oed|i-ami|i-bnn|i-default|i-enochian|i-hak|i-klingon|i-lux|i-mingo|i-navajo|i-pwn|i-tao|i-tay|i-tsu|sgn-be-fr|sgn-be-nl|sgn-ch-de)|(art-lojban|cel-gaulish|no-bok|no-nyn|zh-guoyu|zh-hakka|zh-min|zh-min-nan|zh-xiang))$|^((?:[a-z]{2,3}(?:(?:-[a-z]{3}){1,3})?)|[a-z]{4}|[a-z]{5,8})(?:-([a-z]{4}))?(?:-([a-z]{2}|\d{3}))?((?:-(?:[\da-z]{5,8}|\d[\da-z]{3}))*)?((?:-[\da-wyz](?:-[\da-z]{2,8})+)*)?(-x(?:-[\da-z]{1,8})+)?$|^(x(?:-[\da-z]{1,8})+)$/i;
    const bcp47_country = (bcp47_regex.exec(navigator_lang)[5] || '').toLowerCase();

    const bcp47_preferred_language = (bcp47_regex.exec(navigator_lang)[3] || '').toLowerCase();
    const bcp47_website_language = (bcp47_regex.exec(document.documentElement.lang)[3] || '').toLowerCase();

    // Suggest user other language
    if (bcp47_preferred_language !== bcp47_website_language) {
        // Check if language is supported
        if (bcp47_preferred_language in FALLBACK_COUNTRIES) {
            notifyOtherLanguages(bcp47_preferred_language, bcp47_website_language);
        }
    }

    // If we cannot guess the user's country, it makes sense to fallback to the language.
    if (!navigator_lang || !bcp47_country) return FALLBACK_COUNTRIES[LOCALE];

    // If however we *can* guess the country but just don't support it, we show all companies.
    return SUPPORTED_COUNTRIES.includes(bcp47_country) ? bcp47_country : 'all';
}
