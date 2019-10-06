import { ErrorException, rethrow } from './errors';
import t from './i18n';

export function fetchCompanyDataBySlug(slug) {
    return fetch(BASE_URL + 'db/' + slug + '.json')
        .then(res => res.json())
        .catch(err => {
            err.enduser_message = t('company-not-found', 'error-msg');
            rethrow(ErrorException.fromError(err), undefined, { slug: slug });
        });
}

export function fetchCompanyNameBySlug(slug) {
    return fetchCompanyDataBySlug(slug).then(json => json['name']);
}

export function fetchSvaDataBySlug(slug) {
    return fetch(BASE_URL + 'db/sva/' + slug + '.json')
        .then(res => res.json())
        .catch(err => {
            err.enduser_message = t('sva-not-found', 'error-msg');
            rethrow(ErrorException.fromError(err), undefined, { slug: slug });
        });
}

export function fetchSvaNameBySlug(slug) {
    return fetchSvaDataBySlug(slug).then(json => json['name']);
}
