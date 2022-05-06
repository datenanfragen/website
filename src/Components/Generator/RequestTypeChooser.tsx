import t from '../../Utility/i18n';
import { Radio } from '../Radio';
import { RequestType, REQUEST_TYPES } from 'request';
import type { JSX } from 'preact';
import { useGeneratorStore } from '../../store/generator';

type RequestTypeChooserProps = {
    request_types?: RequestType[];
};

export function RequestTypeChooser(props: RequestTypeChooserProps) {
    const setRequestType = useGeneratorStore((state) => state.setRequestType);
    const request_type = useGeneratorStore((state) => state.request.type);

    const request_types = props.request_types || REQUEST_TYPES;
    const current = request_type || request_types[0];
    const radios = request_types.map((type) => (
        <Radio
            id={'request-type-choice-' + type}
            radioVariable={current}
            value={type}
            name="request-type"
            onChange={(value) => setRequestType(value as RequestType)}
            label={t(`${type}-request`, 'generator')}
        />
    ));

    return (
        <div className="request-type-chooser">
            {t('request-type', 'generator')}
            <br />
            <div
                className={`radio-group${
                    request_types.length > 2 ? ' radio-group-vertical' : 'radio-group-horizontal'
                }`}>
                {radios}
            </div>
        </div>
    );
}
