import type { IdDataElement, Address, AccessRequest, RequestType, DataFieldName, Request } from '../types/request';
import type { Company, RequestLanguage, SupervisoryAuthority } from '../types/company';
import { generateReference } from 'letter-generator';
import t, { t_r } from './i18n';
import { deepCopyObject, hash } from './common';
import { requestTemplate } from './fetch';
import type { UserRequest } from '../DataType/UserRequests';
import type { Message, Proceeding } from '../types/proceedings';
import { useAppStore } from '../store/app';
import { getGeneratedMessage } from '../store/proceedings';

export const REQUEST_TYPES = ['access', 'erasure', 'rectification', 'objection', 'custom'] as const;
export const TRANSPORT_MEDIA = ['email', 'letter', 'fax'] as const;
export const ADDRESS_STRING_PROPERTIES = ['street_1', 'street_2', 'place', 'country'] as const;
export const REQUEST_ARTICLES = { access: '15', erasure: '17', rectification: '16', objection: '21(2)' } as const;
export const REQUEST_FALLBACK_LANGUAGE = 'en' as const; // We'll use English as hardcoded fallback language
export const EMTPY_ADDRESS: Address = {
    street_1: '',
    street_2: '',
    place: '',
    country: '',
} as const;
export const PROCEEDING_STATUS = ['overdue', 'actionNeeded', 'waitingForResponse', 'done'] as const;

export function isAddress(value: IdDataElement['value']): value is Address {
    return typeof value === 'object' && 'country' in value;
}

export function isSva(sva: unknown): sva is SupervisoryAuthority {
    return !!sva && typeof sva === 'object' && 'complaint-language' in sva;
}

export function isValidRequestType(type: string): type is RequestType {
    return REQUEST_TYPES.includes(type as RequestType); // We need this seemingly stupid casting here because TypeScript is stricter than it should on ReadonlyArray.includes()
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

export function isUserRequest(request: Request | UserRequest): request is UserRequest {
    return 'via' in request;
}

export const adressesEqual = (one: Address, two: Address) =>
    one.street_1 === two.street_1 &&
    one.street_2 === two.street_2 &&
    one.place === two.place &&
    one.country === two.country;

/** @returns Whether the field contains a value based on its type. */
export function isFieldEmpty(field: IdDataElement) {
    if (typeof field.value === 'string' && field.value.trim()) return false;
    else if (isAddress(field.value)) {
        for (const [key, value] of Object.entries(field.value)) {
            if (key !== 'primary' && value && typeof value === 'string' && value.trim()) return false;
        }
    }

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
    request_type: RequestType,
    company?: Company | SupervisoryAuthority,
    suffix = 'default'
): Promise<void | string> =>
    requestTemplate(
        locale,
        (company && company[`custom-${request_type}-template`]
            ? company[`custom-${request_type}-template`]
            : request_type + (suffix ? '-' + suffix : '')) as string,
        request_type
    );

export const requestLanguageFallback = (language?: string) =>
    language && Object.keys(window.I18N_DEFINITION_REQUESTS).includes(language)
        ? language
        : Object.keys(window.I18N_DEFINITION_REQUESTS).includes(useAppStore.getState().savedLocale)
        ? useAppStore.getState().savedLocale
        : REQUEST_FALLBACK_LANGUAGE;

export function inferRequestLanguage(entity?: Company | SupervisoryAuthority) {
    if (entity && isSva(entity)) return requestLanguageFallback(entity['complaint-language']);
    return requestLanguageFallback(entity?.['request-language']);
}

export const icsFromProceedings = (proceedings: Proceeding[]) => {
    const grouped_requests = proceedings.reduce<Record<string, Message[]>>((acc, prcd) => {
        const request = getGeneratedMessage(prcd, 'request');
        return request
            ? { ...acc, [request.date.toDateString()]: [...(acc[request.date.toDateString()] || []), request] }
            : acc;
    }, {});

    const events = Object.keys(grouped_requests)
        .map((group) => {
            const items = grouped_requests[group].map((request) => {
                return `* ${request.correspondent_address.split('\n', 1)[0]} (${t(request.type, 'my-requests')} – ${
                    request.reference
                })`;
            });
            const titles = grouped_requests[group]
                .map((request) => request.correspondent_address.split('\n', 1)[0])
                .map((title) => (title.length > 15 ? `${title.slice(0, 15)}...` : title));

            const heading_base = `${t('for', 'my-requests')} ${titles.slice(0, 2).join(', ')}`;
            const heading_ellipsis =
                titles.length > 2 ? ` ${t('and', 'my-requests')} ${titles.length - 2} ${t('more', 'my-requests')}` : '';
            const reminder_date = new Date(group);
            reminder_date.setDate(reminder_date.getDate() + 32);

            return `
BEGIN:VEVENT
UID:${hash(items.join(','))}@ics.datenanfragen.de
DTSTAMP:${new Date().toISOString().replace(/[:-]/g, '').substring(0, 15)}Z
DTSTART:${reminder_date.toISOString().replace(/-/g, '').substring(0, 8)}
SUMMARY:${t('ics-summary', 'my-requests')} ${heading_base}${heading_ellipsis}
DESCRIPTION:${t('ics-desc', 'my-requests').replace(/([,;])/g, '\\$1')}\\n\\n\n ${items
                .join('\\n\n ')
                .replace(/([,;])/g, '\\$1')}
BEGIN:VALARM
TRIGGER:+PT720M
ACTION:DISPLAY
DESCRIPTION:${t('ics-summary', 'my-requests')}
END:VALARM
URL;VALUE=URI:${t('ics-url', 'my-requests')}
END:VEVENT`;
        })
        .join('\n');

    const ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Datenanfragen.de e. V.//${t('ics-title', 'my-requests')}//${t('ics-lang', 'my-requests')}
X-WR-CALNAME:${t('ics-title', 'my-requests')} (${new Date().toISOString().substring(0, 10)})${events}
END:VCALENDAR`;

    return new Blob([ics.split('\n').join('\r\n')], { type: 'text/calendar;charset=utf-8' });
};
