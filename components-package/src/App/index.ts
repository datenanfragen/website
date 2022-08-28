import type { I18nLanguage } from '../../../src/types/globals';
import type { Country } from '../../../src/store/app';
import i18nDefinitionAppEn from './i18n/en.json';
import { useCacheStore, OfflineData } from './Utility/cache';

export const appTranslations = {
    en: i18nDefinitionAppEn,
};
export const setupWindowForApp = (locale: I18nLanguage) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.I18N_DEFINITION_APP = appTranslations[locale];

    const originalFetch = window.fetch;
    window.fetch = (input, init) => {
        const offlineData: OfflineData | undefined = useCacheStore.getState().offlineData
            ? JSON.parse(useCacheStore.getState().offlineData!)
            : undefined;

        if (offlineData && input.toString().startsWith(window.BASE_URL)) {
            const path = input.toString().replace(window.BASE_URL, '');

            const isCompanyPack = path.match(/db\/company-packs\/([a-z]{2}|all).json/);
            if (isCompanyPack) {
                const country = isCompanyPack[1] as Country;
                if (offlineData['company-packs'][country])
                    return Promise.resolve(new Response(JSON.stringify(offlineData['company-packs'][country])));
            }
        }

        return originalFetch(input, init);
    };
};

export { EmailAccountSettingsInput } from './Components/EmailAccountSettingsInput';
export { AppMenu } from './Components/AppMenu';
export { ProceedingsList } from './Components/ProceedingsList';
export { t_a } from './Utility/i18n';
export { miniSearchClient, miniSearchIndexFromOfflineData } from './Utility/search';
export { fetchOfflineData, useCacheStore } from './Utility/cache';
export type { CacheStore, OfflineData } from './Utility/cache';
