import { translate } from 'preact-i18n';

type i18n_definition_type = typeof window.I18N_DEFINITION;
type i18n_definition_requests_type = typeof window.I18N_DEFINITION_REQUESTS;

export default function t<ScopeT extends keyof i18n_definition_type>(
    id: keyof i18n_definition_type[ScopeT],
    scope: ScopeT,
    fields?: Record<string, string>,
    plural?: number,
    fallback?: string
) {
    return translate(id as string, scope, window.I18N_DEFINITION, fields, plural, fallback);
}

// such ugliness
export function t_r(
    id: keyof i18n_definition_requests_type['en'],
    language: string,
    fields?: Record<string, string>,
    plural?: number,
    fallback?: string
) {
    return translate(id, language, window.I18N_DEFINITION_REQUESTS, fields, plural, fallback);
}
