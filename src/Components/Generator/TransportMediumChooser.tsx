import t from '../../Utility/i18n';
import { Text, IntlProvider } from 'preact-i18n';
import { Radio } from '../Radio';
import { TransportMedium, TRANSPORT_MEDIA } from '../../types/request.d';

type TransportMediumChooserProps = {
    value: TransportMedium;
    onChange: (value: TransportMedium) => void;
};

export function TransportMediumChooser(props: TransportMediumChooserProps) {
    return (
        <IntlProvider scope="generator" definition={window.I18N_DEFINITION}>
            <div className="request-transport-medium-chooser">
                <Text id="request-transport-medium" />
                <br />
                <div className="radio-group">
                    {TRANSPORT_MEDIA.map((transport_medium) => (
                        <Radio
                            id={`request-transport-medium-choice-${transport_medium}`}
                            radioVariable={props.value}
                            value={transport_medium}
                            name="transport-medium"
                            onChange={(value) => props.onChange(value as TransportMedium)}
                            label={t(transport_medium, 'generator')}
                        />
                    ))}
                </div>
            </div>
        </IntlProvider>
    );
}
