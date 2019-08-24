import { t_r } from './i18n';
import Privacy, { PRIVACY_ACTIONS } from './Privacy';
import IdData from './IdData';

/**
 * @typedef {import('../DataType/Request').IdDataElement} IdDataElement
 */

/**
 * @typedef FieldsInitializationResult
 * @property {IdDataElement[]} new_fields
 * @property {Object} signature
 */

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
            optional: false,
            value: ''
        }
    ];
}

export function templateURL(locale = LOCALE) {
    if (!Object.keys(I18N_DEFINITION_REQUESTS).includes(locale)) locale = LOCALE;
    return BASE_URL + 'templates/' + (locale || LOCALE) + '/';
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
