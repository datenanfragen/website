import create, { GetState, SetState } from 'zustand';
import { RequestState, createRequestStore } from './request';
import { CUSTOM_TEMPLATE_OPTIONS, IdDataElement, Request, ResponseType, Signature } from '../types/request.d';
import createContext from 'zustand/context';
import { CompanyState, createCompanyStore } from './company';
import type { StoreSlice } from '../types/utility';
import { Privacy, PRIVACY_ACTIONS } from '../Utility/Privacy';
import { SavedIdData } from '../DataType/SavedIdData';
// This will be replaced with an URL by the worker-loader plugin in webpack which is why eslint can't find a default import (TS can be tricked by defining a module).
// eslint-disable-next-line import/default
import PdfWorker from '../Utility/pdf.worker.ts';
import { rethrow } from '../Utility/errors';
import { UserRequests } from '../DataType/UserRequests';

export interface GeneratorSpecificState {
    ready: boolean;
    download_active: boolean;
    download_url?: string;
    download_filename?: string;
    fillFields: IdDataElement[];
    fillSignature: Signature;
    pdfWorker?: PdfWorker;
    setReady: () => void;
    setBusy: () => void;
    setDownload: (download_active: boolean, download_url?: string, download_filename?: string) => void;
    refreshFillFields: () => void;
    initiatePdfGeneration: () => void;
    renderLetter: () => void;
    resetInitialConditions: (response_to?: string, response_type?: ResponseType) => Promise<void>;
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
    refreshFillFields: () => {
        if (Privacy.isAllowed(PRIVACY_ACTIONS.SAVE_ID_DATA)) {
            savedIdData.getAll(false).then((fillFields) => fillFields && set({ fillFields }));
            savedIdData.getSignature().then((fillSignature) => fillSignature && set({ fillSignature }));
        }
    },
    initiatePdfGeneration: () => {
        let pdfWorker = get().pdfWorker;
        if (!pdfWorker) pdfWorker = new PdfWorker();

        if ((window as typeof window & { hugoDevMode: boolean }).hugoDevMode) {
            // copy the worker to window if we are in a dev env to enable easy testing
            (window as typeof window & { pdfWorker: PdfWorker }).pdfWorker = pdfWorker;
        }
        const onMessage = (message: MessageEvent<{ blob_url: string; filename: string }>) => {
            get().setDownload(true, message.data.blob_url, message.data.filename);
            get().setReady();
        };
        const onError = (error: ErrorEvent) => rethrow(error, 'PdfWorker error');

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
    resetInitialConditions: (response_to, response_type) => {
        get().refreshFillFields();
        get().setBusy();
        return get()
            .initializeFields()
            .then(() => {
                // This is a response to a previous request (warning or complaint).
                if (Privacy.isAllowed(PRIVACY_ACTIONS.SAVE_MY_REQUESTS) && response_to && response_type) {
                    // Just for the looks: Switch the view before fetching the template
                    get().setRequestType('custom');

                    return new UserRequests()
                        .getRequest(response_to)
                        .then((request) => {
                            if (request) {
                                return get()
                                    .setCustomLetterTemplate(
                                        CUSTOM_TEMPLATE_OPTIONS.includes(response_type) ? response_type : 'no-template',
                                        request
                                    )
                                    .then(() => request);
                            }
                            throw new Error('No user request found');
                        })
                        .then((request) => {
                            if (response_type === 'admonition' && request?.slug) {
                                return get().setCompanyBySlug(request.slug);
                            }
                        })
                        .catch((e) => {
                            /* Fail silently when no user request was found */
                            if (e.message !== 'No user request found') rethrow(e);
                        });
                }

                // This is just a regular ol' request.
                return get().refreshTemplate().then(get().setReady);
            });
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
