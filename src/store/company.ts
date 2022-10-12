import type { Request, RequestType } from '../types/request';
import type { Company, SupervisoryAuthority } from '../types/company';
import type { StoreSlice } from '../types/utility';
import { RequestState } from './request';
import { fetchCompanyDataBySlug } from '../Utility/companies';
import { trackingFields, defaultFields, inferRequestLanguage } from '../Utility/requests';
import { ErrorException } from '../Utility/errors';
import type { GeneratorSpecificState, GeneratorState } from './generator';
import { produce } from 'immer';
import { SavedIdData } from '../DataType/SavedIdData';

type BatchEntry = { company: Company; done: boolean };

export interface CompanyState {
    current_company?: Company | SupervisoryAuthority;
    batch?: Record<string, BatchEntry>;
    setCompanyBySlug: (slug: string) => Promise<void>;
    setCompany: (company: Company) => Promise<void>;
    setSva: (sva: SupervisoryAuthority) => Promise<void>;
    removeCompany: () => Promise<void>;
    appendToBatch: (companies: Company | (Company | undefined)[]) => void;
    appendToBatchBySlug: (companySlugs: string | string[]) => Promise<void>;
    removeFromBatch: (companySlug: string) => void;
    advanceBatch: () => Promise<void>;
    markCurrentBatchCompanyDone: () => void;
    selectBatchCompanyRuns: (slug: string, runs_selected: string[]) => void;
    setBatchCompanyCustomTemplate: (
        slug: string,
        requestType: Exclude<RequestType, 'custom'>,
        template: string | undefined
    ) => void;
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
                state.request.recipient_runs = company.runs_selected || company.runs || [];

                // This is not the most elegant thing in the world, but we need to support 'no ID data' requests for
                // more than adtech companies. Ideally, this would be another bool in the schema but we can't really
                // change that right now because of Typesense. Thus, we have to stick to matching the template for now.
                // And I have realized that our current adtech case also applies to pretty much all other 'no ID data'
                // requests anyway in that they are either also to tracking companies or those companies at least
                // identify the user by the same details (i.e. cookie IDs, device IDs, etc.)
                // I couldn't come up with a better name, so we'll just leave them as tracking requests, I guess…
                state.request.is_tracking_request = [
                    'access-tracking',
                    'erasure-tracking',
                    'rectification-tracking',
                    'objection-tracking',
                ].includes(company[`custom-${state.request.type}-template`] ?? '');

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
    setCompanyBySlug: (slug) => fetchCompanyDataBySlug(slug).then((company) => get().setCompany(company)),
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
    appendToBatch: (companies) =>
        set(
            produce((state: GeneratorState) => {
                if (!state.batch) state.batch = {};
                for (const company of (Array.isArray(companies) ? companies : [companies]).filter(
                    (c): c is Company => c !== undefined
                ))
                    state.batch[company.slug] = {
                        company: { ...company, runs_selected: [...(company.runs || [])] },
                        done: false,
                    };
            })
        ),
    appendToBatchBySlug: (companySlugs: string | string[]) =>
        Promise.all(
            (Array.isArray(companySlugs) ? companySlugs : [companySlugs]).map((s) => fetchCompanyDataBySlug(s))
        ).then((companies) => get().appendToBatch(companies)),
    removeFromBatch: (companySlug) => set(produce((state: GeneratorState) => void delete state.batch?.[companySlug])),
    clearBatch: () => set({ batch: undefined }),
    advanceBatch: async () => {
        if (!get().hasBatch()) return;

        const firstCompany = Object.values(get().batch!).filter((c) => !c.done)[0]?.company;
        if (firstCompany) {
            get().setRequestType(get().batchRequestType || 'access');
            return get().setCompany(firstCompany);
        }
    },
    markCurrentBatchCompanyDone: () =>
        set(
            produce((state: GeneratorState) => {
                if (!get().hasBatch() || !get().current_company) return;

                state.batch![get().current_company!.slug].done = true;
            })
        ),
    selectBatchCompanyRuns: (slug, runs_selected) =>
        set(
            produce((state: GeneratorState) => {
                if (!get().hasBatch() || !get().batch![slug])
                    throw new ErrorException(
                        'Tried to selectBatchCompanyRuns without batch or for company not in batch.',
                        { batch: get().batch, slug }
                    );

                state.batch![slug].company.runs_selected = runs_selected;
            })
        ),
    setBatchCompanyCustomTemplate: (slug, type, template) =>
        set(
            produce((state: GeneratorState) => {
                if (!get().hasBatch() || !get().batch![slug])
                    throw new ErrorException(
                        'Tried to setBatchCompanyCustomTemplate without batch or for company not in batch.',
                        { batch: get().batch, slug }
                    );

                state.batch![slug].company[`custom-${type}-template`] = template;
            })
        ),
    hasBatch: () => {
        const batch = get().batch;
        return batch && Object.keys(batch).length > 0;
    },
});
