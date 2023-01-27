import type { IdDataElement, RequestType, TransportMedium } from './request';
import type { LiteralUnion, SetOptional } from 'type-fest';

type RequestLanguage = LiteralUnion<keyof typeof window.I18N_DEFINITION_REQUESTS, string>;

type CommonSchema = {
    slug: string;
    name: string;
    runs?: string[];
    /// We copy the runs in this field to allow users to create their own selection of companies in the original runs field. Leave this undefined to default to the standard `runs` field. Make this an empty array to unselect all runs entities.
    runs_selected?: string[];
    email?: string;
    address?: string;
    fax?: string;
    phone?: string;
    webform?: string;
    web?: string;
    comments?: string[];
    'suggested-transport-medium'?: TransportMedium;
    'pgp-fingerprint'?: string;
    'pgp-url'?: string;
    [otherOptions: string | number | symbol]: unknown;
};

// Sadly the only way to to this is via a mapped type, so this looks a bit hacky. (See: https://github.com/microsoft/TypeScript/pull/44512#issuecomment-928890218)
// eslint-disable-next-line no-unused-vars
type CustomTemplateProperties = { [P in `custom-${RequestType}-template`]?: string | undefined };

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

export type CompanyPack = { slug: string; type: 'choose' | 'add-all'; companies: { slug: string; name: string }[] };
