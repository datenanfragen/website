import { translate } from 'preact-i18n';

export default function t(id, scope = '', fields = {}, plural = null, fallback = '') {
    return translate(id, scope, I18N_DEFINITION, fields, plural, fallback);
}

// such ugliness
export function t_r(id, language = '', fields = {}, plural = null, fallback = '') {
    return translate(id, language, I18N_DEFINITION_REQUESTS, fields, plural, fallback);
}
