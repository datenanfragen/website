import type i18n_definition_type from '../i18n/en.json';

type I18nLanguage = string;

interface LocalizationState {
    locale: string;
    i18n_definition_requests: Record<I18nLanguage, typeof i18n_definition_type['requests']>;
    i18n_definition: Omit<typeof i18n_definition_type, 'hugo'>;
}
