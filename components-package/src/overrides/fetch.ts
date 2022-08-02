import templates from '../generated/templates.json';
import type { RequestType } from '../../../src/types/request';
import t from '../../../src/Utility/i18n';
import { fetchTemplate, REQUEST_FALLBACK_LANGUAGE } from '../../../src/Utility/requests';
import { CriticalException } from '../../../src/Utility/errors';

export const requestTemplate = async (locale: keyof typeof templates, template: string, request_type: RequestType) => {
    if (!(locale in templates) || !(template in templates[locale])) {
        if (locale !== REQUEST_FALLBACK_LANGUAGE)
            return fetchTemplate(REQUEST_FALLBACK_LANGUAGE, request_type, undefined, '');

        throw new CriticalException(
            'Request template could not be found.',
            { locale, template, request_type },
            t('error-template-not-found', 'generator')
        );
    }

    return templates[locale][template as keyof typeof templates[typeof locale]];
};
