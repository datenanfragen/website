import { render } from 'preact';
import { IntlProvider, MarkupText, Text } from 'preact-i18n';
import { useEffect, useRef, useState } from 'preact/hooks';
import { useAppStore } from '../store/app';
import { clientPost } from '../Utility/browser';
import { almostUniqueId, renderMoney } from '../Utility/common';
import { CriticalException, rethrow } from '../Utility/errors';
import t from '../Utility/i18n';
import { flash, FlashMessage } from './FlashMessage';
import { LoadingIndicator } from './LoadingIndicator';
import { Radio } from './Radio';

const DONATIONS_API = 'https://backend.datenanfragen.de/donation';
const SUGGESTED_AMOUNTS = [5, 10, 15, 25, 50, 75, 100, 150, 200, 250];
const PAYMENT_METHODS = ['bank-transfer', /*'creditcard',*/ 'cryptocurrency', 'paypal'/*, 'mollie'*/];

const amount_after_linear_fee = (fee_percent: number, fee_fixed: number, x: number) => x - fee_fixed - x * fee_percent;

const PAYMENT_NETTO: { [method: string]: (x: number) => number } = {
    'bank-transfer': (x) => x,
    cryptocurrency: (x) => amount_after_linear_fee(0.01, 0, x),
    paypal: (x) => amount_after_linear_fee(0.015, 0.35, x),
} as const;

export const DonationWidget = () => {
    const epcr_canvas_ref = useRef<HTMLCanvasElement | null>(null);
    const bezahlcode_canvas_ref = useRef<HTMLCanvasElement | null>(null);
    const [amount, setAmount] = useState(15.0);
    const [paymentMethod, setPaymentMethod] = useState<string>('bank-transfer');
    const [ongoingRequest, setOngoingRequest] = useState(false);
    const [step, setStep] = useState('select-params');
    const [donationReference, setDonationReference] = useState('');
    const savedLocale = useAppStore((state) => state.savedLocale);

    useEffect(() => {
        const previousDonationReference = window.PARAMETERS['donation_reference'];
        if (!previousDonationReference) return;
        fetch(`${DONATIONS_API}/state/${previousDonationReference}`)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else if (response.status === 404) {
                    flash(<FlashMessage type="warning">{t('no-mollie-id', 'donation-widget')}</FlashMessage>);
                    return;
                }
                throw new CriticalException(
                    'Server error while fetching donation status.',
                    { donation_reference: previousDonationReference, response },
                    t('error-donation-server', 'donation-widget')
                );
            })
            .then((json) => {
                switch (json?.status) {
                    case 'paid':
                        window.location.href = `${window.BASE_URL}thanks#!donation_reference=${json.reference}`;
                        break;
                    case 'failed':
                        flash(<FlashMessage type="error">{t('donation-failed', 'donation-widget')}</FlashMessage>);
                        break;
                    case 'expired':
                        flash(<FlashMessage type="warning">{t('donation-expired', 'donation-widget')}</FlashMessage>);
                        break;
                }
            })
            .catch((e) => rethrow(e));
    });

    const handlePayment = () => {
        if (ongoingRequest) return;

        const newDonationReference = almostUniqueId();
        // setState is async you won't be able to use the new value in this function
        setDonationReference(newDonationReference);

        if (amount <= 0) {
            flash(<FlashMessage type="error">{t('error-amount-invalid', 'donation-widget')}</FlashMessage>);
            return;
        }
        // We only allow donations less than 1€ by bank transfer. With the other gateways they just don't make any sense
        // due to the high fees. The CoinGate API actually fails for payments of less than 10ct.
        else if (paymentMethod !== 'bank-transfer' && amount < 1) {
            flash(<FlashMessage type="error">{t('error-amount-too-little', 'donation-widget')}</FlashMessage>);
            return;
        }

        switch (paymentMethod) {
            case 'bank-transfer':
                setStep('bank-transfer-info');

                import(/* webpackChunkName: "bank-transfer-codes" */ '../Utility/bank-transfer-codes').then(
                    (module) => {
                        if (epcr_canvas_ref.current)
                            module.renderEpcrQr(epcr_canvas_ref.current, amount, newDonationReference);
                        if (bezahlcode_canvas_ref.current)
                            module.renderBezahlcodeQr(bezahlcode_canvas_ref.current, amount, newDonationReference);
                    }
                );
                break;
            case 'paypal':
                setOngoingRequest(true);
                // Reference for the parameters:
                // https://developer.paypal.com/docs/classic/paypal-payments-standard/integration-guide/Appx-websitestandard-htmlvariables/
                clientPost(
                    'https://www.paypal.com/cgi-bin/webscr',
                    {
                        cmd: '_donations',
                        amount: Number(amount).toFixed(2),
                        item_name: t('reference-value', 'donation-widget', { reference: newDonationReference }),
                        currency_code: 'EUR',
                        business: 'paypal@datenanfragen.de',
                        image_url: 'https://www.datenanfragen.de/img/logo-datenanfragen-ev.png',
                        no_shipping: '1',
                        return: `${window.BASE_URL}thanks#!donation_reference=${newDonationReference}`,
                        cancel_return: `${window.BASE_URL}donate`,
                        custom: newDonationReference,
                    },
                    '_top'
                );
                break;
            case 'mollie':
            case 'creditcard':
            case 'cryptocurrency':
            default: {
                const donation = {
                    method: paymentMethod,
                    amount: Number(amount).toFixed(2),
                    description: t('reference-value', 'donation-widget', { reference: newDonationReference }),
                    reference: newDonationReference,
                    redirect_base: window.BASE_URL,
                };
                setOngoingRequest(true);
                fetch(DONATIONS_API, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                    },
                    body: JSON.stringify(donation),
                })
                    .then((r) => r.json())
                    .then((data) => {
                        if (data?.redirect_url) window.location = data.redirect_url;
                        else {
                            throw new CriticalException(
                                'Malformed response body when trying to get payment provider auth URL.',
                                {
                                    donation_reference: newDonationReference,
                                    request: donation,
                                    response: data,
                                },
                                t('error-auth-url-malformed-response', 'donation-widget')
                            );
                        }
                    })
                    .catch((e) => rethrow(e));
            }
        }
    };

    return (
        <IntlProvider scope="donation-widget" definition={window.I18N_DEFINITION}>
            <div className="box">
                {step === 'select-params' && (
                    <form id="donation-form">
                        <div id="donation-widget-amount-section" className="donation-widget-section">
                            <h2>
                                <label htmlFor="donation-widget-amount">
                                    <Text id="how-much" />
                                </label>
                            </h2>
                            <div className="col60 donation-widget-main-column">
                                <div className="input-addon-container">
                                    <input
                                        id="donation-widget-amount"
                                        type="number"
                                        step="0.01"
                                        min="0.00"
                                        className="form-element"
                                        style="text-align: right;"
                                        value={amount}
                                        onInput={(e) => setAmount(Number.parseFloat(e.currentTarget.value) || 0)}
                                    />
                                    <div className="input-addon">€</div>
                                </div>

                                <div id="donation-widget-amount-buttons">
                                    {SUGGESTED_AMOUNTS.map((suggested_amount) => (
                                        <button
                                            type="button"
                                            className={
                                                'button' + (amount === suggested_amount ? ' button-primary' : '')
                                            }
                                            onClick={() => setAmount(suggested_amount || 0)}>
                                            {suggested_amount} €
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="col40 donation-widget-info-column">
                                <MarkupText id="amount" fields={{ amount: renderMoney(amount, savedLocale) }} />
                            </div>
                        </div>
                        <div className="clearfix" />

                        <div id="donation-widget-payment-method-section" className="donation-widget-section">
                            <h2>
                                <Text id="how" />
                            </h2>
                            <div className="col60 donation-widget-main-column">
                                <div
                                    id="donation-widget-payment-method-buttons"
                                    className="radio-group radio-group-vertical">
                                    {PAYMENT_METHODS.map((methodToChoose) => (
                                        <Radio
                                            id={'payment-method-choice-' + methodToChoose}
                                            radioVariable={paymentMethod}
                                            value={methodToChoose}
                                            name="paymentMethod"
                                            onChange={(method) => setPaymentMethod(method)}
                                            label={
                                                <div>
                                                    <Text id={methodToChoose} />
                                                    {PAYMENT_NETTO[methodToChoose] && (
                                                        <div className="donation-widget-fee-text">
                                                            <MarkupText
                                                                id={
                                                                    PAYMENT_NETTO[methodToChoose](amount) === amount
                                                                        ? 'amount-no-fees'
                                                                        : 'amount-after-fees'
                                                                }
                                                                fields={{
                                                                    amount: renderMoney(
                                                                        PAYMENT_NETTO[methodToChoose](amount),
                                                                        savedLocale
                                                                    ),
                                                                }}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            }
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="col40 donation-widget-info-column" id="donation-widget-info-column">
                                <span>
                                    <Text id={`${paymentMethod}-info`} />
                                </span>
                                <LoadingIndicator shown={ongoingRequest} style="margin-top: 50px;" />
                            </div>
                        </div>
                        <div className="clearfix" />

                        {/* TODO: How about offering to add a comment to a donation? That should be pretty easy to implement since we already have yace which is explicitly designed with the necessary flexibilty to do something like this in mind. */}

                        <div className="donation-widget-section" style="margin-top: 30px;">
                            <button
                                type="button"
                                id="donation-widget-next-button"
                                className={'button button-primary' + (ongoingRequest ? ' disabled' : '')}
                                style="float: right;"
                                onClick={handlePayment}>
                                <Text id="next-step" />
                            </button>
                        </div>
                        <div className="clearfix" />
                    </form>
                )}

                {step === 'bank-transfer-info' && (
                    <div id="bank-transfer-info" className="donation-widget-section">
                        <h2>
                            <Text id="bank-transfer-heading" />
                        </h2>
                        <table id="bank-transfer-data-table" cellSpacing="0">
                            <tr>
                                <td>
                                    <Text id="bank-transfer-recipient" />
                                </td>
                                <td>Datenanfragen.de e. V.</td>
                            </tr>
                            <tr>
                                <td>IBAN</td>
                                <td>DE42 8306 5408 0104 0851 40</td>
                            </tr>
                            <tr>
                                <td>
                                    <Text id="bank-transfer-financial-institution" />
                                </td>
                                <td>Deutsche Skatbank Zweigniederlassung der VR-Bank Altenburger Land GbR</td>
                            </tr>
                            <tr>
                                <td>BIC</td>
                                <td>GENODEF1SLR</td>
                            </tr>
                            <tr>
                                <td>
                                    <Text id="bank-transfer-reference" />
                                </td>
                                <td>
                                    <Text id="reference-value" fields={{ reference: donationReference }} />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <Text id="bank-transfer-amount" />
                                </td>
                                <td>{renderMoney(amount, savedLocale)}&nbsp;€</td>
                            </tr>
                        </table>
                        <div id="bank-transfer-qrcode-section">
                            <h2>
                                <Text id="bank-transfer-qrcodes" />
                            </h2>
                            <div id="bank-transfer-qrcodes">
                                <div id="bank-transfer-epcr-qrcode" className="bank-transfer-qrcode">
                                    <strong>EPCR-QR-CODE</strong>
                                    <canvas id="epcr-qr-canvas" ref={epcr_canvas_ref} />
                                </div>
                                <div id="bank-transfer-bezahlcode-qrcode" className="bank-transfer-qrcode">
                                    <strong>BezahlCode</strong>
                                    <canvas id="bezahlcode-qr-canvas" ref={bezahlcode_canvas_ref} />
                                </div>
                                <div className="clearfix" />
                            </div>
                        </div>
                        <button
                            id="donation-widget-back-button"
                            className="button button-secondary icon-arrow-left"
                            onClick={() => setStep('select-params')}>
                            <span className="sr-only">
                                <Text id="back" />
                            </span>
                        </button>
                        &nbsp;
                        <button
                            id="donation-widget-print-button"
                            className="button button-secondary icon icon-print"
                            onClick={() => printBankTransfer()}>
                            <Text id="print" />
                        </button>
                        <a
                            id="donation-widget-thanks-button"
                            className="button button-primary"
                            style="float: right;"
                            href={`${window.BASE_URL}thanks#!donation_reference=${donationReference}`}>
                            <Text id="thanks" />
                        </a>
                        <div className="clearfix" />
                    </div>
                )}
            </div>
        </IntlProvider>
    );
};

// Adapted after: https://stackoverflow.com/a/12997207
const printBankTransfer = () => {
    const content = document.getElementById('bank-transfer-info');
    const print_window = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
    const style = `<style>
#bank-transfer-data-table td { border: 1px solid #000; padding: 10px; }
.button { display: none; }
#bank-transfer-qrcode-section { display: none; }
</style>`;
    if (!print_window || !content) return;

    print_window.document.write(style + content.innerHTML);
    print_window.document.close();
    print_window.focus();
    print_window.print();
    print_window.close();
};

(window as typeof window & { renderDonationWidget: () => void }).renderDonationWidget = () =>
    document
        .querySelectorAll('.donation-widget')
        .forEach((el) => render(<DonationWidget />, el.parentElement ?? el, el));
