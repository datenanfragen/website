import type { I18nLanguage } from '../../../src/types/globals';
import type { Country } from '../../../src/store/app';
import i18nDefinitionAppEn from './i18n/en.json';
import i18nDefinitionAppDe from './i18n/de.json';
import { useCacheStore } from './Utility/cache';

export const appTranslations = {
    en: i18nDefinitionAppEn,
    de: i18nDefinitionAppDe,
};
export const setupWindowForApp = (locale: I18nLanguage) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.I18N_DEFINITION_APP = appTranslations[locale];

    const originalFetch = window.fetch;
    window.fetch = (input, init) => {
        // TODO: Move the template logic here?
        // TODO: Disable this if the user has disabled the local cache? If we want this to be disablable, I would rather
        // flip the setting to "load data from our server".
        if (input.toString().startsWith(window.BASE_URL)) {
            const path = input.toString().replace(window.BASE_URL, '');

            const isCompanyPack = path.match(/db\/company-packs\/([a-z]{2}|all).json/);
            if (isCompanyPack) {
                const companyPacks = useCacheStore.getState()['company-packs'][isCompanyPack[1] as Country];
                if (companyPacks) return Promise.resolve(new Response(JSON.stringify(companyPacks)));
            }

            const isCompany = path.match(/db\/([a-z-]+).json/);
            if (isCompany) {
                const company = useCacheStore.getState().companies.find((c) => c.slug === isCompany[1]);
                if (company) return Promise.resolve(new Response(JSON.stringify(company)));
            }
            const isSva = path.match(/db\/sva\/([a-z-]+).json/);
            if (isSva) {
                const sva = useCacheStore.getState()['supervisory-authorities'].find((c) => c.slug === isSva[1]);
                if (sva) return Promise.resolve(new Response(JSON.stringify(sva)));
            }
        }

        return originalFetch(input, init);
    };
};

export { EmailAccountSettingsInput } from './Components/EmailAccountSettingsInput';
export { AppMenu } from './Components/AppMenu';
export { ProceedingsList } from './Components/ProceedingsList';
export { t_a } from './Utility/i18n';
export { miniSearchClient } from './Utility/search';
export { fetchOfflineData, useCacheStore } from './Utility/cache';
export type { CacheStore, OfflineData } from './Utility/cache';
export { BlobStorage } from './Utility/BlobStorage';
export { mail2pdf } from './Utility/mail2pdf';
