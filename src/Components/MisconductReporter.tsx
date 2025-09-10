import { render } from 'preact';
import { useCallback, useState } from 'preact/hooks';
import { flash, FlashMessage } from './FlashMessage';
import t from '../Utility/i18n';
import { Text, IntlProvider } from 'preact-i18n';
import { readKey, encrypt, createMessage } from 'openpgp';

const apiUrl = 'https://backend.datenanfragen.de/report-misconduct';
const armoredKey = `-----BEGIN PGP PUBLIC KEY BLOCK-----
Comment: 6638 17E7 7D01 8B53 7E08  6928 2E16 9F53 4FF2 F0D9
Comment: Anti-Harassment Team <conduct@datenanfragen.de>

xjMEZ2MTWxYJKwYBBAHaRw8BAQdAMUt2wwAZh82y8EJ+EbSva0Mi0MJE0JkyVPwf
uBdeoCPNL0FudGktSGFyYXNzbWVudCBUZWFtIDxjb25kdWN0QGRhdGVuYW5mcmFn
ZW4uZGU+wo8EExYIADcWIQRmOBfnfQGLU34IaSguFp9TT/Lw2QUCZ2MTWwUJEswD
AAIbAwQLCQgHBRUICQoLBRYCAwEAAAoJEC4Wn1NP8vDZZJwBALwk3S1PVNZqfVal
FAxQl2cPZY2Z1kVR8n2KSxa4X4UWAPoDKph9VeFrqsePjaCUocpwvhEZryMKov4+
/kNkG3mdBM44BGdjE1sSCisGAQQBl1UBBQEBB0DICzQXRnURlGjcSSPKdIn0wsGP
lf+Slah4sdJnScuHegMBCAfCfgQYFggAJhYhBGY4F+d9AYtTfghpKC4Wn1NP8vDZ
BQJnYxNbBQkSzAMAAhsMAAoJEC4Wn1NP8vDZSBcBALq8VAqxegv2JNL0AxHYG3ZU
d4zr48qTZuU3WqjwE5cjAQCqZ3+TPKOek0zef4yeneUckW2Y0j5fNeBmuN6Dp/g/
Dw==
=IzC3
-----END PGP PUBLIC KEY BLOCK-----`;

export const MisconductReporter = () => {
    const [message, setMessage] = useState('');

    const submitReport = useCallback(async () => {
        const publicKey = await readKey({ armoredKey });
        const encryptedMessage = await encrypt({
            message: await createMessage({ text: message }),
            encryptionKeys: publicKey,
        });
        await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ encryptedMessage }),
        })
            .then((res) => {
                if (res.ok) {
                    flash(<FlashMessage type="success">{t('send-success', 'report-misconduct')}</FlashMessage>);
                    setMessage('');
                } else throw new Error('Could not send misconduct report. Invalid response from backend.');
            })
            .catch((err) => {
                // Deliberately not throwing here because, for reasons that I don't fully grasp, that clears the
                // message, which is obviously a horrible UX.
                flash(<FlashMessage type="error">{t('send-error', 'report-misconduct')}</FlashMessage>);
                // eslint-disable-next-line no-console
                console.error('Sending misconduct report failed:', err);
            });
    }, [message]);

    return (
        <IntlProvider definition={window.I18N_DEFINITION} scope="report-misconduct">
            <form id="report-form">
                <p style="margin-top: 0;">
                    <Text id="encryption-explanation" />
                </p>

                <strong>
                    <label htmlFor="message-input">
                        <Text id="message" />
                    </label>
                </strong>
                <br />
                <div className="form-group form-group-vertical">
                    <textarea
                        id="message-input"
                        className="form-element"
                        rows={15}
                        required={true}
                        value={message}
                        onChange={(e) => setMessage(e.currentTarget.value)}
                    />
                </div>

                <button
                    id="submit-message"
                    className="button button-secondary"
                    onClick={(e) => {
                        e.preventDefault();
                        submitReport();
                    }}
                    disabled={!message}
                    style="float: right;">
                    <Text id="submit" />
                </button>
                <div className="clearfix" />
            </form>
        </IntlProvider>
    );
};

const elem = document.getElementById('misconduct-reporter');
if (elem) render(<MisconductReporter />, elem);
