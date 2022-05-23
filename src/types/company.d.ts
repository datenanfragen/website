import type { IdDataElement, RequestType, TransportMedium } from './request';
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

// Sadly the only way to to this is via a mapped type, so this looks a bit hacky. (See: https://github.com/microsoft/TypeScript/pull/44512#issuecomment-928890218)
type CustomTemplateProperties = { [P in `custom-${RequestType}-template`]: string | undefined };

export type Company = CommonSchema & {
    'required-elements'?: SetOptional<IdDataElement, 'value'>[];
    'request-language'?: RequestLanguage;
    'needs-id-document'?: boolean;
    quality: 'tested' | 'verified' | 'imported' | 'scraped';
    categories?: (keyof typeof window.I18N_DEFINITION.categories)[];
} & CustomTemplateProperties;

export type SupervisoryAuthority = CommonSchema & {
    'complaint-language'?: RequestLanguage;
};
