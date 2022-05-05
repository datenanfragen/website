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
    Signature,
    CustomTemplateName,
    CustomLetterData,
    CustomRequest,
} from '../types/request';
import { SetState, GetState } from 'zustand';
import {
    isAddress,
    defaultRequest,
    REQUEST_FALLBACK_LANGUAGE,
    fetchTemplate,
    isSaneDataField,
    REQUEST_ARTICLES,
    inferRequestLanguage,
} from '../Utility/requests';
import { UserRequests, UserRequest } from '../DataType/UserRequests';
import { produce } from 'immer';
import { RequestLetter } from '../DataType/RequestLetter';
import { t_r } from '../Utility/i18n';
import { rethrow, WarningException } from '../Utility/errors';
import type { StoreSlice } from 'utility';
import { CompanyState } from './company';
import type { GeneratorSpecificState, GeneratorState } from './generator';
import type { RequestLanguage, Company } from '../types/company';
import { slugify } from '../Utility/common';
import Privacy, { PRIVACY_ACTIONS } from '../Utility/Privacy';
import { SavedIdData } from '../DataType/SavedIdData';
import { Template } from 'letter-generator';

export interface RequestState<R extends Request> {
    request: R;
    template: string;
    storeRequest: () => Promise<UserRequest | void>;
    addField: (field: IdDataElement, data_field: DataField<R>) => void;
    removeField: (index: number, data_field: DataField<R>) => void;
    setField: (index: number, field: IdDataElement, data_field: DataField<R>) => void;
    setRequestType: (type: RequestType) => void;
    setTransportMedium: (transport_medium: TransportMedium) => void;
    setRecipientAddress: (recipient_address: string) => void;
    setRecipientEmail: (email: string) => void;
    setRequestFlag: (flag: RequestFlag) => void;
    setDate: (date: string) => void;
    setInformationBlock: (information_block: string) => void;
    setSignature: (signature: Signature) => void;
    // I would've liked to avoid specific functions here, but I guess I can't help it
    setCustomLetterTemplate: (template_name: CustomTemplateName, response_to?: UserRequest) => Promise<void>;
    setCustomLetterProperty: (property: keyof Omit<CustomLetterData, 'sender_address'>, value: string) => void;
    setCustomLetterAddress: (address: Address) => void;
    setSent: (sent: boolean) => void;
    resetRequestToDefault: (language?: string) => void;
    initializeFields: (data_field?: DataField<R>) => Promise<void>;
    refreshTemplate: () => Promise<void>;
    letter: () => RequestLetter;
    letter_filename: () => string;
}

export const createRequestStore: StoreSlice<RequestState<Request>, CompanyState & GeneratorSpecificState> = (
    set,
    get
) => ({
    request: defaultRequest(inferRequestLanguage()),
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
            response_type: state.request.type === 'custom' ? state.request.response_type : undefined,
            slug: state.request.slug,
            recipient: state.request.recipient_address,
            email: state.request.email,
            via: state.request.transport_medium,
        };
        return new UserRequests().storeRequest(db_id, item);
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
    setField: (index, field, data_field) =>
        set(
            produce((state: RequestState<Request>) => {
                if (isSaneDataField(data_field, state.request.type)) {
                    if (state.request[data_field][index].type === 'address' && field.type === 'address') {
                        // Address changes need to have their primary status checked
                        if ((state.request[data_field][index].value as Address).primary !== field.value.primary) {
                            // Only change the primary adresses if the primary value of the current field changed
                            let addresses = 0;
                            state.request[data_field].forEach((field: IdDataElement, i: number) => {
                                if (field.type === 'address' && field === state.request[data_field][index]) {
                                    // Set the first address (not equal to the current one) to primary if the current change is to non-primary,
                                    // otherwise change all adresses to non-primary (we overwrite this with our change later)
                                    field.value.primary = addresses++ === 0 && !field.value.primary;
                                }
                            });
                            if (addresses === 0) field.value.primary = true; // if there is only one address, it needs to primary regardless
                        }
                    }
                    state.request[data_field][index] = field;
                } // TODO: Should we error here?
            })
        ),
    setRequestType: (type) => {
        set(
            produce((state: RequestState<Request>) => {
                state.request.type = type;
                if (state.request.type === 'custom')
                    state.request.custom_data = makeCustomDataFromIdData(state.request);
            })
        );
        get().refreshTemplate();
    },
    setTransportMedium: (transport_medium) => {
        const by_fax_text = t_r('by-fax', get().request.language);

        set(
            produce((state: RequestState<Request> & CompanyState) => {
                if (transport_medium === 'fax') {
                    if (state.current_company && !state.request.recipient_address.includes(by_fax_text)) {
                        state.request.recipient_address += '\n' + by_fax_text + (state.current_company.fax || '');
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
    setDate: (date) =>
        set(
            produce((state: RequestState<Request>) => {
                state.request.date = date;
            })
        ),
    setInformationBlock: (information_block) =>
        set(
            produce((state: RequestState<Request>) => {
                state.request.information_block = information_block;
            })
        ),
    setSignature: (signature) =>
        set(
            produce((state: RequestState<Request>) => {
                state.request.signature = signature;
            })
        ),
    setCustomLetterTemplate: async (template_name, response_to) => {
        if (get().request.type === 'custom') {
            if (template_name !== 'no-template') {
                get().setBusy();
                return fetchTemplate(get().request.language, template_name, undefined, '').then((text) => {
                    set(
                        produce((state: RequestState<Request>) => {
                            if (state.request.type === 'custom') {
                                if (response_to) {
                                    const variables = {
                                        request_date: response_to.date,
                                        request_recipient: response_to.recipient?.split('\n')[0],
                                        request_recipient_address: response_to.recipient,
                                    };
                                    state.request.custom_data.content = text
                                        ? new Template(
                                              text,
                                              {},
                                              response_to.type === 'custom'
                                                  ? variables
                                                  : {
                                                        ...variables,
                                                        request_article: REQUEST_ARTICLES[response_to.type],
                                                    }
                                          ).getText()
                                        : '';

                                    state.request.custom_data.subject = t_r(
                                        `letter-subject-${template_name}`,
                                        state.request.language,
                                        response_to.type === 'custom'
                                            ? variables
                                            : {
                                                  ...variables,
                                                  request_article: REQUEST_ARTICLES[response_to.type],
                                              }
                                    );

                                    if (template_name === 'admonition') {
                                        get().setTransportMedium(response_to.via);
                                        state.request.email = response_to.email;
                                        state.request.recipient_address = response_to.via;
                                    }

                                    state.request.reference = response_to.reference;
                                    state.request.response_type = template_name;
                                } else {
                                    state.request.custom_data.content = text ?? '';
                                    state.request.response_type = template_name;
                                }
                            }
                        })
                    );
                    get().setReady();
                });
            }

            set(
                produce((state: RequestState<Request>) => {
                    if (state.request.type === 'custom') {
                        state.request.response_type = undefined;
                    }
                })
            );
        }
        throw new WarningException(
            "Custom request templates can only be set for a custom request (request.type !== 'custom')."
        );
    },
    setCustomLetterProperty: (property, value) => {
        if (get().request.type === 'custom') {
            set(
                produce((state: RequestState<Request>) => {
                    if (state.request.type === 'custom') {
                        state.request.custom_data[property] = value;
                    }
                })
            );
        } else {
            throw new WarningException(
                "Custom request templates can only be set for a custom request (request.type !== 'custom')."
            );
        }
    },
    setCustomLetterAddress: (address) => {
        if (get().request.type === 'custom') {
            set(
                produce((state: RequestState<Request>) => {
                    if (state.request.type === 'custom') {
                        state.request.custom_data.sender_address = address;
                    }
                })
            );
        } else {
            throw new WarningException(
                "Custom request templates can only be set for a custom request (request.type !== 'custom')."
            );
        }
    },
    setSent: (sent = true) =>
        set(
            produce((state: RequestState<Request>) => {
                state.request.sent = sent;
            })
        ),
    resetRequestToDefault: (language) => {
        set(() => ({
            request: defaultRequest(language || REQUEST_FALLBACK_LANGUAGE),
        }));
        get().refreshTemplate();
    },
    initializeFields: async (data_field = 'id_data') => {
        if (isSaneDataField(data_field, get().request.type)) {
            const fields = get().request[data_field];

            if (Privacy.isAllowed(PRIVACY_ACTIONS.SAVE_ID_DATA) && SavedIdData.shouldAlwaysFill()) {
                const saved_id_data = new SavedIdData();

                return saved_id_data
                    .getAllFixed()
                    .then((fill_data) =>
                        SavedIdData.mergeFields(fields, fill_data ?? [], true, true, true, true, false)
                    )
                    .then((new_fields) => {
                        set(
                            produce((state: GeneratorState) => {
                                if (isSaneDataField(data_field, state.request.type))
                                    state.request[data_field] = new_fields;
                                if (state.request.type === 'custom')
                                    state.request.custom_data = makeCustomDataFromIdData(state.request);
                            })
                        );
                        return saved_id_data.getSignature();
                    })
                    .then((signature) => {
                        get().setSignature(signature ?? { type: 'text', name: '' });
                    });
            }
        }
    },
    refreshTemplate: async () => {
        const template = await fetchTemplate(get().request.language, get().request.type, get().current_company);
        if (template)
            set({
                template,
            });
    },
    letter: () => RequestLetter.fromRequest(get().request, get().template, {}),
    letter_filename: () => {
        return (
            get().current_company?.slug ??
            `${slugify(get().request.recipient_address.split('\n', 1)[0]) ?? 'custom-recipient'}_${
                get().request.type
            }_${get().request.reference}.pdf`
        );
    },
});

function ensurePrimaryAddress(fields: IdDataElement[]) {
    if (!fields.find((f) => f.type === 'address' && f.value.primary)) {
        const address = fields.find((f) => f.type === 'address');
        if (address) (address.value as Address).primary = true;
    }
}

function makeCustomDataFromIdData(request: CustomRequest) {
    request.id_data.forEach((f) => {
        if (f.type === 'name') request.custom_data.name = f.value;
        if (f.type === 'address' && f.value.primary) request.custom_data.sender_address = f.value;
    });
    return request.custom_data;
}
