import preact from 'preact';
import { IntlProvider, MarkupText, Text } from 'preact-i18n';
import Modal from './Modal';
import t from 'Utility/i18n';

export default class I18nWidget extends preact.Component {
    constructor(props) {
        super(props);

        // Don't ever update `this.state.country` directly but rather use `globals.country`.
        // We can't lift the state up from `I18nButton` because `I18nWidget` has to work on its own.
        this.state.country = globals.country;
        globals._country_listeners.push(value => {
            this.setState({ country: value });
        });
    }

    static alreadyShowingModal = false;
    static showLanguageChangeModal(event) {
        if (I18nWidget.alreadyShowingModal || event.target.value === LOCALE) return;

        const dismiss = () => {
            preact.render('', document.body, modal);
            I18nWidget.alreadyShowingModal = false;
            event.target.value = LOCALE;
        };
        const modal = preact.render(
            <IntlProvider scope="i18n-widget" definition={I18N_DEFINITION}>
                <Modal
                    positiveText={<Text id="change-lang" />}
                    onPositiveFeedback={() => {
                        window.location = SUPPORTED_LANGUAGES[event.target.value];
                    }}
                    positiveDefault={true}
                    negativeText={<Text id="stay" />}
                    onNegativeFeedback={dismiss}>
                    <p>
                        <MarkupText id="language-change-modal" />
                    </p>
                </Modal>
            </IntlProvider>,
            document.body
        );
        I18nWidget.alreadyShowingModal = true;
    }

    static changeCountry(e) {
        globals.country = e.target.value;
    }

    render() {
        let language_options = [];
        for (let lang in SUPPORTED_LANGUAGES) {
            language_options.push(
                <option value={lang}>
                    <Text id={'language-desc-' + lang} />
                </option>
            );
        }

        let country_options = [];
        SUPPORTED_COUNTRIES.forEach(country => {
            country_options.push(<option value={country}>{t(country, 'countries')}</option>);
        });

        return (
            <IntlProvider scope="i18n-widget" definition={I18N_DEFINITION}>
                <div className="i18n-widget">
                    <div className="i18n-widget-language">
                        <h2>
                            <Text id="language" />
                        </h2>
                        <div className="select-container">
                            <select
                                value={LOCALE}
                                onBlur={I18nWidget.showLanguageChangeModal}
                                onChange={I18nWidget.showLanguageChangeModal}>
                                <option value={LOCALE}>
                                    <Text id={'language-desc-' + LOCALE} />
                                </option>
                                {language_options}
                            </select>
                            <div className="icon icon-arrow-down" />
                        </div>
                    </div>
                    <div className="i18n-widget-country">
                        <h2>
                            <Text id="country" />
                        </h2>
                        <div className="select-container">
                            {/* eslint-disable jsx-a11y/no-onchange */}
                            <select value={this.state.country} onChange={I18nWidget.changeCountry}>
                                {country_options}
                            </select>
                            {/* eslint-enable */}
                            <div className="icon icon-arrow-down" />
                        </div>
                    </div>
                    {this.props.minimal ? (
                        []
                    ) : (
                        <p>
                            <Text id="not-supported-prompt" />{' '}
                            <a href="/contribute#i18n" className="no-link-decoration">
                                <Text id="not-supported-cta" />
                            </a>
                        </p>
                    )}
                </div>
            </IntlProvider>
        );
    }
}

export class I18nButton extends preact.Component {
    constructor(props) {
        super(props);

        // Don't ever update `this.state.country` directly but rather use `globals.country`.
        this.state.country = globals.country;
        globals._country_listeners.push(value => {
            this.setState({ country: value });
        });
    }

    render() {
        return (
            <IntlProvider scope="i18n-widget" definition={I18N_DEFINITION}>
                <div className="dropup-container">
                    <button
                        className="i18n-button button button-secondary icon icon-i18n menu-link"
                        href="javascript:void(0)">
                        <Text id={'language-' + LOCALE} /> / {t(this.state.country, 'countries')}
                    </button>
                    <div className="dropup i18n-widget-container">
                        <I18nWidget />
                    </div>
                </div>
            </IntlProvider>
        );
    }
}
