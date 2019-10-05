import { t_r } from './i18n';
import Privacy, { PRIVACY_ACTIONS } from './Privacy';
import IdData from './IdData';
import { CriticalException, rethrow } from './errors';

/**
 * @typedef {import('../DataType/Request').IdDataElement} IdDataElement
 */

/**
 * @typedef FieldsInitializationResult
 * @property {IdDataElement[]} new_fields
 * @property {Object} signature
 */

export const REQUEST_ARTICLES = { access: 15, erasure: 17, rectification: 16 };
export const REQUEST_FALLBACK_LANGUAGE = 'en'; // We'll use English as hardcoded fallback language

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
            optional: false,
            value: ''
        }
    ];
}

/**
 * Get a request template.
 *
 * @param {string} [locale=LOCALE] The desired language of the template. Defaults to the user's language if left blank. If no template can be found for the specified language it defaults to English.
 * @param {string} request_type] The request type to fetch a template for.
 * @param {Object} [company] A company object to extract the template
 * @param {string} [suffix=default] The suffix to append to the request type. No trailing dash is needed.
 * @returns {string} A template string which may contain variable placeholders.
 */
export function fetchTemplate(locale, request_type, company = null, suffix = 'default') {
    const template = company
        ? company['custom-' + request_type + '-template'] || request_type + (suffix ? '-' + suffix : '')
        : request_type + (suffix ? '-' + suffix : '');

    if (!Object.keys(I18N_DEFINITION_REQUESTS).includes(locale)) locale = LOCALE;
    // TODO: Once this is merged, remove the `.txt` in custom template declarations in the DB. That is just silly.
    const template_url =
        BASE_URL + 'templates/' + (locale || LOCALE) + '/' + (template ? template.replace(/\.txt$/, '') + '.txt' : '');

    return fetch(template_url)
        .then(response => {
            switch (response.status) {
                case 200:
                    return response.text();
                case 404:
                    if (locale !== REQUEST_FALLBACK_LANGUAGE) return fetchTemplate(REQUEST_FALLBACK_LANGUAGE, template);
                    throw new CriticalException(
                        'Request template could not be found.',
                        {
                            locale: locale,
                            template: template,
                            template_url: template_url,
                            response: response
                        },
                        'Request template could not be found.'
                    );
                default:
                    throw new CriticalException(
                        'Fetching the request template failed.',
                        {
                            locale: locale,
                            template: template,
                            template_url: template_url,
                            response: response
                        },
                        'Fetching the request template failed.'
                    );
            }
        })
        .catch(error => rethrow(error));
}

/**
 * Initializes the fields for a `RequestForm` with the user's saved data, if allowed.
 *
 * This convenience function handles all privacy checks, the caller can simply trust the result and use that. If the
 * fields shouldn't be filled, the caller will simply get the unfilled fields back.
 *
 * @param {IdDataElement[]} fields
 * @returns {Promise<FieldsInitializationResult>} A promise that resolves to an object containing the new fields and
 *     signature.
 */
export function initializeFields(fields) {
    if (Privacy.isAllowed(PRIVACY_ACTIONS.SAVE_ID_DATA) && IdData.shouldAlwaysFill()) {
        const id_data = new IdData();

        return id_data
            .getAllFixed()
            .then(fill_data => IdData.mergeFields(fields, fill_data, true, true, true, true, false))
            .then(
                new_fields =>
                    new Promise(resolve => {
                        id_data.getSignature().then(signature => {
                            resolve({ new_fields, signature });
                        });
                    })
            );
    }
    return Promise.resolve({ new_fields: fields, signature: null });
}
