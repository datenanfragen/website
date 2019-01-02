import preact from 'preact';
import I18nWidget, { I18nButton } from './Components/I18nWidget';
import CommentsWidget from './Components/CommentsWidget';
import Cookie from 'js-cookie';
import IdData from './Utility/IdData';
import { Text } from 'preact-i18n';
import t from './Utility/i18n';
import Privacy, { PRIVACY_ACTIONS } from './Utility/Privacy';

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

preact.render(<CommentsWidget />, null, document.getElementById('comments-widget'));

if (Privacy.isAllowed(PRIVACY_ACTIONS.SAVE_ID_DATA)) {
    preact.render(
        <div className="form-group id-controls-fill-container">
            <p>{t('always-fill-in-explain', 'id-data-controls')}</p>
            <input
                type="checkbox"
                id="always-fill-in"
                className="form-element"
                checked={IdData.shouldAlwaysFill()}
                onChange={event => {
                    IdData.setAlwaysFill(!IdData.shouldAlwaysFill());
                }}
            />
            <label for="always-fill-in">{t('always-fill-in', 'id-data-controls')}</label>
        </div>,
        document.getElementById('id-data-controls')
    );
}

// This uses the `navigator.language` property (similar-ish to the `Accept-Language`header which we cannot access from JS) which may not necessarily represent the user's country (or even include region-information at all).
// The more reliable way would be to feed the user's IP into a geolocation service but that is not an option, so we have to stick with this.
function guessUserCountry() {
    // maps from language to country
    const FALLBACK_COUNTRIES = { de: 'de', en: 'gb' };

    // see https://stackoverflow.com/a/52112155/3211062
    let navigator_lang =
        navigator.languages && navigator.languages.length
            ? navigator.languages[0]
            : navigator.language || navigator.browserLanguage;
    if (!navigator_lang) return FALLBACK_COUNTRIES[LOCALE];

    // taken from https://github.com/gagle/node-bcp47/blob/master/lib/index.js#L4
    const bcp47_regex = /^(?:(en-GB-oed|i-ami|i-bnn|i-default|i-enochian|i-hak|i-klingon|i-lux|i-mingo|i-navajo|i-pwn|i-tao|i-tay|i-tsu|sgn-BE-FR|sgn-BE-NL|sgn-CH-DE)|(art-lojban|cel-gaulish|no-bok|no-nyn|zh-guoyu|zh-hakka|zh-min|zh-min-nan|zh-xiang))$|^((?:[a-z]{2,3}(?:(?:-[a-z]{3}){1,3})?)|[a-z]{4}|[a-z]{5,8})(?:-([a-z]{4}))?(?:-([a-z]{2}|\d{3}))?((?:-(?:[\da-z]{5,8}|\d[\da-z]{3}))*)?((?:-[\da-wy-z](?:-[\da-z]{2,8})+)*)?(-x(?:-[\da-z]{1,8})+)?$|^(x(?:-[\da-z]{1,8})+)$/i;
    let bcp47_country = bcp47_regex.exec(navigator_lang)[5];

    return bcp47_country && SUPPORTED_COUNTRIES.includes(bcp47_country) ? bcp47_country : FALLBACK_COUNTRIES[LOCALE];
}
