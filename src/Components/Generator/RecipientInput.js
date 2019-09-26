import preact from 'preact';
import t from 'Utility/i18n';
import { Text, IntlProvider } from 'preact-i18n';
import PropTypes from 'prop-types';

export default class RecipientInput extends preact.Component {
    render() {
        return (
            <IntlProvider scope="generator" definition={I18N_DEFINITION}>
                <div className="form-group fancy-fg recipient-form" style="margin-top: 17px;">
                    <Text id="recipient-explanation" />
                    <br />
                    <textarea
                        id="request-recipient"
                        className="form-element"
                        placeholder={t('recipient', 'generator')}
                        rows="4"
                        spellCheck="false"
                        onChange={this.props.onChange}
                        value={this.props.recipientAddress}
                    />
                    <label className="sr-only" htmlFor="request-recipient">
                        <Text id="recipient" />
                    </label>
                </div>
            </IntlProvider>
        );
    }

    static get defaultProps() {
        return {
            recipientAddress: ''
        };
    }

    static propTypes = {
        recipientAddress: PropTypes.string,
        onChange: PropTypes.func.isRequired
    };
}
