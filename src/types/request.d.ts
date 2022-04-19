export const REQUEST_TYPES = ['access', 'erasure', 'rectification', 'objection', 'custom'] as const;
export const TRANSPORT_MEDIA = ['fax', 'letter', 'email'] as const;

export type RequestType = typeof REQUEST_TYPES[number];
export type TransportMedium = typeof TRANSPORT_MEDIA[number];

export type GeneralIdData = {
    desc: string; // A description of this element, e.g. 'Name'.
    type: string;
    /* The element's type, where:
     *     - `input` is a single-line string
     *     - `textarea` is a multi-line string
     *     - `address` is an object representing an address like this:
     *         `{street_1: '5 Main St.', street_2: 'Suburbia', place: 'My City 12345', country: 'A Country', primary: true}`
     *     - `name` is an alias for `string` but is used to insert the user's name in the letter
     *     - `birthdate` is the user's date of birth as a string, e.g. '1970-01-01'
     */
    optional: boolean; // Whether we recommend giving this piece of information (`false`) or not (`true`).
    value: string | Address; // The value entered by the user for this element.
};
export type TextIdData = GeneralIdData & {
    type: 'input' | 'textarea' | 'name' | 'birthdate' | 'email';
    value: string;
};
export type AddressIdData = GeneralIdData & {
    type: 'address';
    value: Address;
};

export type IdDataElement = TextIdData | AddressIdData;
export type ResponseType = 'admonition' | 'complaint';

export type TextSignature = {
    type: 'text';
    name: string;
};
export type ImageSignature = {
    type: 'image';
    name?: string;
    value: string; // base64-encoded-image
};
export type Signature = TextSignature | ImageSignature;

export type Address = {
    street_1: string;
    street_2: string;
    place: string;
    country: string;
    primary?: boolean;
};

interface RequestInterface {
    type: RequestType;
    transport_medium: TransportMedium;
    reference: string;
    date: string;
    /** The new-line delimited address of the request recipient. */
    recipient_address: string;
    email: string;
    signature: Signature;
    /** The user-defined part of the information block. */
    information_block: string;
    language: string; // TODO: Type this according to a newly typed definition
    id_data: IdDataElement[];
    /** The slug of the company this request is addressed to (if applicable). */
    slug: string;
    /** A list of other entities and services the selected company is the controller for. */
    recipient_runs: string[];
    /** Whether the user needs to enter ID data for the request. */
    is_tracking_request: boolean;
    [index: DataField]: IdDataElement[];
}

export interface AccessRequest extends RequestInterface {
    type: 'access';
    /** The 'Get data in a machine-readable format' flag for access requests. */
    data_portability: boolean;
}

export interface ErasureRequest extends RequestInterface {
    type: 'erasure';
    /** The 'Erase all data' flag for erasure requests. */
    erase_all: boolean;
    /** For erasure requests: The data the user has specified to be erased (if `this.erase_all` is `false`). */
    erasure_data: string;
}
export type CustomLetterData = {
    content: string;
    subject: string;
    sender_address: Address;
    name: string;
    [index: keyof Omit<CustomLetterData, 'sender_address'>]: string;
};

export interface CustomRequest extends RequestInterface {
    type: 'custom';
    custom_data: CustomLetterData;
    response_type?: ResponseType;
}

const CUSTOM_TEMPLATE_OPTIONS = ['no-template', 'admonition', 'complaint'] as const;
type CustomTemplateName = typeof CUSTOM_TEMPLATE_OPTIONS[number];

export interface ObjectionRequest extends RequestInterface {
    type: 'objection';
}

export interface RectificationRequest extends RequestInterface {
    type: 'rectification';
    rectification_data: IdDataElement[];
}

export type Request = AccessRequest | ErasureRequest | CustomRequest | ObjectionRequest | RectificationRequest;

export type DataField<R extends Request> = 'id_data' | (R extends RectificationRequest ? 'rectification_data' : never);

export type RequestFlag =
    | {
          name: 'data_portability';
          value: boolean;
      }
    | { name: 'erase_all'; value: boolean }
    | { name: 'erasure_data'; value: string };
