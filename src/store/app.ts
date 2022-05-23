import create, { SetState } from 'zustand';
import { persist } from 'zustand/middleware';
import type i18n_definition_type from '../i18n/en.json';

export type Country = Exclude<keyof typeof i18n_definition_type['countries'], '__taken_from'>;
type AppState = {
    countrySet: boolean;
    country: Country;

    changeCountry: (new_country: Country) => void;
};

// TODO: Also move privacy controls and other settings in here (and remember to migrate their existing values!).
export const useAppStore = create(
    persist(
        (set: SetState<AppState>) => ({
            countrySet: false,
            country: 'all' as Country,

            changeCountry: (new_country: Country) => set({ country: new_country, countrySet: true }),
        }),
        {
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
        }
    )
);
