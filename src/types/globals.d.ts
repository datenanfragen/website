import type i18n_definition_type from '../i18n/en.json';

// TODO: I don't see any easy way to make the list of languages more specific here without hardcoding it.
type I18nLanguage = string;

declare global {
    interface Window {
        /** Two-letter ISO code of the site's language. */
        LOCALE: string;

        /**
         * Translations for the current language, with the scope being the first-, and the translation key being the
         * second-level key.
         */
        I18N_DEFINITION: Omit<typeof i18n_definition_type, 'hugo'>;

        /**
         * Translations used for generating requests in all languages, with the two-letter ISO code of the language
         * being the first-, and the translation key being the second-level key.
         */
        I18N_DEFINITION_REQUESTS: Record<I18nLanguage, typeof i18n_definition_type['requests']>;
    }
}
