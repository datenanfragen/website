import t, { t_r } from './i18n';
import { CriticalException, rethrow } from './errors';
import { generateReference } from 'letter-generator';
import { deepCopyObject } from '../Utility/common';
import type {
    IdDataElement,
    Address,
    AccessRequest,
    RequestType,
    DataFieldName,
    Request,
    CustomTemplateName,
} from '../types/request';
import type { Company, RequestLanguage, SupervisoryAuthority } from '../types/company';

export const REQUEST_ARTICLES = { access: '15', erasure: '17', rectification: '16', objection: '21(2)' };
export const REQUEST_FALLBACK_LANGUAGE = 'en'; // We'll use English as hardcoded fallback language

export function isAddress(value: IdDataElement['value']): value is Address {
    return typeof value === 'object' && 'country' in value;
}

export function isSva(sva: unknown): sva is SupervisoryAuthority {
    return !!sva && typeof sva === 'object' && 'complaint-language' in sva;
}

/**
 * This is not a true typeguard, but it is a hack to get typescript to shut up because it does not understand that this function actually checks that 'rectification_data' might also be a sane case, depending on the request type.
 */
export function isSaneDataField(
    data_field: DataFieldName<Request>,
    request_type: RequestType
): data_field is DataFieldName<AccessRequest> {
    return data_field === 'id_data' || (request_type === 'rectification' && data_field === 'rectification_data');
}

export const adressesEqual = (one: Address, two: Address) =>
    one.street_1 === two.street_1 &&
    one.street_2 === two.street_2 &&
    one.place === two.place &&
    one.country === two.country;

/** @returns Whether the field contains a value based on its type. */
export function isFieldEmpty(field: IdDataElement) {
    if (typeof field.value === 'string' && field.value.trim()) return false;
    else if (isAddress(field.value))
        for (const [key, value] of Object.entries(field.value)) if (key !== 'primary' && value) return false;

    return true;
}

export const defaultRequest = (language: RequestLanguage): AccessRequest => {
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
        language,
        data_portability: true,
        id_data: deepCopyObject(defaultFields(language)),
        slug: '',
        recipient_runs: [],
        is_tracking_request: false,
    };
};

export const defaultFields = (locale: RequestLanguage): IdDataElement[] => [
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

export const trackingFields = (locale: RequestLanguage): IdDataElement[] => [
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
    request_type: RequestType | Exclude<CustomTemplateName, 'no-template'>,
    company?: Company | SupervisoryAuthority,
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
                        return fetchTemplate(REQUEST_FALLBACK_LANGUAGE, request_type, undefined, '');
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

export const requestLanguageFallback = (language?: string) =>
    language && Object.keys(window.I18N_DEFINITION_REQUESTS).includes(language)
        ? language
        : Object.keys(window.I18N_DEFINITION_REQUESTS).includes(window.LOCALE)
        ? window.LOCALE
        : REQUEST_FALLBACK_LANGUAGE;

export function inferRequestLanguage(entity?: Company | SupervisoryAuthority) {
    if (entity && isSva(entity)) return requestLanguageFallback(entity['complaint-language']);
    return requestLanguageFallback(entity?.['request-language']);
}
