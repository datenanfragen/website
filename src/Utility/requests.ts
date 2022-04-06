import t, { t_r } from './i18n';
import Privacy, { PRIVACY_ACTIONS } from './Privacy';
import SavedIdData from './SavedIdData';
import { CriticalException, rethrow } from './errors';
import { generateReference } from 'letter-generator';
import { deepCopyObject } from '../Utility/common';
import type {
    IdDataElement,
    Address,
    AccessRequest,
    RequestType,
    Signature,
    DataField,
    Request,
    RectificationRequest,
} from '../types/request';

export const REQUEST_ARTICLES = { access: 15, erasure: 17, rectification: 16, objection: '21(2)' };
export const REQUEST_FALLBACK_LANGUAGE = 'en'; // We'll use English as hardcoded fallback language

export function isAddress(value: IdDataElement['value']): value is Address {
    return (value as Address).country !== undefined;
}

/**
 * This is not a true typeguard, but it is a hack to get typescript to shut up because it does not understand that this function actually checks that 'rectification_data' might also be a sane case, depending on the request type.
 */
export function isSaneDataField(
    data_field: DataField<Request>,
    request_type: RequestType
): data_field is DataField<AccessRequest> {
    return data_field === 'id_data' || (request_type === 'rectification' && data_field === 'rectification_data');
}

export const defaultRequest = (language: string): AccessRequest => {
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
        language: language,
        data_portability: false,
        id_data: deepCopyObject(defaultFields(language)),
        slug: '',
        recipient_runs: [],
        is_tracking_request: false,
    };
};

export const defaultFields = (locale: string): IdDataElement[] => [
    {
        desc: t_r('name', locale),
        type: 'name',
        optional: true,
        value: '',
    },
    {
        desc: t_r('email', locale),
        type: 'email',
        optional: true,
        value: '',
    },
    {
        desc: t_r('address', locale),
        type: 'address',
        optional: true,
        value: {
            street_1: '',
            street_2: '',
            place: '',
            country: '',
            primary: true,
        },
    },
];

export const trackingFields = (locale: string): IdDataElement[] => [
    {
        desc: t_r('name', locale),
        type: 'name',
        optional: false,
        value: '',
    },
    {
        desc: t_r('email', locale),
        type: 'email',
        optional: false,
        value: '',
    },
];

/**
 * Get a request template.
 *
 * @param locale The desired language of the template. Defaults to the user's language if left blank. If no template can be found for the specified language it defaults to English.
 * @param request_type The request type to fetch a template for.
 * @param company A company object to extract the template
 * @param suffix The suffix to append to the request type. No trailing dash is needed.
 */
export const fetchTemplate = (
    locale: string,
    request_type: RequestType,
    company = null,
    suffix = 'default'
): Promise<void | string> => {
    const template =
        company && company[`custom-${request_type}-template`]
            ? company[`custom-${request_type}-template`]
            : request_type + (suffix ? '-' + suffix : '');

    if (!Object.keys(window.I18N_DEFINITION_REQUESTS).includes(locale)) locale = window.LOCALE;
    const template_url = `${window.BASE_URL}templates/${locale || window.LOCALE}/${template}.txt`;

    return fetch(template_url)
        .then((response) => {
            switch (response.status) {
                case 200:
                    return response.text();
                case 404:
                    if (locale !== REQUEST_FALLBACK_LANGUAGE) {
                        return fetchTemplate(REQUEST_FALLBACK_LANGUAGE, request_type, null, '');
                    }
                    throw new CriticalException(
                        'Request template could not be found.',
                        {
                            locale,
                            template,
                            template_url,
                            response,
                        },
                        t('error-template-not-found', 'generator')
                    );
                default:
                    throw new CriticalException(
                        'Fetching the request template failed.',
                        {
                            locale,
                            template,
                            template_url,
                            response,
                        },
                        t('error-template-fetch-failed', 'generator')
                    );
            }
        })
        .catch((error) =>
            rethrow(error, 'fetchTemplate() failed.', { template_url }, t('error-template-fetch-failed', 'generator'))
        );
};

/**
 * Initializes the fields for a `RequestForm` with the user's saved data, if allowed.
 *
 * This convenience function handles all privacy checks, the caller can simply trust the result and use that. If the
 * fields shouldn't be filled, the caller will simply get the unfilled fields back.
 */
export const initializeFields = (
    fields: IdDataElement[]
): Promise<{ new_fields: IdDataElement[]; signature: Signature | null }> => {
    if (Privacy.isAllowed(PRIVACY_ACTIONS.SAVE_ID_DATA) && SavedIdData.shouldAlwaysFill()) {
        const saved_id_data = new SavedIdData();

        return saved_id_data
            .getAllFixed()
            .then((fill_data) => SavedIdData.mergeFields(fields, fill_data, true, true, true, true, false))
            .then(
                (new_fields) =>
                    new Promise((resolve) => {
                        saved_id_data.getSignature().then((signature) => {
                            resolve({ new_fields, signature });
                        });
                    })
            );
    }
    return Promise.resolve({ new_fields: fields, signature: null });
};
