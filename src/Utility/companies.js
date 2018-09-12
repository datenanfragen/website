import {ErrorException, rethrow} from "./errors";
import t from 'Utility/i18n';

// Another merge conflict with !23. I have already moved this function out of the generator in !23 and switched the previous usages to this (which I have not done here). I have made some additional changes here, though.

export function fetchCompanyDataBySlug(slug, callback) {
	fetch(BASE_URL + 'db/' + slug + '.json')
	.then(res => res.json()).then(json => {callback(json)})
	.catch(err => { err.enduser_message = t('company-not-found', 'error-msg'); rethrow(ErrorException.fromError(err), undefined, { slug: slug }); });
}

export function fetchCompanyNameBySlug(slug, callback) {
	fetchCompanyDataBySlug(slug, (json) => {callback(json['name'])});
}
