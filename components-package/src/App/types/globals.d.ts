import type { appTranslations } from '../../index';

declare global {
    interface Window {
        readonly I18N_DEFINITION_APP: typeof appTranslations['en'];
    }
}
