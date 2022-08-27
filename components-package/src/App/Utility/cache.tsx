import { PrivacyAsyncStorage, t_a, ErrorException, flash, FlashMessage } from '../../index';
import create from 'zustand';
import { persist } from 'zustand/middleware';

const cacheStorage = new PrivacyAsyncStorage(() => true, { name: 'Datenanfragen.de', storeName: 'cache' });

export const fetchOfflineData = async (): Promise<string> => {
    const dataUrl = `${window.BASE_URL}offline-data.json`;

    return fetch(dataUrl).then((res) => {
        if (res.status === 200) return res.text();

        throw new ErrorException(
            'Fetching the request template failed.',
            { dataUrl, res },
            t_a('offline-search-update-error', 'settings')
        );
    });
};

export type CacheStore = {
    offlineData: string | undefined;
    updateOfflineData: () => Promise<void>;
};

export const useCacheStore = create<CacheStore>(
    persist(
        (set, get) => ({
            offlineData: undefined,
            updateOfflineData: () =>
                fetchOfflineData()
                    .then((offlineData) => set({ offlineData }))
                    .then(() =>
                        flash(
                            <FlashMessage type="success">
                                {t_a('offline-search-update-success', 'settings')}
                            </FlashMessage>
                        )
                    ),
        }),
        {
            name: 'Datenanfragen.de-cache',
            version: 0,
            getStorage: () => cacheStorage,
        }
    )
);
