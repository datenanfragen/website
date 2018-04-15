import translate from 'preact-i18n/src/lib/translate';

export default function t(id, scope = '', fields = {}, plural = null, fallback = '') {
    return translate(id, scope, I18N_DEFINITION, fields, plural, fallback);
}
