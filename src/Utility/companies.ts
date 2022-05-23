import { ErrorException, rethrow } from './errors';
import t from './i18n';
import type { Company, SupervisoryAuthority } from '../types/company';

export function fetchCompanyDataBySlug(slug: string): Promise<Company> {
    return fetch(window.BASE_URL + 'db/' + slug + '.json')
        .then((res) => res.json())
        .catch((err) => {
            rethrow(
                ErrorException.fromError(err),
                'fetchCompanyDataBySlug() failed.',
                { slug },
                t('company-not-found', 'error-msg')
            );
        });
}

export function fetchCompanyNameBySlug(slug: string) {
    return fetchCompanyDataBySlug(slug).then((json) => json['name']);
}

export function fetchSvaDataBySlug(slug: string): Promise<SupervisoryAuthority | void> {
    return fetch(window.BASE_URL + 'db/sva/' + slug + '.json')
        .then((res) => res.json())
        .catch((err) =>
            rethrow(
                ErrorException.fromError(err),
                'fetchSvaDataBySlug() failed.',
                { slug },
                t('sva-not-found', 'error-msg')
            )
        );
}

export function fetchSvaNameBySlug(slug: string): Promise<string | void> {
    return fetchSvaDataBySlug(slug).then((sva) => sva && sva['name']);
}
