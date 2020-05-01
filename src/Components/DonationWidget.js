import preact from 'preact';
import { IntlProvider, Text, MarkupText } from 'preact-i18n';
import { PARAMETERS, almostUniqueId, renderMoney } from '../Utility/common';
import { CriticalException, rethrow } from '../Utility/errors';
import t from '../Utility/i18n';
import FlashMessage, { flash } from './FlashMessage';
import Radio from './Radio';
import { clientPost } from '../Utility/browser';
import LoadingIndicator from './LoadingIndicator';

const SERVERLESS_DONATIONS_API = 'https://donate.datenanfragen.de';
const SUGGESTED_AMOUNTS = [5, 10, 15, 25, 50, 75, 100, 150, 200, 250];
// const PAYMENT_METHODS = [ 'bank-transfer', 'paysafecard', 'directdebit', 'creditcard', 'paypal', 'cryptocurrency', 'mollie' ];
const PAYMENT_METHODS = ['bank-transfer', 'creditcard', 'cryptocurrency', 'paypal', 'mollie'];
const MOLLIE_METHODS = ['sofort', 'giropay', 'eps', 'bancontact', 'ideal', 'kbc', 'belfius', 'inghomepay'];

export default class DonationWidget extends preact.Component {
    epcr_canvas_ref = undefined;
    bezahlcode_canvas_ref = undefined;

    constructor(props) {
        super(props);

        this.state = {
            amount: 15,
            payment_method: 'bank-transfer',
            ongoing_request: false,
            step: 'select-params',
            donation_reference: undefined
        };
    }

    componentDidMount() {
        const donation_reference = PARAMETERS['donation_reference'];
        if (!donation_reference) return;
        fetch(`${SERVERLESS_DONATIONS_API}/state/${donation_reference}`)
            .then(response => response.json())
            .then(response => {
                if (!response || !response.status)
                    throw new CriticalException(
                        'Malformed response body when trying to fetch donation status.',
                        { donation_reference, response },
                        t('error-donation-status-malformed-response', 'donation-widget')
                    );

                switch (response.status) {
                    case 'paid':
                        window.location = `${BASE_URL}thanks?donation_reference=${response.reference}`;
                        break;
                    case 'failed':
                        flash(
                            <FlashMessage type="error">
                                <Text id="donation-failed" />
                            </FlashMessage>
                        );
                        break;
                    case 'expired':
                        flash(
                            <FlashMessage type="warning">
                                <Text id="donation-expired" />
                            </FlashMessage>
                        );
                        break;
                }
            })
            .catch(e => rethrow(e));
    }

    donationForm() {
        return (
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
                                value={this.state.amount}
                                onInput={e => this.setState({ amount: Number.parseFloat(e.target.value) || 0 })}
                            />
                            <div className="input-addon">€</div>
                        </div>

                        <div id="donation-widget-amount-buttons">
                            {SUGGESTED_AMOUNTS.map(amount => (
                                <button
                                    className={'button' + (this.state.amount === amount ? ' button-primary' : '')}
                                    onClick={e => {
                                        e.preventDefault();
                                        this.setState({ amount: amount });
                                    }}>
                                    {amount} €
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="col40 donation-widget-info-column">
                        <MarkupText id="amount" fields={{ amount: renderMoney(this.state.amount) }} />
                    </div>
                </div>
                <div className="clearfix"></div>

                <div id="donation-widget-payment-method-section" className="donation-widget-section">
                    <h2>
                        <Text id="how" />
                    </h2>
                    <div className="col60 donation-widget-main-column">
                        <div id="donation-widget-payment-method-buttons" className="radio-group radio-group-vertical">
                            {PAYMENT_METHODS.map(payment_method => (
                                <Radio
                                    id={'payment-method-choice-' + payment_method}
                                    radio_variable={this.state.payment_method}
                                    value={payment_method}
                                    name="payment_method"
                                    onChange={e => {
                                        this.setState({ payment_method: e.target.value });
                                    }}
                                    label={<Text id={payment_method} />}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="col40 donation-widget-info-column" id="donation-widget-info-column">
                        <span>
                            <Text id={`${this.state.payment_method}-info`} />
                        </span>
                        <LoadingIndicator shown={this.state.ongoing_request} style="margin-top: 50px;" />
                    </div>
                </div>
                <div className="clearfix"></div>

                {/* TODO: How about offering to add a comment to a donation? That should be pretty easy to implement since we already have yace which is explicitly designed with the necessary flexibilty to do something like this in mind. */}

                <div className="donation-widget-section" style="margin-top: 30px;">
                    <button
                        id="donation-widget-next-button"
                        className={'button button-primary' + (this.state.ongoing_request ? ' disabled' : '')}
                        style="float: right;"
                        onClick={this.handlePayment}>
                        <Text id="next-step" />
                    </button>
                </div>
                <div className="clearfix"></div>
            </form>
        );
    }

    bankTransferInfo = () => {
        return (
            <div id="bank-transfer-info" className="donation-widget-section">
                <h2>
                    <Text id="bank-transfer-heading" />
                </h2>
                <table id="bank-transfer-data-table" cellSpacing="0">
                    <tr>
                        <td>
                            <Text id="bank-transfer-recipient" />
                        </td>
                        <td>Datenanfragen.de e.&thinsp;V.</td>
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
                            <Text id="reference-value" fields={{ reference: this.state.donation_reference }} />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <Text id="bank-transfer-amount" />
                        </td>
                        <td>{renderMoney(this.state.amount)}&nbsp;€</td>
                    </tr>
                </table>
                <h2>
                    <Text id="bank-transfer-qrcodes" />
                </h2>
                <div id="bank-transfer-qrcodes">
                    <div id="bank-transfer-epcr-qrcode" className="bank-transfer-qrcode">
                        <strong>EPCR-QR-CODE</strong>
                        <canvas id="epcr-qr-canvas" ref={el => (this.epcr_canvas_ref = el)} />
                    </div>
                    <div id="bank-transfer-bezahlcode-qrcode" className="bank-transfer-qrcode">
                        <strong>BezahlCode</strong>
                        <canvas id="bezahlcode-qr-canvas" ref={el => (this.bezahlcode_canvas_ref = el)} />
                    </div>
                    <div className="clearfix"></div>
                </div>
                <button
                    id="donation-widget-back-button"
                    className="button button-secondary icon-arrow-left"
                    onClick={() => this.setState({ step: 'select-params' })}>
                    <span className="sr-only">
                        <Text id="back" />
                    </span>
                </button>
                &nbsp;
                <button
                    id="donation-widget-print-button"
                    className="button button-secondary icon icon-print"
                    onClick={() => DonationWidget.printBankTransfer(this.state.amount, this.state.donation_reference)}>
                    <Text id="print" />
                </button>
                <a
                    id="donation-widget-thanks-button"
                    className="button button-primary"
                    style="float: right;"
                    href={`${BASE_URL}thanks?donation_reference=${this.state.donation_reference}`}>
                    <Text id="thanks" />
                </a>
                <div className="clearfix"></div>
            </div>
        );
    };

    // Adapted after: https://stackoverflow.com/a/12997207
    static printBankTransfer(amount, donation_reference) {
        const content = document.getElementById('bank-transfer-info');
        const print_window = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
        const style = `<style>
#bank-transfer-data-table td { border: 1px solid #000; padding: 10px; }
.button { display: none; }
#bank-transfer-qrcodes { margin: auto; max-width: 672px; }
.bank-transfer-qrcode { float: left; text-align: center; margin: 40px; }
.bank-transfer-qrcode canvas { display: block; }
</style>`;
        print_window.document.write(style + content.innerHTML);

        // innerHTML doesn't keep the canvas content, we need to manually restore that here.
        import(/* webpackChunkName: "bank-transfer-codes" */ '../Utility/bank-transfer-codes').then(module => {
            module.renderEpcrQr(
                print_window.document.getElementById('epcr-qr-canvas'),
                amount,
                donation_reference,
                '#ffffff'
            );
            module.renderBezahlcodeQr(
                print_window.document.getElementById('bezahlcode-qr-canvas'),
                amount,
                donation_reference,
                '#ffffff'
            );
        });
        print_window.document.close();
        print_window.focus();
        print_window.print();
        print_window.close();
    }

    handlePayment = e => {
        e.preventDefault();
        if (this.state.ongoing_request) return;

        this.setState({ donation_reference: almostUniqueId() });

        const payment_method = this.state.payment_method === 'mollie' ? MOLLIE_METHODS : this.state.payment_method;

        if (payment_method === 'bank-transfer') {
            this.setState({ step: 'bank-transfer-info' });

            import(/* webpackChunkName: "bank-transfer-codes" */ '../Utility/bank-transfer-codes').then(module => {
                module.renderEpcrQr(this.epcr_canvas_ref, this.state.amount, this.state.donation_reference);
                module.renderBezahlcodeQr(this.bezahlcode_canvas_ref, this.state.amount, this.state.donation_reference);
            });

            return;
        }

        // We only allow donations less than 1€ by bank transfer. With the other gateways they just don't make any sense
        // due to the high fees. The CoinGate API actually fails for payments of less than 10ct.
        if (this.state.amount < 1) {
            flash(<FlashMessage type="error">{t('error-amount-too-little', 'donation-widget')}</FlashMessage>);
            return;
        }

        if (payment_method === 'paypal') {
            this.setState({ ongoing_request: true });
            // Reference for the parameters:
            // https://developer.paypal.com/docs/classic/paypal-payments-standard/integration-guide/Appx-websitestandard-htmlvariables/
            clientPost(
                'https://www.paypal.com/cgi-bin/webscr',
                {
                    cmd: '_donations',
                    amount: Number(this.state.amount).toFixed(2),
                    item_name: t('reference-value', 'donation-widget', { reference: this.state.donation_reference }),
                    currency_code: 'EUR',
                    business: 'paypal@datenanfragen.de',
                    image_url: 'https://www.datenanfragen.de/img/logo-datenanfragen-ev.png',
                    no_shipping: 1,
                    return: `${BASE_URL}thanks?donation_reference=${this.state.donation_reference}`,
                    cancel_return: `${BASE_URL}donate`,
                    custom: this.state.donation_reference
                },
                '_top'
            );
            return;
        }

        function postRequest(url, data) {
            return fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify(data)
            }).then(response => response.json());
        }

        let serverless_request_data = {};
        if (['mollie', 'creditcard', 'directdebit', 'paysafecard'].includes(this.state.payment_method)) {
            serverless_request_data = {
                payment_provider: 'mollie',
                data: {
                    amount: {
                        value: Number(this.state.amount).toFixed(2),
                        currency: 'EUR'
                    },
                    description: t('reference-value', 'donation-widget', { reference: this.state.donation_reference }),
                    redirectUrl: `${BASE_URL}donate?donation_reference=${this.state.donation_reference}`,
                    method: payment_method,
                    metadata: {
                        donation_reference: this.state.donation_reference
                    }
                }
            };
        } else if (payment_method === 'cryptocurrency') {
            serverless_request_data = {
                payment_provider: 'coingate',
                data: {
                    price_amount: Number(this.state.amount).toFixed(2),
                    price_currency: 'EUR',
                    receive_currency: 'EUR',
                    title: t('reference-value', 'donation-widget', { reference: this.state.donation_reference }),
                    success_url: `${BASE_URL}donate?donation_reference=${this.state.donation_reference}`,
                    cancel_url: `${BASE_URL}donate`,
                    order_id: this.state.donation_reference
                }
            };
        }

        this.setState({ ongoing_request: true });
        postRequest(SERVERLESS_DONATIONS_API, serverless_request_data)
            .then(data => {
                if (data && data.auth_url) window.location = data.auth_url;
                else {
                    throw new CriticalException(
                        'Malformed response body when trying to get payment provider auth URL.',
                        {
                            donation_reference: this.state.donation_reference,
                            request: serverless_request_data,
                            response: data
                        },
                        t('error-auth-url-malformed-response', 'donation-widget')
                    );
                }
            })
            .catch(e => rethrow(e));
    };

    render() {
        return (
            <IntlProvider scope="donation-widget" definition={I18N_DEFINITION}>
                <div className="box">
                    {this.state.step === 'select-params' ? this.donationForm() : []}
                    {this.state.step === 'bank-transfer-info' ? this.bankTransferInfo() : []}
                </div>
            </IntlProvider>
        );
    }
}
