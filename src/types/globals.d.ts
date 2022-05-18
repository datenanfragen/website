import type i18n_definition_type from '../i18n/en.json';
import type { fallback_countries } from '../Utility/common';

type I18nLanguage = keyof typeof fallback_countries;
type CountryListener = (country: Country) => void;
type Country = Exclude<keyof typeof i18n_definition_type['countries'], '__taken_from'>;

declare global {
    interface Window {
        /** The current language version's base URL, including the trailing slash. */
        readonly BASE_URL: string;
        /** The site version as specified in `package.json`. */
        readonly CODE_VERSION: string;

        /** Two-letter ISO code of the site's language. */
        readonly LOCALE: I18nLanguage;

        /** List of two-letter ISO codes of the countries that can be selected in the I18nWidget. */
        readonly SUPPORTED_COUNTRIES: Country[];
        /**
         * Maps the two-letter ISO codes of the languages the *current page* (not website as a whole) is translated into
         * to their respective translation URLs.
         */
        readonly SUPPORTED_LANGUAGES: Record<I18nLanguage, string>;
        /** List of two-letter ISO codes of the countries that have suggested companies in the wizard. */
        readonly COUNTRIES_WITH_SUGGESTED_COMPANIES: Country[];

        /**
         * Translations for the current language, with the scope being the first-, and the translation key being the
         * second-level key.
         */
        readonly I18N_DEFINITION: Omit<typeof i18n_definition_type, 'hugo'>;
        /**
         * Translations used for generating requests in all languages, with the two-letter ISO code of the language
         * being the first-, and the translation key being the second-level key.
         */
        readonly I18N_DEFINITION_REQUESTS: Record<I18nLanguage, typeof i18n_definition_type['requests']>;

        /** List of parameters specified in the URL, including both hash fragment and GET parameters. */
        readonly PARAMETERS: Record<string, string>;

        /**
         * Ugly workaround to implement a sort of global store, so that independent Preact components can access the
         * same state. Will be removed soon.
         */
        globals: {
            _country_listeners: CountryListener[];
            addCountryListener: (listener: CountryListener) => void;
            country: Country;
        };
    }
}
