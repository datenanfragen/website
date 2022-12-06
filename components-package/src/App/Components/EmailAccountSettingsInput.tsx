import { IntlProvider, Text } from 'preact-i18n';
import { useState } from 'preact/hooks';
import { t_a } from '../Utility/i18n';

type EmailAccountSettings = {
    imapUser: string;
    imapPassword: string;
    imapHost: string;
    imapPort: number;
    imapUseSsl: boolean;
    imapUseStartTls: boolean;

    smtpUser: string;
    smtpPassword: string;
    smtpHost: string;
    smtpPort: number;
    smtpUseSsl: boolean;
    smtpUseStartTls: boolean;
};

export type EmailAccountSettingsInputProps = {
    emailAccountSettings: Omit<EmailAccountSettings, 'imapPassword' | 'smtpPassword'>;
    allowInsecureConnection: boolean;
    setEmailAccountSetting: <KeyT extends keyof EmailAccountSettings>(
        setting: KeyT,
        value: EmailAccountSettings[KeyT]
    ) => void;
    verifyConnection: () => Promise<void>;
};
export const EmailAccountSettingsInput = ({
    emailAccountSettings,
    allowInsecureConnection,
    setEmailAccountSetting,
    verifyConnection,
}: EmailAccountSettingsInputProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const [verificationLoading, setVerificationLoading] = useState(false);

    const connectionSecurityOptions = [...(allowInsecureConnection ? ['none'] : []), 'starttls', 'ssl'];

    return (
        <IntlProvider definition={window.I18N_DEFINITION_APP} scope="settings">
            <fieldset>
                <legend>
                    <Text id="email-settings" />
                </legend>
                <Text id="email-settings-explanation" />

                <h2>
                    <Text id="imap-heading" />
                </h2>
                <div className="form-group">
                    <label htmlFor="imap-user">
                        <Text id="imap-user" />
                    </label>
                    <input
                        type="email"
                        className="form-element"
                        id="imap-user"
                        value={emailAccountSettings.imapUser}
                        placeholder={t_a('imap-user-placeholder', 'settings')}
                        onChange={(e) => setEmailAccountSetting('imapUser', e.currentTarget.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="imap-password">
                        <Text id="imap-password" />
                    </label>
                    <div style="display: flex; flex-direction: row; column-gap: 5px;">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            className="form-element"
                            id="imap-password"
                            style="flex-grow: 1"
                            onChange={(e) => setEmailAccountSetting('imapPassword', e.currentTarget.value)}
                        />
                        <button
                            className="button button-secondary button-small icon-access"
                            onClick={() => setShowPassword(!showPassword)}
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="imap-host">
                        <Text id="imap-host" />
                    </label>
                    <input
                        type="text"
                        className="form-element"
                        id="imap-host"
                        value={emailAccountSettings.imapHost}
                        onChange={(e) => setEmailAccountSetting('imapHost', e.currentTarget.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="imap-port">
                        <Text id="imap-port" />
                    </label>
                    <input
                        type="number"
                        className="form-element"
                        id="imap-port"
                        value={emailAccountSettings.imapPort}
                        onBlur={(e) => {
                            const parsedPort = parseInt(e.currentTarget.value, 10);
                            setEmailAccountSetting(
                                'imapPort',
                                !isNaN(parsedPort) && parsedPort > 0 && parsedPort <= 65535 ? parsedPort : 587
                            );
                        }}
                        min={1}
                        max={65535}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="imap-connection-security">
                        <Text id="imap-connection-security" />
                    </label>
                    <div className="select-container">
                        <select
                            value={
                                emailAccountSettings.imapUseSsl === true
                                    ? 'ssl'
                                    : emailAccountSettings.imapUseStartTls === true || !allowInsecureConnection
                                    ? 'starttls'
                                    : 'none'
                            }
                            onChange={(e) => {
                                setEmailAccountSetting('imapUseSsl', e.currentTarget.value === 'ssl');
                                setEmailAccountSetting('imapUseStartTls', e.currentTarget.value === 'starttls');
                            }}>
                            {connectionSecurityOptions.map((s) => (
                                <option value={s}>
                                    <Text id={`email-connection-security-${s}`} />
                                </option>
                            ))}
                        </select>
                        <div className="icon icon-arrow-down" />
                    </div>
                </div>

                <hr />

                <h2>
                    <Text id="smtp-heading" />
                </h2>
                <div className="form-group">
                    <label htmlFor="smtp-user">
                        <Text id="smtp-user" />
                    </label>
                    <input
                        type="email"
                        className="form-element"
                        id="smtp-user"
                        value={emailAccountSettings.smtpUser}
                        placeholder={t_a('smtp-user-placeholder', 'settings')}
                        onChange={(e) => setEmailAccountSetting('smtpUser', e.currentTarget.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="smtp-password">
                        <Text id="smtp-password" />
                    </label>
                    <div style="display: flex; flex-direction: row; column-gap: 5px;">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            className="form-element"
                            id="smtp-password"
                            style="flex-grow: 1"
                            onChange={(e) => setEmailAccountSetting('smtpPassword', e.currentTarget.value)}
                        />
                        <button
                            className="button button-secondary button-small icon-access"
                            onClick={() => setShowPassword(!showPassword)}
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="smtp-host">
                        <Text id="smtp-host" />
                    </label>
                    <input
                        type="text"
                        className="form-element"
                        id="smtp-host"
                        value={emailAccountSettings.smtpHost}
                        onChange={(e) => setEmailAccountSetting('smtpHost', e.currentTarget.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="smtp-port">
                        <Text id="smtp-port" />
                    </label>
                    <input
                        type="number"
                        className="form-element"
                        id="smtp-port"
                        value={emailAccountSettings.smtpPort}
                        onBlur={(e) => {
                            const parsedPort = parseInt(e.currentTarget.value, 10);
                            setEmailAccountSetting(
                                'smtpPort',
                                !isNaN(parsedPort) && parsedPort > 0 && parsedPort <= 65535 ? parsedPort : 587
                            );
                        }}
                        min={1}
                        max={65535}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="smtp-connection-security">
                        <Text id="smtp-connection-security" />
                    </label>
                    <div className="select-container">
                        <select
                            value={
                                emailAccountSettings.smtpUseSsl === true
                                    ? 'ssl'
                                    : emailAccountSettings.smtpUseStartTls === true || !allowInsecureConnection
                                    ? 'starttls'
                                    : 'none'
                            }
                            onChange={(e) => {
                                setEmailAccountSetting('smtpUseSsl', e.currentTarget.value === 'ssl');
                                setEmailAccountSetting('smtpUseStartTls', e.currentTarget.value === 'starttls');
                            }}>
                            {connectionSecurityOptions.map((s) => (
                                <option value={s}>
                                    <Text id={`email-connection-security-${s}`} />
                                </option>
                            ))}
                        </select>
                        <div className="icon icon-arrow-down" />
                    </div>
                </div>

                <button
                    className="button button-secondary"
                    onClick={() => {
                        setVerificationLoading(true);
                        verifyConnection().then(() => setVerificationLoading(false));
                    }}
                    disabled={verificationLoading}>
                    <Text id={verificationLoading ? 'test-smtp-connection-loading' : 'test-smtp-connection'} />
                </button>
            </fieldset>
        </IntlProvider>
    );
};
