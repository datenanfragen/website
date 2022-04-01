import { useGeneratorStore } from '../../../src/store/generator';
import { IdDataElement } from '../../../src/types/request.d';
import { defaultRequest, REQUEST_FALLBACK_LANGUAGE } from '../../../src/Utility/requests';

describe('Unit Test Generator Store', () => {
    context('RequestStore', () => {
        const resetRequestToDefault = useGeneratorStore.getState().resetRequestToDefault;
        const addField = useGeneratorStore.getState().addField;

        it('is initalized with the default request', () => {
            const request = useGeneratorStore.getState().request;
            expect(request).to.equal(defaultRequest(REQUEST_FALLBACK_LANGUAGE));
        });

        it('can be reset to a different language', () => {
            resetRequestToDefault('de');
            const request = useGeneratorStore.getState().request;
            expect(request).to.equal(defaultRequest('de'));
        });

        it('can accept new text fields', () => {
            const text_field: IdDataElement = {
                desc: 'Custom',
                type: 'input',
                value: 'Test',
                optional: false,
            };
            addField(text_field, 'id_data');
            const request = useGeneratorStore.getState().request;
            expect(request.id_data).to.include(text_field);
        });
    });
});
