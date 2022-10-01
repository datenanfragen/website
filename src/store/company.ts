import type { Request } from '../types/request';
import type { Company, SupervisoryAuthority } from '../types/company';
import type { StoreSlice } from '../types/utility';
import { RequestState } from './request';
import { fetchCompanyDataBySlug } from '../Utility/companies';
import { trackingFields, defaultFields, inferRequestLanguage, shouldBeTrackingRequest } from '../Utility/requests';
import type { GeneratorSpecificState, GeneratorState } from './generator';
import { produce } from 'immer';
import { SavedIdData } from '../DataType/SavedIdData';

export interface CompanyState {
    current_company?: Company | SupervisoryAuthority;
    batch?: string[];
    setCompanyBySlug: (slug: string) => Promise<void>;
    setCompany: (company: Company) => Promise<void>;
    setSva: (sva: SupervisoryAuthority) => Promise<void>;
    removeCompany: () => Promise<void>;
    startBatch: (batch: string[]) => Promise<void>;
    advanceBatch: () => Promise<void>;
    clearBatch: () => void;
    hasBatch: () => boolean | undefined;
}

export const createCompanyStore: StoreSlice<CompanyState, RequestState<Request> & GeneratorSpecificState> = (
    set,
    get
) => ({
    setCompany: async (company) => {
        set(
            produce((state: GeneratorState) => {
                state.current_company = company;
                state.request.language = inferRequestLanguage(company);
                state.request.slug = company.slug;
                state.request.recipient_runs = company.runs || [];

                state.request.is_tracking_request = shouldBeTrackingRequest(company, state.request.type);

                const intermediate_id_data = SavedIdData.mergeFields(
                    state.request.id_data,
                    company['required-elements'] && company['required-elements'].length > 0
                        ? company['required-elements']
                        : state.request.is_tracking_request
                        ? trackingFields(state.request.language)
                        : defaultFields(state.request.language),
                    false,
                    true,
                    false,
                    false,
                    true
                );

                state.request.id_data = SavedIdData.mergeFields(
                    intermediate_id_data,
                    get().fillFields,
                    true,
                    true,
                    true,
                    true,
                    false
                );
            })
        );

        // Set other data this way to allow for side effects
        get().setRecipientEmail(company['email'] ?? '');
        get().setRecipientAddress(`${company['name']}\n${company['address']}` ?? '');
        get().setTransportMedium(
            company['suggested-transport-medium']
                ? company['suggested-transport-medium']
                : company.email
                ? 'email'
                : 'letter'
        );
        if (get().current_company && get().request.type !== 'custom') {
            return get().refreshTemplate();
        }
    },
    setSva: async (sva) => {
        get().setRequestType('custom');

        if (sva) {
            set(
                produce((state: GeneratorState) => {
                    state.current_company = sva;
                    state.request.language = inferRequestLanguage(sva);
                    state.request.slug = sva.slug;
                    state.request.recipient_runs = [];
                })
            );
        }

        // Set other data this way to allow for side effects
        get().setRecipientEmail(sva['email'] ?? '');
        get().setRecipientAddress(`${sva['name']}\n${sva['address']}` ?? '');
        get().setTransportMedium(
            sva['suggested-transport-medium'] ? sva['suggested-transport-medium'] : sva.email ? 'email' : 'letter'
        );
    },
    setCompanyBySlug: (slug) =>
        fetchCompanyDataBySlug(slug).then((company) => {
            return get().setCompany(company);
        }),
    removeCompany: () => {
        set(
            produce((state: GeneratorState) => {
                state.current_company = undefined;
                state.request.slug = '';
                state.request.recipient_runs = [];
                state.request.language = inferRequestLanguage();
            })
        );
        return get().refreshTemplate();
    },
    startBatch: async (batch) => {
        if (batch.length > 0) {
            const first_company = batch.shift() as string;
            set({ batch });
            return get().setCompanyBySlug(first_company);
        }
    },
    advanceBatch: async () => {
        if (get().hasBatch()) {
            let company: string | undefined;
            set(
                produce((state: GeneratorState) => {
                    company = state.batch?.shift();
                })
            );
            return company ? get().setCompanyBySlug(company) : undefined;
        }
    },
    clearBatch: () => set({ batch: undefined }),
    hasBatch: () => {
        const batch = get().batch;
        return batch && batch.length > 0;
    },
});
