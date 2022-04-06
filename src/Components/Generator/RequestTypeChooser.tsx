import t from '../../Utility/i18n';
import Radio from '../Radio';
import { RequestType, REQUEST_TYPES } from 'request';
import type { JSX } from 'preact';

type RequestTypeChooserProps = {
    onTypeChange: (value: RequestType) => void;
    current?: RequestType;
    request_types?: RequestType[];
};

export default function RequestTypeChooser(props: RequestTypeChooserProps) {
    const request_types = props.request_types || REQUEST_TYPES;
    const current = props.current || request_types[0];
    const radios = request_types.map((type) => (
        <Radio
            id={'request-type-choice-' + type}
            radio_variable={current}
            value={type}
            name="request-type"
            onChange={(e: JSX.TargetedEvent<HTMLInputElement, Event>) => {
                props.onTypeChange((e.target as HTMLInputElement).value as RequestType);
            }}
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
