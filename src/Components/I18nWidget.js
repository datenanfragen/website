import { render, Component } from 'preact';
import { IntlProvider, MarkupText, Text } from 'preact-i18n';
import Modal from './Modal';
import t from 'Utility/i18n';
import PropTypes from 'prop-types';

export default class I18nWidget extends Component {
    constructor(props) {
        super(props);

        // Don't ever update `this.state.country` directly but rather use `globals.country`.
        // We can't lift the state up from `I18nButton` because `I18nWidget` has to work on its own.
        this.state = {
            country: globals.country,
        };
        globals._country_listeners.push((value) => {
            this.setState({ country: value });
        });
    }

    static alreadyShowingModal = false;
    static showLanguageChangeModal(event) {
        if (I18nWidget.alreadyShowingModal || event.target.value === LOCALE) return;

        let modal;
        const dismiss = () => {
            render('', document.body, modal);
            I18nWidget.alreadyShowingModal = false;
            event.target.value = LOCALE;
        };
        const selected_lang = event.target.value || LOCALE;

        modal = render(
            <IntlProvider scope={selected_lang} definition={I18N_DEFINITION_REQUESTS}>
                <Modal
                    positiveButton={
                        <a
                            className="button button-primary"
                            href={SUPPORTED_LANGUAGES[event.target.value]}
                            style={'float: right'}>
                            <Text id="change-lang" />
                        </a>
                    }
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
        const language_options = Object.keys(SUPPORTED_LANGUAGES)
            .sort((a, b) =>
                t('language-desc-' + a, 'i18n-widget').localeCompare(t('language-desc-' + b, 'i18n-widget'))
            )
            .map((lang) => <option value={lang}>{t('language-desc-' + lang, 'i18n-widget')}</option>);

        const country_options = SUPPORTED_COUNTRIES.sort((a, b) => {
            if (a === 'all') return -1;
            if (b === 'all') return 1;
            return t(a, 'countries').localeCompare(t(b, 'countries'));
        }).map((country) => <option value={country}>{t(country, 'countries')}</option>);

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
                    {this.props.showLanguageOnly ? (
                        []
                    ) : (
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
                    )}
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

    static propTypes = {
        minimal: PropTypes.bool,
        showLanguageOnly: PropTypes.bool,
    };
}

export class I18nButton extends Component {
    constructor(props) {
        super(props);

        // Don't ever update `this.state.country` directly but rather use `globals.country`.
        this.state = {
            country: globals.country,
        };
        globals._country_listeners.push((value) => {
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
