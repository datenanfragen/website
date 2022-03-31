import { generateReference } from 'letter-generator';
import { deepCopyObject } from '../Utility/common';
import { defaultFields, REQUEST_FALLBACK_LANGUAGE } from '../Utility/requests';
import type { IdDataElement, Address, AccessRequest } from '../types/request';

export function isAddress(value: IdDataElement['value']): value is Address {
    return (value as Address).country !== undefined;
}

export const defaultRequest = (): AccessRequest => {
    const today = new Date();

    return {
        type: 'access',
        transport_medium: 'email',
        reference: generateReference(today),
        date: today.toISOString().substring(0, 10),
        recipient_address: '',
        email: '',
        signature: { type: 'text', name: '' },
        information_block: '',
        language: Object.keys(window.I18N_DEFINITION_REQUESTS).includes(window.LOCALE)
            ? window.LOCALE
            : REQUEST_FALLBACK_LANGUAGE,
        data_portability: false,
        id_data: deepCopyObject(defaultFields(window.LOCALE)),
        slug: '',
        recipient_runs: [],
        is_tracking_request: false,
    };
};
