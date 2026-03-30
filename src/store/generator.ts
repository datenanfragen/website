import type { IdDataElement, Request, Signature, RequestType } from '../types/request';
import type { StoreSlice } from '../types/utility';
import create, { GetState, SetState } from 'zustand';
import { RequestState, createRequestStore } from './request';
import createContext from 'zustand/context';
import { CompanyState, createCompanyStore } from './company';
import { Privacy, PRIVACY_ACTIONS } from '../Utility/Privacy';
import { SavedIdData } from '../DataType/SavedIdData';
import { ErrorException, rethrow } from '../Utility/errors';
import { makePdfWorker } from '../Utility/workers';

export interface GeneratorSpecificState {
    ready: boolean;
    download_active: boolean;
    download_url?: string;
    download_filename?: string;
    fillFields: IdDataElement[];
    fillSignature: Signature;
    pdfWorker?: Worker;
    batchRequestType?: RequestType;
    setReady: () => void;
    setBusy: () => void;
    setDownload: (download_active: boolean, download_url?: string, download_filename?: string) => void;
    setBatchRequestType: (request_type: RequestType) => void;
    refreshFillFields: () => void;
    initiatePdfGeneration: () => void;
    renderLetter: () => void;
    resetInitialConditions: () => Promise<void>;
}

export type GeneratorState = RequestState<Request> & CompanyState & GeneratorSpecificState;

export const {
    Provider: RequestGeneratorProvider,
    useStore: useGeneratorStore,
    useStoreApi: useGeneratorStoreApi,
} = createContext<GeneratorState>();

const savedIdData = new SavedIdData();

const createGeneratorSpecificStore: StoreSlice<GeneratorSpecificState, RequestState<Request> & CompanyState> = (
    set,
    get
) => ({
    ready: true,
    download_active: false,
    fillFields: [],
    fillSignature: { type: 'text', name: '' },
    setReady: () => set({ ready: true }),
    setBusy: () => set({ ready: false }),
    setDownload: (download_active, download_url, download_filename) =>
        set({
            download_active,
            download_url,
            download_filename,
        }),
    setBatchRequestType: (batchRequestType) => set({ batchRequestType }),
    refreshFillFields: () => {
        if (Privacy.isAllowed(PRIVACY_ACTIONS.SAVE_ID_DATA)) {
            savedIdData.getAll(false).then((fillFields) => fillFields && set({ fillFields }));
            savedIdData.getSignature().then((fillSignature) => fillSignature && set({ fillSignature }));
        }
    },
    initiatePdfGeneration: () => {
        let pdfWorker = get().pdfWorker;
        if (!pdfWorker) pdfWorker = makePdfWorker();

        if (window.hugoDevMode) {
            // copy the worker to window if we are in a dev env to enable easy testing
            (window as typeof window & { pdfWorker: Worker }).pdfWorker = pdfWorker;
        }
        const onMessage = (message: MessageEvent<{ blob_url: string; filename: string }>) => {
            get().setDownload(true, message.data.blob_url, message.data.filename);
            get().setReady();
        };
        const onError = (error_event: ErrorEvent) =>
            rethrow(ErrorException.fromError(error_event.error), 'PdfWorker error');

        pdfWorker.addEventListener('message', onMessage);
        pdfWorker.addEventListener('error', onError);

        set({ pdfWorker });

        return () => {
            pdfWorker?.removeEventListener('message', onMessage);
            pdfWorker?.removeEventListener('error', onError);
        };
    },
    renderLetter: () => {
        get().setBusy();
        const letter = get().letter();

        if (get().request.transport_medium === 'email') {
            // TODO: Why are we doing this for emails? Maybe I'm missing something but I don't think this is used
            // anywhere. The `MailtoDropdown` generates this itself and doesn't rely on `downloadActive`.
            get().setDownload(
                true,
                URL.createObjectURL(
                    new Blob([letter.toEmailString(true)], {
                        type: 'text/plain',
                    })
                )
            );
            get().setReady();
        } else {
            get().setDownload(false);
            get().pdfWorker?.postMessage({
                pdfdoc: { doc: letter.toPdfDoc() },
                filename: get().letter_filename(),
            });
        }
    },
    resetInitialConditions: () => {
        get().refreshFillFields();
        get().setBusy();
        return get()
            .initializeFields()
            .then(() => get().refreshTemplate());
    },
});

const generatorStore = (set: SetState<GeneratorState>, get: GetState<GeneratorState>) => ({
    ...createRequestStore(set, get),
    ...createCompanyStore(set, get),
    ...createGeneratorSpecificStore(set, get),
});

const { devtools } =
    process.env.NODE_ENV === 'development' ? require('zustand/middleware') : { devtools: (d: unknown) => d };

export const createGeneratorStore =
    process.env.NODE_ENV === 'development' ? () => create(devtools(generatorStore)) : () => create(generatorStore);
