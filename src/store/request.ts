import type {
    Request,
    IdDataElement,
    DataFieldName,
    RequestType,
    Address,
    TransportMedium,
    RequestFlag,
    Signature,
    CustomLetterData,
    CustomRequest,
} from '../types/request';
import {
    defaultRequest,
    REQUEST_FALLBACK_LANGUAGE,
    fetchTemplate,
    isSaneDataField,
    inferRequestLanguage,
} from '../Utility/requests';
import { produce } from 'immer';
import { RequestLetter } from '../DataType/RequestLetter';
import { t_r } from '../Utility/i18n';
import { ErrorException, WarningException } from '../Utility/errors';
import type { StoreSlice } from '../types/utility';
import { CompanyState } from './company';
import type { GeneratorSpecificState, GeneratorState } from './generator';
import { slugify } from '../Utility/common';
import { Privacy, PRIVACY_ACTIONS } from '../Utility/Privacy';
import { SavedIdData } from '../DataType/SavedIdData';

export interface RequestState<R extends Request> {
    request: R;
    template: string;
    addField: (field: IdDataElement, data_field: DataFieldName<R>) => void;
    removeField: (index: number, data_field: DataFieldName<R>) => void;
    setField: (index: number, field: IdDataElement, data_field: DataFieldName<R>) => void;
    setRequestType: (type: RequestType) => void;
    setTransportMedium: (transport_medium: TransportMedium) => void;
    setRecipientAddress: (recipient_address: string) => void;
    setRecipientEmail: (email: string) => void;
    setRequestFlag: (flag: RequestFlag) => void;
    setDate: (date: string) => void;
    setInformationBlock: (information_block: string) => void;
    setSignature: (signature: Signature) => void;
    setCustomLetterProperty: (property: keyof Omit<CustomLetterData, 'sender_address'>, value: string) => void;
    setCustomLetterAddress: (address: Address) => void;
    setSent: (sent: boolean) => void;
    resetRequestToDefault: (advanceBatch: boolean, language?: string, beforeAdvanceBatchHook?: () => void) => void;
    initializeFields: (data_field?: DataFieldName<R>) => Promise<void>;
    refreshTemplate: () => Promise<void>;
    letter: () => RequestLetter;
    letter_filename: () => string;
    saveIdData: () => void;
    getRequestForSaving: (preventSideEffects?: boolean) => Request;
}

export const createRequestStore: StoreSlice<RequestState<Request>, CompanyState & GeneratorSpecificState> = (
    set,
    get
) => ({
    request: defaultRequest(inferRequestLanguage()),
    template: '',
    addField: (_field, data_field) =>
        set(
            produce((state: RequestState<Request>) => {
                const field =
                    _field.type === 'address'
                        ? {
                              ..._field,
                              value: { ..._field.value, primary: false },
                          }
                        : _field;
                if (isSaneDataField(data_field, state.request.type)) {
                    state.request[data_field].push(field);
                    if (data_field === 'id_data') ensurePrimaryAddress(state.request.id_data);
                } else
                    throw new ErrorException(
                        'While trying to add a field: Illegal data_field.',
                        { data_field, field },
                        'Error while adding a field.'
                    );
            })
        ),
    removeField: (index, data_field) =>
        set(
            produce((state: RequestState<Request>) => {
                if (isSaneDataField(data_field, state.request.type)) {
                    if (!state.request[data_field][index])
                        throw new ErrorException(
                            'While trying to remove a field: Index out of bounds.',
                            { index, data_field, fields: state.request[data_field] },
                            'Error while removing a field.'
                        );
                    state.request[data_field].splice(index, 1);
                    if (data_field === 'id_data') ensurePrimaryAddress(state.request.id_data);
                } else
                    throw new ErrorException(
                        'While trying to remove a field: Illegal data_field.',
                        { data_field, index },
                        'Error while removing a field.'
                    );
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
                            state.request[data_field].forEach((f: IdDataElement) => {
                                if (f.type === 'address' && f !== state.request[data_field][index]) {
                                    // Set the first address (not equal to the current one) to primary if the current change is to non-primary,
                                    // otherwise change all adresses to non-primary (we overwrite this with our change later)
                                    f.value.primary = addresses++ === 0 && !field.value.primary;
                                }
                            });
                            if (addresses === 0) field.value.primary = true; // if there is only one address, it needs to primary regardless
                        }
                    }
                    state.request[data_field][index] = field;
                } else
                    throw new ErrorException(
                        'While trying to set a field: Illegal data_field.',
                        { data_field, index, field },
                        'Error while chnaging a field.'
                    );
            })
        ),
    setRequestType: (type) => {
        set(
            produce((state: RequestState<Request>) => {
                state.request.type = type;
                if (state.request.type === 'custom')
                    state.request.custom_data = makeCustomDataFromIdData(state.request);
                if (state.request.type === 'rectification' && state.request.rectification_data === undefined)
                    state.request.rectification_data = [];
                if (state.request.type === 'erasure') {
                    state.request.erase_all = true;
                    state.request.erasure_data = '';
                    state.request.include_objection = false;
                    state.request.objection_reason = '';
                }
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
                        if (flag.name === 'include_objection') state.request.include_objection = flag.value;
                        if (flag.name === 'objection_reason') state.request.objection_reason = flag.value;
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
    setCustomLetterProperty: (property, value) => {
        set(
            produce((state: RequestState<Request>) => {
                if (state.request.type === 'custom') state.request.custom_data[property] = value;
                else
                    throw new WarningException(
                        "Custom letter property can only be set for a custom request (request.type === 'custom')."
                    );
            })
        );
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
                "Custom letter address can only be set for a custom request (request.type === 'custom')."
            );
        }
    },
    setSent: (sent = true) =>
        set(
            produce((state: RequestState<Request>) => {
                state.request.sent = sent;
            })
        ),
    resetRequestToDefault: (advanceBatch, language, beforeAdvanceBatchHook) => {
        set(() => ({
            request: defaultRequest(language || REQUEST_FALLBACK_LANGUAGE),
        }));
        get().refreshTemplate();

        get().setDownload(false);
        get().setBusy();
        get()
            .removeCompany()
            .then(() => {
                if (advanceBatch) {
                    beforeAdvanceBatchHook?.();
                    get().advanceBatch();
                }
                return get().resetInitialConditions();
            });
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
                    .then((new_fields) =>
                        set(
                            produce((state: GeneratorState) => {
                                if (isSaneDataField(data_field, state.request.type))
                                    state.request[data_field] = new_fields;
                                if (state.request.type === 'custom') {
                                    state.request['id_data'] = new_fields;
                                    state.request.custom_data = makeCustomDataFromIdData(state.request);
                                }
                            })
                        )
                    )
                    .then(() => saved_id_data.getSignature())
                    .then((signature) => get().setSignature(signature ?? { type: 'text', name: '' }));
            }
        }
    },
    refreshTemplate: async () => {
        if (get().request.type === 'custom') return;
        get().setBusy();
        return fetchTemplate(get().request.language, get().request.type, get().current_company)
            .then((template) => {
                if (template)
                    set({
                        template,
                    });
            })
            .then(() => get().renderLetter());
    },
    letter: () => RequestLetter.fromRequest(get().request, get().template, {}),
    letter_filename: () => {
        return (
            get().current_company?.slug ??
            `${slugify(get().request.recipient_address.split('\n', 1)[0]) || 'custom-recipient'}_${
                get().request.type
            }_${get().request.reference}.pdf`
        );
    },
    saveIdData: () => {
        if (Privacy.isAllowed(PRIVACY_ACTIONS.SAVE_ID_DATA)) {
            const savedIdData = new SavedIdData();
            savedIdData.storeArray(get().request.id_data);
            // Don't clear the saved signature if the signature was only cleared for this request (#182).
            if (get().request.signature.type === 'image') savedIdData.storeSignature(get().request.signature);
        }
    },
    getRequestForSaving: (preventSideEffects) => {
        if (!preventSideEffects) {
            get().saveIdData();
        }
        return get().request;
    },
});

function ensurePrimaryAddress(fields: IdDataElement[]) {
    if (!fields.find((f) => f.type === 'address' && f.value.primary)) {
        const address = fields.find((f) => f.type === 'address');
        if (address) (address.value as Address).primary = true;
    }
}

function makeCustomDataFromIdData(request: CustomRequest) {
    const custom_data = { ...request.custom_data };
    request.id_data.forEach((f) => {
        if (f.type === 'name') custom_data.name = f.value;
        if (f.type === 'address' && f.value.primary) custom_data.sender_address = f.value;
    });
    if (!custom_data.sender_address)
        custom_data.sender_address = { street_1: '', street_2: '', place: '', country: '' };
    return custom_data;
}
