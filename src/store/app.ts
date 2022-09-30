import type { I18nLanguage } from '../types/globals';
import create, { GetState, SetState, StateCreator } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';
import type i18n_definition_type from '../i18n/en.json';
import { produce } from 'immer';
import type { HintId } from '../Components/Hint';

// TODO: This is done more cleverly in newer versions of zustand
type CombinedStateCreator<T extends object> = StateCreator<
    T,
    SetState<CountryStateSlice & PreferenceStateSlice>,
    GetState<CountryStateSlice & PreferenceStateSlice>
>;
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

export type Preferences = {
    /** Whether or not to save the content of request to the database. Should be set to false on the web. Does not take precedent over whether we save requests at all. */
    saveRequestContent: boolean | undefined;
    promptForCompanySuggestions: boolean;
    dismissedHints: HintId[];
};
type PreferenceStateSlice = Preferences & {
    setPreference: <Preference extends keyof Preferences>(
        preference: Preference,
        value: Preferences[Preference]
    ) => void;
    dismissHint: (hint: HintId) => void;
};

export const createPreferenceSlice: CombinedStateCreator<PreferenceStateSlice> = (set) => ({
    saveRequestContent: false,
    promptForCompanySuggestions: false,
    dismissedHints: [],

    setPreference: (preference, value) =>
        set(
            produce((state: Preferences) => {
                state[preference] = value;
            })
        ),
    dismissHint: (hint) =>
        set(
            produce((state) => {
                if (!state.dismissedHints.includes(hint)) state.dismissedHints.push(hint);
            })
        ),
});

export const appSettingsPersistOptions: PersistOptions<CountryStateSlice & PreferenceStateSlice> = {
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
export const useAppStore = create<CountryStateSlice & PreferenceStateSlice>(
    persist(
        (...a) => ({
            ...createCountrySlice(...a),
            ...createPreferenceSlice(...a),
        }),
        appSettingsPersistOptions
    )
);
