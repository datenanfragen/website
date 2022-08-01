import type { I18nLanguage } from '../types/globals';
import create, { GetState, SetState, StateCreator } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';
import type i18n_definition_type from '../i18n/en.json';

// TODO: This is done more cleverly in newer versions of zustand
type CombinedStateCreator<T extends object> = StateCreator<T, SetState<CountryStateSlice>, GetState<CountryStateSlice>>;
export type Country = Exclude<keyof typeof i18n_definition_type['countries'], '__taken_from'>;
export type CountryStateSlice = {
    countrySet: boolean;
    country: Country;
    savedLocale: I18nLanguage;

    changeCountry: (new_country: Country) => void;
    saveLanguage: (savedLocale: I18nLanguage) => void;
};

export const createCountrySlice: CombinedStateCreator<CountryStateSlice> = (set) => ({
    countrySet: false,
    country: 'all' as Country,
    savedLocale: window.LOCALE || 'en',

    changeCountry: (new_country: Country) => set({ country: new_country, countrySet: true }),
    saveLanguage: (savedLocale) => set({ savedLocale }),
});

export const appSettingsPersistOptions: PersistOptions<CountryStateSlice> = {
    name: 'Datenanfragen.de-settings',
    version: 0,
    // It would be possible to use localforage here but only at a very significant cost: As localforage is
    // asynchronous, we could not rely on the store being loaded ("hydrated") at initial render time and every
    // component using this store would need to handle that
    // (https://github.com/pmndrs/zustand/wiki/Persisting-the-store's-data#how-can-i-check-if-my-store-has-been-hydrated=).
    //
    // Given how little we want to store in the settings, I think that, while unfortunate, it's fine to use
    // localStorage here.
    getStorage: () => localStorage,
};

// TODO: Also move privacy controls and other settings in here (and remember to migrate their existing values!).
export const useAppStore = create<CountryStateSlice>(
    persist(
        (...a) => ({
            ...createCountrySlice(...a),
        }),
        appSettingsPersistOptions
    )
);
