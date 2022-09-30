import { ErrorException, rethrow } from './errors';
import t from './i18n';
import type { Company, SupervisoryAuthority } from '../types/company';
import type { Hit } from 'react-instantsearch-core';

export function fetchCompanyDataBySlug(slug: string): Promise<Company> {
    return fetch(window.BASE_URL + 'db/' + slug + '.json')
        .then((res) => {
            if (!res.ok) throw new Error('Unexpected response while trying to fetch company.');
            return res.json();
        })
        .catch((err) => {
            rethrow(
                ErrorException.fromError(err),
                'fetchCompanyDataBySlug() failed.',
                { slug },
                t('company-not-found', 'error-msg'),
                true
            );
        });
}

export function fetchCompanyNameBySlug(slug: string) {
    return fetchCompanyDataBySlug(slug).then((json) => json['name']);
}

export function fetchSvaDataBySlug(slug: string): Promise<SupervisoryAuthority | void> {
    return fetch(window.BASE_URL + 'db/sva/' + slug + '.json')
        .then((res) => {
            if (!res.ok) throw new Error('Unexpected response while trying to fetch SVA.');
            return res.json();
        })
        .catch((err) =>
            rethrow(
                ErrorException.fromError(err),
                'fetchSvaDataBySlug() failed.',
                { slug },
                t('sva-not-found', 'error-msg'),
                true
            )
        );
}

export function fetchSvaNameBySlug(slug: string): Promise<string | void> {
    return fetchSvaDataBySlug(slug).then((sva) => sva && sva['name']);
}

export function companyFromHit(hit: Hit<Company>) {
    const company: Company = { ...hit };
    delete company._highlightResult;
    delete company._snippetResult;
    delete company.__position;
    delete company.objectID;
    delete company.id;
    delete company.text_match;
    delete company['sort-index'];
    return company;
}
