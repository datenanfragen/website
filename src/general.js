import preact from 'preact';
import I18nWidget, { I18nButton } from './Components/I18nWidget';
import CommentsWidget from './Components/CommentsWidget';
import Cookie from 'js-cookie';
import SavedIdData from './Utility/SavedIdData';
import t from './Utility/i18n';
import Privacy, { PRIVACY_ACTIONS } from './Utility/Privacy';
import { PARAMETERS } from './Utility/common';
import DonationWidget from './Components/DonationWidget';

window.I18N_DEFINITION = require('i18n/' + LOCALE + '.json');
window.I18N_DEFINITION_REQUESTS = ['de', 'en', 'fr'].reduce(
    (acc, cur) => ({ ...acc, [cur]: require(`i18n/${cur}.json`).requests }),
    {}
);

window.PARAMETERS = PARAMETERS;

Object.defineProperty(globals, 'country', {
    set: function(country) {
        Cookie.set('country', country, { expires: 365 });
        this._country_listeners.forEach(function(listener) {
            listener(country);
        });
    },
    get: function() {
        return Cookie.get('country');
    }
});

if (!globals.country) globals.country = guessUserCountry();

document.querySelectorAll('.i18n-button-container').forEach(el => {
    preact.render(<I18nButton />, el);
});
preact.render(<I18nWidget minimal={true} />, document.getElementById('personal-menu-i18n-widget'));

const comments_div = document.getElementById('comments-widget');
if (comments_div) {
    preact.render(
        <CommentsWidget
            allow_rating={comments_div.dataset.ratingEnabled === '1'}
            displayWarning={comments_div.dataset.displayWarning === '1'}
        />,
        null,
        comments_div
    );
}

document.querySelectorAll('.donation-widget').forEach(el => preact.render(<DonationWidget />, null, el));

if (Privacy.isAllowed(PRIVACY_ACTIONS.SAVE_ID_DATA)) {
    preact.render(
        <div className="form-group id-controls-fill-container">
            <p>{t('always-fill-in-explain', 'id-data-controls')}</p>
            <input
                type="checkbox"
                id="always-fill-in"
                className="form-element"
                checked={SavedIdData.shouldAlwaysFill()}
                onChange={event => {
                    SavedIdData.setAlwaysFill(!SavedIdData.shouldAlwaysFill());
                }}
            />
            <label htmlFor="always-fill-in">{t('always-fill-in', 'id-data-controls')}</label>
        </div>,
        document.getElementById('id-data-controls')
    );
}

// This uses the `navigator.language` property (similar-ish to the `Accept-Language`header which we cannot access from JS) which may not necessarily represent the user's country (or even include region-information at all).
// The more reliable way would be to feed the user's IP into a geolocation service but that is not an option, so we have to stick with this.
function guessUserCountry() {
    // maps from language to country
    const FALLBACK_COUNTRIES = { de: 'de', en: 'gb', fr: 'fr' };

    // see https://stackoverflow.com/a/52112155/3211062
    const navigator_lang =
        navigator.languages && navigator.languages.length
            ? navigator.languages[0]
            : navigator.language || navigator.browserLanguage;

    // taken from https://github.com/gagle/node-bcp47/blob/master/lib/index.js#L4
    const bcp47_regex = /^(?:(en-gb-oed|i-ami|i-bnn|i-default|i-enochian|i-hak|i-klingon|i-lux|i-mingo|i-navajo|i-pwn|i-tao|i-tay|i-tsu|sgn-be-fr|sgn-be-nl|sgn-ch-de)|(art-lojban|cel-gaulish|no-bok|no-nyn|zh-guoyu|zh-hakka|zh-min|zh-min-nan|zh-xiang))$|^((?:[a-z]{2,3}(?:(?:-[a-z]{3}){1,3})?)|[a-z]{4}|[a-z]{5,8})(?:-([a-z]{4}))?(?:-([a-z]{2}|\d{3}))?((?:-(?:[\da-z]{5,8}|\d[\da-z]{3}))*)?((?:-[\da-wyz](?:-[\da-z]{2,8})+)*)?(-x(?:-[\da-z]{1,8})+)?$|^(x(?:-[\da-z]{1,8})+)$/i;
    const bcp47_country = (bcp47_regex.exec(navigator_lang)[5] || '').toLowerCase();

    // If we cannot guess the user's country, it makes sense to fallback to the language.
    if (!navigator_lang || !bcp47_country) return FALLBACK_COUNTRIES[LOCALE];

    // If however we *can* guess the country but just don't support it, we show all companies.
    return SUPPORTED_COUNTRIES.includes(bcp47_country) ? bcp47_country : 'all';
}

window.enableReactDevTools = function() {
    if (process.env.NODE_ENV === 'development') {
        require.ensure([], function(require) {
            require('preact/debug');
        });
    }
};
