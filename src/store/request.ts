import type {
    Request,
    IdDataElement,
    DataField,
    RequestType,
    ErasureRequest,
    Address,
    AccessRequest,
    TransportMedium,
    RectificationRequest,
    RequestFlag,
} from '../types/request';
import { SetState, GetState } from 'zustand';
import {
    isAddress,
    defaultRequest,
    REQUEST_FALLBACK_LANGUAGE,
    fetchTemplate,
    isSaneDataField,
} from '../Utility/requests';
import UserRequests from '../my-requests';
import produce from 'immer';
import RequestLetter from '../Utility/RequestLetter';
import { t_r } from '../Utility/i18n';

export interface RequestState<R extends Request> {
    request: R;
    template: string;
    company_suggestion?: any; // TODO: remove this placeholder!!!
    storeRequest: () => void;
    addField: (field: IdDataElement, data_field: DataField<R>) => void;
    removeField: (index: number, data_field: DataField<R>) => void;
    setFieldValue: (index: number, value: IdDataElement['value'], data_field: DataField<R>) => void;
    setFieldDesc: (index: number, desc: string, data_field: DataField<R>) => void;
    setRequestType: (type: RequestType) => void;
    setTransportMedium: (transport_medium: TransportMedium) => void;
    setRecipientAddress: (recipient_address: string) => void;
    setRecipientEmail: (email: string) => void;
    setRequestFlag: (flag: RequestFlag) => void;
    resetRequestToDefault: (language?: string) => void;
    refreshTemplate: () => void;
    letter: () => RequestLetter;
}

const default_language = Object.keys(window.I18N_DEFINITION_REQUESTS).includes(window.LOCALE)
    ? window.LOCALE
    : REQUEST_FALLBACK_LANGUAGE;

export const createRequestStore = (
    set: SetState<RequestState<Request>>,
    get: GetState<RequestState<Request>>
): RequestState<Request> => ({
    request: defaultRequest(REQUEST_FALLBACK_LANGUAGE),
    template: '',
    storeRequest: () => {
        const state = get();
        const db_id = `${state.request.reference}-${state.request.type}${
            state.request.type === 'custom' && state.request.response_type ? `-${state.request.response_type}` : ''
        }`;

        const item = {
            reference: state.request.reference,
            date: state.request.date,
            type: state.request.type,
            response_type: state.request.type === 'custom' ? state.request.response_type : '',
            slug: state.request.slug,
            recipient: state.request.recipient_address,
            email: state.request.email,
            via: state.request.transport_medium,
        };
        new UserRequests().storeRequest(db_id, item);
    },
    addField: (field, data_field) =>
        set(
            produce((state: RequestState<Request>) => {
                if (isSaneDataField(data_field, state.request.type)) {
                    state.request[data_field].push(field);
                    if (data_field === 'id_data') ensurePrimaryAddress(state.request.id_data);
                }
            })
        ),
    removeField: (index, data_field) =>
        set(
            produce((state: RequestState<Request>) => {
                if (isSaneDataField(data_field, state.request.type)) {
                    if (!state.request[data_field][index]) throw new Error('index out of bounds');
                    state.request[data_field].splice(index, 1);
                    if (data_field === 'id_data') ensurePrimaryAddress(state.request.id_data);
                }
            })
        ),
    setFieldValue: (index, value, data_field) =>
        set(
            produce((state: RequestState<Request>) => {
                if (isSaneDataField(data_field, state.request.type)) {
                    if (isAddress(value) && isAddress(state.request[data_field][index].value)) {
                        // Address changes need to have their primary status checked
                        if ((state.request[data_field][index].value as Address).primary !== value.primary) {
                            // Only change the primary adresses if the primary value of the current field changed
                            let addresses = 0;
                            state.request[data_field].forEach((field: IdDataElement, i: number) => {
                                if (field.type === 'address') {
                                    // Set the first address to primary if the current change is to non-primary,
                                    // otherwise change all adresses to non-primary (we overwrite this with our change later)
                                    field.value.primary = addresses++ === 0 && !value.primary;
                                }
                            });
                        }
                    }
                    state.request[data_field][index].value = value;
                } // TODO: Should we error here?
            })
        ),
    setFieldDesc: (index, desc, data_field) =>
        set(
            produce((state: RequestState<Request>) => {
                if (isSaneDataField(data_field, state.request.type)) {
                    state.request[data_field][index].desc = desc;
                }
            })
        ),
    setRequestType: (type) => {
        set(
            produce((state: RequestState<Request>) => {
                state.request.type = type;
            })
        );
        get().refreshTemplate();
    },
    setTransportMedium: (transport_medium) => {
        const by_fax_text = t_r('by-fax', get().request.language);

        set(
            produce((state: RequestState<Request>) => {
                if (transport_medium === 'fax') {
                    if (state.company_suggestion && !state.request.recipient_address.includes(by_fax_text)) {
                        state.request.recipient_address += '\n' + by_fax_text + (state.company_suggestion.fax || '');
                    }
                } else {
                    state.request.recipient_address = state.request.recipient_address.replace(
                        new RegExp('(?:\\r\\n|\\r|\\n)' + by_fax_text + '\\+?[0-9\\s]*', 'gm'),
                        ''
                    );
                }

                state.request.transport_medium = transport_medium;
                if (state.request.type === 'access') state.request.data_portability = transport_medium === 'email';
            })
        );
    },
    setRecipientAddress: (recipient_address) =>
        set(
            produce((state: RequestState<Request>) => {
                state.request.recipient_address = recipient_address;
            })
        ),
    setRecipientEmail: (email) =>
        set(
            produce((state: RequestState<Request>) => {
                state.request.email = email;
            })
        ),
    setRequestFlag: (flag) =>
        set(
            produce((state: RequestState<Request>) => {
                switch (state.request.type) {
                    case 'access':
                        if (flag.name === 'data_portability') state.request.data_portability = flag.value;
                        break;
                    case 'erasure':
                        if (flag.name === 'erase_all') state.request.erase_all = flag.value;
                        if (flag.name === 'erasure_data') state.request.erasure_data = flag.value;
                }
            })
        ),
    resetRequestToDefault: (language) => {
        set((state) => ({
            request: defaultRequest(language || REQUEST_FALLBACK_LANGUAGE),
        }));
        get().refreshTemplate();
    },
    refreshTemplate: async () => {
        const template = await fetchTemplate(get().request.language, get().request.type); // TODO: include company info
        if (template)
            set({
                template,
            });
    },
    letter: () => RequestLetter.fromRequest(get().request, get().template, {}),
});

function ensurePrimaryAddress(fields: IdDataElement[]) {
    if (!fields.find((f) => f.type === 'address' && f.value.primary)) {
        const address = fields.find((f) => f.type === 'address');
        if (address) (address.value as Address).primary = true;
    }
}
