import type { IdDataElement, TransportMedium } from 'request';
import type { LiteralUnion, SetOptional } from 'type-fest';

type RequestLanguage = LiteralUnion<keyof typeof window.I18N_DEFINITION_REQUESTS, string>;

type CommonSchema = {
    slug: string;
    name: string;
    runs?: string[];
    email?: string;
    address?: string;
    fax?: string;
    phone?: string;
    web?: string;
    comments?: string[];
    'suggested-transport-medium'?: TransportMedium;
    'pgp-fingerprint'?: string;
    'pgp-url'?: string;
    [otherOptions: string | number | symbol]: unknown;
};

export type Company = CommonSchema & {
    'required-elements'?: SetOptional<IdDataElement, 'value'>[];
    'request-language'?: RequestLanguage;
    'needs-id-document'?: boolean;
    quality: 'tested' | 'verified' | 'imported' | 'scraped';
};

export type SupervisoryAuthority = CommonSchema & {
    'complaint-language'?: RequestLanguage;
};
