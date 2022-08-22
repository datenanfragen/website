import { translate } from 'preact-i18n';

export const t_a = <ScopeT extends keyof typeof window.I18N_DEFINITION_APP>(
    id: keyof typeof window.I18N_DEFINITION_APP[ScopeT],
    scope: ScopeT,
    fields?: Record<string, string>,
    plural?: number,
    fallback?: string
) => translate(id as string, scope, window.I18N_DEFINITION_APP, fields, plural, fallback);
