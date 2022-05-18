import t from '../../Utility/i18n';
import { Text, IntlProvider } from 'preact-i18n';
import { TransportMedium } from '../../types/request.d';

type RecipientInputProps = {
    recipientAddress?: string;
    email?: string;
    transportMedium: TransportMedium;
    onAddressChange: (recipient_address: string) => void;
    onEmailChange: (email: string) => void;
};

export function RecipientInput(props: RecipientInputProps) {
    return (
        <IntlProvider scope="generator" definition={window.I18N_DEFINITION}>
            <div className="form-group fancy-fg recipient-form" style="margin-top: 17px;">
                <Text id="recipient-explanation" />
                <br />
                {props.transportMedium === 'email' ? (
                    <input
                        type="email"
                        id="request-recipient"
                        className="form-element"
                        placeholder={t(`recipient-${props.transportMedium}`, 'generator')}
                        onChange={(e) => props.onEmailChange(e.currentTarget.value)}
                        value={props.email}
                    />
                ) : (
                    <textarea
                        id="request-recipient"
                        className="form-element"
                        placeholder={t(`recipient-${props.transportMedium}`, 'generator')}
                        rows={4}
                        spellCheck={false}
                        onChange={(e) => props.onAddressChange(e.currentTarget.value)}
                        value={props.recipientAddress}
                    />
                )}
                <label className="sr-only" htmlFor="request-recipient">
                    <Text id="recipient" />
                </label>
            </div>
        </IntlProvider>
    );
}
