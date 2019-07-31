import { t_r } from './i18n';
import { generateReference } from 'letter-generator/utility';
import { deepCopyObject } from './common';

export const REQUEST_ARTICLES = { access: 15, erasure: 17, rectification: 16 };

export function defaultFields(locale = LOCALE) {
    return [
        {
            desc: t_r('name', locale),
            type: 'name',
            optional: true,
            value: ''
        },
        {
            desc: t_r('birthdate', locale),
            type: 'birthdate',
            optional: true,
            value: ''
        },
        {
            desc: t_r('address', locale),
            type: 'address',
            optional: true,
            value: { primary: true }
        }
    ];
}

export function trackingFields(locale = LOCALE) {
    return [
        {
            desc: t_r('name', locale),
            type: 'name',
            optional: false,
            value: ''
        },
        {
            desc: t_r('email', locale),
            type: 'input',
            optional: true,
            value: ''
        }
    ];
}

export function freshRequestData() {
    let today = new Date();

    return {
        type: 'access',
        transport_medium: 'fax',
        id_data: deepCopyObject(defaultFields(LOCALE)),
        reference: generateReference(today),
        date: today.toISOString().substring(0, 10),
        recipient_address: '',
        signature: { type: 'text', value: '' },
        erase_all: true,
        erasure_data: '',
        data_portability: false,
        recipient_runs: [],
        rectification_data: [],
        information_block: '',
        custom_data: {
            content: '',
            subject: '',
            sender_address: {},
            name: ''
        },
        language: LOCALE,
        is_tracking_request: false
    };
}

export function templateURL(locale = LOCALE) {
    if (!Object.keys(I18N_DEFINITION_REQUESTS).includes(locale)) locale = LOCALE;
    return BASE_URL + 'templates/' + (locale || LOCALE) + '/';
}
