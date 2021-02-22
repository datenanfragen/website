import { Component } from 'preact';
import PropTypes from 'prop-types';
import t from 'Utility/i18n';
import { Text, IntlProvider } from 'preact-i18n';
import Radio from '../Radio';

export default class TransportMediumChooser extends Component {
    render() {
        return (
            <IntlProvider scope="generator" definition={I18N_DEFINITION}>
                <div className="request-transport-medium-chooser">
                    <Text id="request-transport-medium" />
                    <br />
                    <div className="radio-group">
                        <Radio
                            id="request-transport-medium-choice-email"
                            radio_variable={this.props.transportMedium}
                            value="email"
                            name="transport-medium"
                            onChange={this.props.onChange}
                            label={t('email', 'generator')}
                        />
                        <Radio
                            id="request-transport-medium-choice-fax"
                            radio_variable={this.props.transportMedium}
                            value="fax"
                            name="transport-medium"
                            onChange={this.props.onChange}
                            label={t('fax', 'generator')}
                        />
                        <Radio
                            id="request-transport-medium-choice-letter"
                            radio_variable={this.props.transportMedium}
                            value="letter"
                            name="transport-medium"
                            onChange={this.props.onChange}
                            label={t('letter', 'generator')}
                        />
                    </div>
                </div>
            </IntlProvider>
        );
    }

    static get defaultProps() {
        return {
            transportMedium: 'email',
        };
    }

    static propTypes = {
        transportMedium: PropTypes.string,
        onChange: PropTypes.func.isRequired,
    };
}
