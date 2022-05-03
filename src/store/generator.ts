import create, { GetState, SetState } from 'zustand';
import { RequestState, createRequestStore } from './request';
import type { IdDataElement, Request, Signature } from '../types/request';
import createContext from 'zustand/context';
import { CompanyState, createCompanyStore } from './company';
import type { StoreSlice } from 'utility';
import Privacy, { PRIVACY_ACTIONS } from '../Utility/Privacy';
import { SavedIdData } from '../Utility/SavedIdData';

export interface GeneratorSpecificState {
    ready: boolean;
    download_active: boolean;
    download_url?: string;
    download_filename?: string;
    fillFields: IdDataElement[];
    fillSignature: Signature;
    setBusy: () => void;
    setReady: () => void;
    setDownload: (download_active: boolean, download_url?: string, download_filename?: string) => void;
    refreshFillFields: () => void;
}

export type GeneratorState = RequestState<Request> & CompanyState & GeneratorSpecificState;

export const { Provider: RequestGeneratorProvider, useStore: useGeneratorStore } = createContext<GeneratorState>();

const savedIdData = new SavedIdData();

const createGeneratorSpecificStore: StoreSlice<GeneratorSpecificState, RequestState<Request> & CompanyState> = (
    set,
    get
) => ({
    ready: true,
    download_active: false,
    fillFields: [],
    fillSignature: { type: 'text', name: '' },
    setReady: () => {
        set({ ready: true });
    },
    setBusy: () => {
        set({ ready: false });
    },
    setDownload: (download_active, download_url, download_filename) =>
        set({
            download_active,
            download_url,
            download_filename,
        }),
    refreshFillFields: () => {
        if (Privacy.isAllowed(PRIVACY_ACTIONS.SAVE_ID_DATA)) {
            savedIdData.getAll(false).then((fillFields) => fillFields && set({ fillFields }));
            savedIdData.getSignature().then((fillSignature) => fillSignature && set({ fillSignature }));
        }
    },
});

export const createGeneratorStore = () =>
    create((set: SetState<GeneratorState>, get: GetState<GeneratorState>) => ({
        ...createRequestStore(set, get),
        ...createCompanyStore(set, get),
        ...createGeneratorSpecificStore(set, get),
    }));
