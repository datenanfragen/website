import {ErrorException, rethrow} from "./errors";
import t from 'Utility/i18n';

export function fetchCompanyDataBySlug(slug, callback) {
	fetch(BASE_URL + 'db/' + slug + '.json')
	.then(res => res.json()).then(json => {callback(json)})
	.catch(err => { err.enduser_message = t('company-not-found', 'error-msg'); rethrow(ErrorException.fromError(err), undefined, { slug: slug }); });
}

export function fetchCompanyNameBySlug(slug, callback) {
	fetchCompanyDataBySlug(slug, (json) => {callback(json['name'])});
}
