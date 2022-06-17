import type { Request } from '../types/request';
import type { Company, SupervisoryAuthority } from '../types/company';
import type { StoreSlice } from '../types/utility';
import { RequestState } from './request';
import { fetchCompanyDataBySlug } from '../Utility/companies';
import { trackingFields, defaultFields, inferRequestLanguage } from '../Utility/requests';
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
    appendToBatch: (companies: Company | Company[]) => void;
    appendToBatchBySlug: (companySlugs: string | string[]) => Promise<void>;
    removeFromBatch: (companySlug: string) => void;
    advanceBatch: () => Promise<void>;
    markCurrentBatchCompanyDone: () => void;
    selectBatchCompanyRuns: (slug: string, runs_selected: string[]) => void;
    clearBatch: () => void;
    hasBatch: () => boolean | undefined;
}

export const createCompanyStore: StoreSlice<CompanyState, RequestState<Request> & GeneratorSpecificState> = (
    set,
    get
) => ({
    // TODO: Undo.
    batch: {
        'a1-austria': {
            company: {
                slug: 'a1-austria',
                'relevant-countries': ['at'],
                categories: ['telecommunication'],
                name: 'A1 Telekom Austria AG',
                address: 'Lassallestraße 9\n1020 Wien\nÖsterreich',
                phone: '+43 050 664 0',
                web: 'https://www.a1.net',
                sources: [
                    'https://cdn12.a1.net/m/resources/media/pdf/Informationspflichten-und-Zustimmungserklaerung-A1.pdf',
                    'https://www.a1.net/impressum',
                ],
                'request-language': 'de',
                'needs-id-document': true,
                'suggested-transport-medium': 'letter',
                quality: 'verified',
            },
            done: false,
        },
        schufa: {
            company: {
                address: 'Kormoranweg 5\n65201 Wiesbaden\nDeutschland',
                categories: ['credit agency'],
                comments: [
                    'Frühere Adresse nur angeben, wenn sie sich in den letzten 12 Monaten geändert hat.',
                    'Entgegen der Angaben im Formular der Schufa ist in aller Regel keine Kopie des Personalausweises oder Reisepasses nötig.',
                ],
                email: 'datenschutz@schufa.de',
                fax: '+49 611 9278 109',
                name: 'SCHUFA Holding AG',
                'needs-id-document': false,
                phone: '+49 611 92789278',
                quality: 'tested',
                'relevant-countries': ['de'],
                'required-elements': [
                    {
                        desc: 'Name',
                        type: 'name',
                    },
                    {
                        desc: 'Adresse',
                        type: 'address',
                    },
                ],
                slug: 'schufa',
                sources: [
                    'https://www.meineschufa.de/index.php?site=11_3_1',
                    'https://www.schufa.de/de/datenschutz/',
                    'https://www.schufa.de/de/impressum/',
                ],
                'suggested-transport-medium': 'email',
                web: 'https://www.schufa.de',
            },
            done: false,
        },
        datenanfragen: {
            company: {
                address: 'Schreinerweg 6\n38126 Braunschweig\nDeutschland',
                categories: ['nonprofit'],
                email: 'datenschutz@datenanfragen.de',
                fax: '+49 531 20929936',
                name: 'Datenanfragen.de e. V.',
                'pgp-fingerprint': 'CC13 973A F8FD 11D1 4D94  98A8 0269 92F0 CF2C BB2E',
                'pgp-url': 'https://www.datenanfragen.de/pgp/CF2CBB2E.asc',
                phone: '+49 531 20929935',
                quality: 'verified',
                'relevant-countries': ['all'],
                runs: [
                    'Datenanfragen.de',
                    'datarequests.org',
                    'pedidodedados.org',
                    'demandetesdonnees.fr',
                    'solicituddedatos.es',
                ],
                slug: 'datenanfragen',
                sources: [
                    'https://verein.datenanfragen.de/datenschutz',
                    'https://github.com/datenanfragen/data/issues/595',
                    'https://github.com/datenanfragen/data/pull/968',
                ],
                'suggested-transport-medium': 'email',
                web: 'https://verein.datenanfragen.de',
            },
            done: false,
        },
        'gabriele-altpeter-internethandel': {
            company: {
                address: 'Schreinerweg 6\n38126 Braunschweig\nDeutschland',
                categories: ['commerce'],
                email: 'datenschutz@gabriele-altpeter.info',
                fax: '+49 531 615 4 288',
                name: 'Gabriele Altpeter, Internethandel',
                'pgp-fingerprint': 'BCA8 A5F2 2F7F D05A ED67  EE2B FE5B E03D 78C1 CF0F',
                'pgp-url': 'https://gabriele-altpeter.info/pgp-key-privacy.asc',
                phone: '+49 531 615 4 710',
                quality: 'verified',
                'relevant-countries': ['de'],
                runs: ['hexteQ.'],
                slug: 'gabriele-altpeter-internethandel',
                sources: ['https://gabriele-altpeter.info/privacy.html', 'https://www.hexteq.de/privacy.html'],
                'suggested-transport-medium': 'email',
                web: 'https://gabriele-altpeter.info',
            },
            done: false,
        },
        'gabriele-altpeter-internet-marketing-services': {
            company: {
                address: 'Schreinerweg 6\n38126 Braunschweig\nDeutschland',
                categories: ['ads', 'entertainment'],
                email: 'datenschutz@gabriele-altpeter.info',
                fax: '+49 531 615 4 288',
                name: 'Gabriele Altpeter, Internet Marketing-Services',
                'pgp-fingerprint': 'BCA8 A5F2 2F7F D05A ED67  EE2B FE5B E03D 78C1 CF0F',
                'pgp-url': 'https://gabriele-altpeter.info/pgp-key-privacy.asc',
                phone: '+49 531 615 4 710',
                quality: 'verified',
                'relevant-countries': ['all'],
                runs: [
                    'Foodblog kochfokus.de',
                    'Foodblog deliciouslygabi.com',
                    'Foodcommunity topfies.de',
                    'SomePublisher (somepublisher.com)',
                    'Damnick Verlag (damnick.de)',
                ],
                runs_selected: [
                    'Foodblog kochfokus.de',
                    'Foodblog deliciouslygabi.com',
                    'Foodcommunity topfies.de',
                    'SomePublisher (somepublisher.com)',
                    'Damnick Verlag (damnick.de)',
                ],
                slug: 'gabriele-altpeter-internet-marketing-services',
                sources: [
                    'https://gabriele-altpeter.info/privacy.html',
                    'https://kochfokus.de/privacy/',
                    'https://deliciouslygabi.com/privacy/',
                    'https://www.topfies.de/privacy/',
                    'https://somepublisher.com/privacy/',
                    'https://damnick.de/privacy/',
                ],
                'suggested-transport-medium': 'email',
                web: 'https://gabriele-altpeter.info',
            },
            done: false,
        },
    },

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
                for (const company of Array.isArray(companies) ? companies : [companies])
                    state.batch[company.slug] = { company, done: false };
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
        if (firstCompany) return get().setCompany(firstCompany);
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
                if (!get().hasBatch() || !get().batch![slug]) return; // TODO: Error here?

                state.batch![slug].company.runs_selected = runs_selected;
            })
        ),
    hasBatch: () => {
        const batch = get().batch;
        return batch && Object.keys(batch).length > 0;
    },
});
