import { translate } from 'preact-i18n';

export default function t(
    id,
    scope = '',
    fields = {},
    plural = null,
    fallback = '',
    i18n_definition = I18N_DEFINITION
) {
    return translate(id, scope, i18n_definition, fields, plural, fallback);
}

// such ugliness
export function t_r(
    id,
    language = '',
    fields = {},
    plural = null,
    fallback = '',
    i18n_definition_requests = I18N_DEFINITION_REQUESTS
) {
    return translate(id, language, i18n_definition_requests, fields, plural, fallback);
}
