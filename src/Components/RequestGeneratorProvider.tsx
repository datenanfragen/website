import create, { SetState, GetState } from 'zustand';
import { isAddress, defaultRequest } from '../Utility/Request';
import type {
    Request,
    IdDataElement,
    DataField,
    RequestType,
    ErasureRequest,
    Address,
    AccessRequest,
} from '../types/request';
import UserRequests from '../my-requests';
import produce from 'immer';

interface RequestState<R extends Request> {
    request: R;
    storeRequest: () => void;
    addField: (field: IdDataElement, data_field: DataField<R>) => void;
    removeField: (index: number, data_field: DataField<R>) => void;
    changeFieldValue: (index: number, value: IdDataElement['value'], data_field: DataField<R>) => void;
    changeFieldDesc: (index: number, desc: string, data_field: DataField<R>) => void;
    changeRequestType: (type: RequestType) => void;
}

const useStore = create<RequestState<Request>>((set, get) => ({
    request: defaultRequest(),
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
            produce((state) => {
                state.request[data_field as string].push(field);
                if (data_field === 'id_data') ensurePrimaryAddress(state.request[data_field as string]);
            })
        ),
    removeField: (index, data_field) =>
        set(
            produce((state) => {
                if (!state.request[data_field as string][index]) throw new Error('index out of bounds');
                state.request[data_field as string].splice(index, 1);
                if (data_field === 'id_data') ensurePrimaryAddress(state.request[data_field as string]);
            })
        ),
    changeFieldValue: (index, value, data_field) =>
        set(
            produce((state) => {
                if (isAddress(value) && isAddress(state.request[data_field as string][index].value)) {
                    // Address changes need to have their primary status checked
                    if (state.request[data_field as string][index].value.primary !== value.primary) {
                        // Only change the primary adresses if the primary value of the current field changed
                        let addresses = 0;
                        state.request[data_field as string].forEach((field: IdDataElement, i: number) => {
                            if (field.type === 'address') {
                                // Set the first address to primary if the current change is to non-primary,
                                // otherwise change all adresses to non-primary (we overwrite this with our change later)
                                field.value.primary = addresses++ === 0 && !value.primary;
                            }
                        });
                    }
                }
                state.request[data_field as string][index].value = value;
            })
        ),
    changeFieldDesc: (index, desc, data_field) =>
        set(
            produce((state) => {
                state.request[data_field as string][index].desc = desc;
            })
        ),
    changeRequestType: (type) => {
        set(
            produce((state) => {
                state.request.type = type;
            })
        );
    },
}));

function ensurePrimaryAddress(fields: IdDataElement[]) {
    if (!fields.find((f) => f.type === 'address' && f.value.primary)) {
        const address = fields.find((f) => f.type === 'address');
        if (address) (address.value as Address).primary = true;
    }
}

type RequestGeneratorProviderProps = Record<string, never>;

export default function RequestGeneratorProvider(props: RequestGeneratorProviderProps) {}
