import translate from 'preact-i18n/src/lib/translate';

export default function t(id, scope = '', fields = {}, plural = null, fallback = '') {
    return translate(id, scope, i18n_definition, fields, plural, fallback);
}
