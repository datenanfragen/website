import create from 'zustand';
import { persist } from 'zustand/middleware';
import MiniSearch from 'minisearch';
import { PrivacyAsyncStorage, t_a, ErrorException, flash, FlashMessage, WarningException } from '../../index';
import type { Company, CompanyPack } from '../../../../src/types/company';
import type { Country } from '../../../../src/store/app';
import hardcodedOfflineData from '../../../../static/offline-data.json';
import { miniSearchOptions } from './search';

export type OfflineData = {
    date: string;
    'dump-format': number;

    companies: Company[];
    'company-packs': Partial<Record<Country, CompanyPack[]>>;
};

export const fetchOfflineData = async (): Promise<OfflineData> => {
    const dataUrl = `${window.BASE_URL}offline-data.json`;

    return fetch(dataUrl).then((res) => {
        if (res.status === 200)
            return res.json().then((r) => ({
                ...r,
                companies: JSON.parse(r.companies),
                'company-packs': JSON.parse(r['company-packs']),
            }));

        throw new ErrorException(
            'Fetching the request template failed.',
            { dataUrl, res },
            t_a('offline-search-update-error', 'settings')
        );
    });
};

const cacheStorage = new PrivacyAsyncStorage(() => true, { name: 'Datenanfragen.de', storeName: 'cache' });

export type CacheStore = OfflineData & {
    miniSearch: MiniSearch;

    updateOfflineData: () => Promise<void>;
};

const makeMiniSearch = (companies: Company[]) => {
    const miniSearch = new MiniSearch(miniSearchOptions);
    miniSearch.addAll(companies);
    return miniSearch;
};

export const useCacheStore = create<CacheStore>(
    persist(
        (set) => ({
            date: hardcodedOfflineData.date,
            'dump-format': hardcodedOfflineData['dump-format'],
            companies: JSON.parse(hardcodedOfflineData.companies),
            'company-packs': JSON.parse(hardcodedOfflineData['company-packs']),

            miniSearch: makeMiniSearch(JSON.parse(hardcodedOfflineData.companies)),

            updateOfflineData: () =>
                fetchOfflineData()
                    .then((offlineData) => {
                        if (offlineData['dump-format'] !== 1)
                            throw new WarningException(
                                'Unsupported offline dump format.',
                                { version: offlineData['dump-format'], date: offlineData.date },
                                t_a('error-unsupported-offline-data', 'app')
                            );

                        set({ ...offlineData, miniSearch: makeMiniSearch(offlineData.companies) });
                    })
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
