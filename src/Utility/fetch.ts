import type { RequestType, CustomTemplateName } from '../types/request';
import t from './i18n';
import { fetchTemplate, REQUEST_FALLBACK_LANGUAGE } from './requests';
import { CriticalException, rethrow } from './errors';

export const requestTemplate = (
    locale: string,
    template: string,
    request_type: RequestType | Exclude<CustomTemplateName, 'no-template'>
) => {
    const template_url = `${window.BASE_URL}templates/${locale}/${template}.txt`;

    return fetch(template_url)
        .then((response) => {
            switch (response.status) {
                case 200:
                    return response.text();
                case 404:
                    if (locale !== REQUEST_FALLBACK_LANGUAGE)
                        return fetchTemplate(REQUEST_FALLBACK_LANGUAGE, request_type, undefined, '');

                    throw new CriticalException(
                        'Request template could not be found.',
                        { locale, template, template_url, response },
                        t('error-template-not-found', 'generator')
                    );
                default:
                    throw new CriticalException(
                        'Fetching the request template failed.',
                        { locale, template, template_url, response },
                        t('error-template-fetch-failed', 'generator')
                    );
            }
        })
        .catch((error) =>
            rethrow(error, 'fetchTemplate() failed.', { template_url }, t('error-template-fetch-failed', 'generator'))
        );
};
