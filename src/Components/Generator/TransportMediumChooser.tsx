import t from '../../Utility/i18n';
import { Text, IntlProvider } from 'preact-i18n';
import Radio from '../Radio';
import { TransportMedium, TRANSPORT_MEDIA } from 'request';
import type { JSX } from 'preact';

type TransportMediumChooserProps = {
    transportMedium: TransportMedium;
    onChange: (value: TransportMedium) => void;
};

export default function TransportMediumChooser(props: TransportMediumChooserProps) {
    return (
        <IntlProvider scope="generator" definition={window.I18N_DEFINITION}>
            <div className="request-transport-medium-chooser">
                <Text id="request-transport-medium" />
                <br />
                <div className="radio-group">
                    {TRANSPORT_MEDIA.map((transport_medium) => (
                        <Radio
                            id={`request-transport-medium-choice-${transport_medium}`}
                            radio_variable={props.transportMedium}
                            value={transport_medium}
                            name="transport-medium"
                            onChange={(e: JSX.TargetedEvent<HTMLInputElement, Event>) =>
                                props.onChange(e.currentTarget.value as TransportMedium)
                            }
                            label={t(transport_medium, 'generator')}
                        />
                    ))}
                </div>
            </div>
        </IntlProvider>
    );
}
