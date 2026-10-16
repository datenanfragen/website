import type { Proceeding, ProceedingStatus } from './proceedings.d';
import type i18n_definition_type from '../i18n/en.json';
import type { Country } from '../store/app';
import type { fallback_countries } from '../Utility/common';

type I18nLanguage = keyof typeof fallback_countries;
type CountryListener = (country: Country) => void;

declare global {
    interface Window {
        /** The current language version's base URL, including the trailing slash. */
        readonly BASE_URL: string;
        /** The URL to the PDF worker bundle. */
        readonly PDF_WORKER_URL: string;

        /** Two-letter ISO code of the site's language. */
        readonly LOCALE: I18nLanguage;

        /** List of two-letter ISO codes of the countries that can be selected in the I18nWidget. */
        readonly SUPPORTED_COUNTRIES: Country[];
        /**
         * Maps the two-letter ISO codes of the languages the *current page* (not website as a whole) is translated into
         * to their respective translation URLs.
         */
        readonly SUPPORTED_LANGUAGES: Record<I18nLanguage, string>;

        /**
         * Translations for the current language, with the scope being the first-, and the translation key being the
         * second-level key.
         */
        readonly I18N_DEFINITION: Omit<typeof i18n_definition_type, 'hugo' | 'requests'>;
        /**
         * Translations used for generating requests in all languages, with the two-letter ISO code of the language
         * being the first-, and the translation key being the second-level key.
         */
        readonly I18N_DEFINITION_REQUESTS: Record<I18nLanguage, typeof i18n_definition_type['requests']>;

        /** List of parameters specified in the URL, including both hash fragment and GET parameters. */
        readonly PARAMETERS: Record<string, string>;

        /** Whether Hugo is running in dev mode. */
        readonly hugoDevMode: boolean;

        ON_PROCEEDING_STATUS_CHANGE?: (proceeding: Proceeding, oldStatus: ProceedingStatus) => void;
    }
}
