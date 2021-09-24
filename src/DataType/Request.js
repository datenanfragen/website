import { generateReference } from 'letter-generator/utility';
import { deepCopyObject } from '../Utility/common';
import { defaultFields, REQUEST_FALLBACK_LANGUAGE } from '../Utility/requests';
import UserRequests from '../my-requests';

/**
 * @typedef {"access" | "erasure" | "rectification" | "objection" | "custom"} RequestType
 */

/**
 * @typedef {"fax" | "letter" | "email"} TransportMedium
 */

/**
 * @typedef {Object} IdDataElement
 * @property {String} desc A description of this element, e.g. 'Name'.
 * @property {"input" | "textarea" | "address" | "name" | "birthdate"} type The element's type, where:
 *     - `input` is a single-line string
 *     - `textarea` is a multi-line string
 *     - `address` is an object representing an address like this:
 *         `{street_1: '5 Main St.', street_2: 'Suburbia', place: 'My City 12345', country: 'A Country', primary: true}`
 *     - `name` is an alias for `string` but is used to insert the user's name in the letter
 *     - `birthdate` is the user's date of birth as a string, e.g. '1970-01-01'
 * @property {boolean} [optional=false] Whether we recommend giving this piece of information (`false`) or not (`true`).
 * @property {String} value The value entered by the user for this element.
 */

export default class Request {
    constructor() {
        const today = new Date();

        /**
         * @type {RequestType}
         */
        this.type = 'access';
        /**
         * @type {TransportMedium}
         */
        this.transport_medium = 'email';
        /**
         * @type {String}
         */
        this.reference = generateReference(today);
        /**
         * @type {String}
         */
        this.date = today.toISOString().substring(0, 10);
        /**
         * The new-line delimited address of the request recipient.
         * @type {String}
         */
        this.recipient_address = '';
        /**
         * The email address of the request recipient.
         * @type {String}
         */
        this.email = '';
        /**
         * The signature to be included after the content in pdfmake format. If not left blank, this can be:
         *     - `{ type: 'text', name: 'Name' }` to just add the name
         *     - `{ type: 'image', name: 'Name', value: 'base64-encoded image' }` to include an image and the name
         *         underneath
         */
        this.signature = { type: 'text', value: '' };
        /**
         * The user-defined part of the information block.
         * @type {String}
         */
        this.information_block = '';
        /**
         * @type {String}
         */
        this.language = Object.keys(I18N_DEFINITION_REQUESTS).includes(LOCALE) ? LOCALE : REQUEST_FALLBACK_LANGUAGE;

        /**
         * The 'Get data in a machine-readable format' flag for access requests.
         * @type {boolean}
         */
        this.data_portability = false;
        /**
         * The 'Erase all data' flag for erasure requests.
         * @type {boolean}
         */
        this.erase_all = true;

        /**
         * @type {IdDataElement[]}
         */
        this.id_data = deepCopyObject(defaultFields(LOCALE));

        /**
         * The slug of the company this request is addressed to (if applicable).
         * @type {String}
         */
        this.slug = '';

        /**
         * @type {"admonition" | "complaint"} The response type if this request is a warning or complaint.
         */
        this.response_type;

        /**
         * A list of other entities and services the selected company is the controller for.
         * @type {String[]}
         */
        this.recipient_runs = [];

        /**
         * For erasure requests: The data the user has specified to be erased (if `this.erase_all` is `false`).
         * @type {String}
         */
        this.erasure_data = '';
        /**
         * For rectification requests: The data the user has specified to be rectified.
         * @type {IdDataElement[]}
         */
        this.rectification_data = [];
        /**
         * For custom requests: The parameters for the letter as entered by the user.
         * @type {Object}
         * @property {String} content
         * @property {String} subject
         * @property {Object} address (@see {@link IdDataElement})
         * @property {String} name
         */
        this.custom_data = {
            content: '',
            subject: '',
            sender_address: {},
            name: '',
        };

        /**
         * Whether the user needs to enter ID data for the request.
         * @type {boolean}
         */
        this.is_tracking_request = false;

        /**
         * Whether we consider the request to be 'done', i.e. whether the user has downloaded the PDF or sent the email.
         *
         * This is mainly used to check if we need to warn the user to finish the current request before starting a new
         * one.
         * @type {boolean}
         */
        this.done = false;
    }

    getFields(data) {
        return this[data];
    }

    addField(data, props) {
        if (!props.type) throw new Error('field must have a type.');
        const fields = this.getFields(data);
        fields.push({
            desc: '',
            optional: true,
            value: props.type === 'address' ? { primary: false } : '',
            ...props,
        });
        this.ensurePrimaryAddress(data);
    }

    removeField(data, idx) {
        const fields = this.getFields(data);
        let field = fields[idx];
        if (!field) throw new Error('index out of bounds');
        fields.splice(idx, 1);
        // always have a primary address
        this.ensurePrimaryAddress(data);
    }

    ensurePrimaryAddress(data) {
        const fields = this.getFields(data);
        if (!fields.find((f) => f.type === 'address' && f.value.primary)) {
            let address = fields.find((f) => f.type === 'address');
            if (address) address.value.primary = true;
        }
    }

    setPrimaryAddress(data, idx) {
        const fields = this.getFields(data);
        let field = fields[idx];
        if (!field) throw new Error('index out of bounds');
        if (field.type !== 'address') {
            throw new Error("can't set something that's not an address as primary");
        }
        fields.forEach((field, i) => {
            if (field.type === 'address') {
                field.value.primary = idx === i;
            }
        });
    }

    changeField(data, idx, prop, value) {
        const fields = this.getFields(data);
        let field = fields[idx];
        if (!field) throw new Error('index out of bounds');
        switch (prop) {
            case 'desc':
            case 'value':
                field[prop] = value;
                break;
            default:
                field.value[prop] = value;
        }
    }

    /**
     * Save this request in the 'My requests' feature.
     */
    store() {
        const db_id =
            this.reference +
            '-' +
            this.type +
            (this.type === 'custom' && this.response_type ? '-' + this.response_type : '');
        const item = {
            reference: this.reference,
            date: this.date,
            type: this.type,
            response_type: this.response_type,
            slug: this.slug,
            recipient: this.recipient_address,
            email: this.email,
            via: this.transport_medium,
        };
        new UserRequests().storeRequest(db_id, item);
    }
}
