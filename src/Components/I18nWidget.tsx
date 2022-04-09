import { render } from 'preact';
import { useState } from 'preact/hooks';
import { IntlProvider, MarkupText, Text } from 'preact-i18n';
import Modal from './DeprecatedModal';
import t from '../Utility/i18n';

type I18nWidgetProps = {
    minimal: boolean;
    showLanguageOnly: boolean;
};

let alreadyShowingModal = false;
const showLanguageChangeModal = (new_language: typeof window.LOCALE) => {
    if (alreadyShowingModal || new_language === window.LOCALE) return;

    render(
        <IntlProvider scope={new_language} definition={window.I18N_DEFINITION_REQUESTS}>
            <Modal
                positiveButton={
                    <a
                        className="button button-primary"
                        href={window.SUPPORTED_LANGUAGES[new_language]}
                        style={'float: right'}>
                        <Text id="change-lang" />
                    </a>
                }
                positiveDefault={true}
                negativeText={<Text id="stay" />}
                onNegativeFeedback={() => {
                    render('', document.body);
                    alreadyShowingModal = false;
                }}>
                <MarkupText id="language-change-modal" />
            </Modal>
        </IntlProvider>,
        document.body
    );
    alreadyShowingModal = true;
};

export const I18nWidget = (props: I18nWidgetProps) => {
    // Don't ever update `country` directly but rather use `globals.country`.
    const [country, setCountry] = useState(window.globals.country);
    window.globals._country_listeners.push((new_country) => setCountry(new_country));

    const language_options = (Object.keys(window.SUPPORTED_LANGUAGES) as (keyof typeof window.SUPPORTED_LANGUAGES)[])
        .sort((a, b) => t(`language-desc-${a}`, 'i18n-widget').localeCompare(t(`language-desc-${b}`, 'i18n-widget')))
        .map((lang) => <option value={lang}>{t(`language-desc-${lang}`, 'i18n-widget')}</option>);

    const country_options = window.SUPPORTED_COUNTRIES.sort((a, b) => {
        if (a === 'all') return -1;
        if (b === 'all') return 1;
        return t(a, 'countries').localeCompare(t(b, 'countries'));
    }).map((country) => <option value={country}>{t(country, 'countries')}</option>);

    return (
        <IntlProvider scope="i18n-widget" definition={window.I18N_DEFINITION}>
            <div className="i18n-widget">
                <div className="i18n-widget-language">
                    <h2>
                        <Text id="language" />
                    </h2>
                    <div className="select-container">
                        <select
                            value={window.LOCALE}
                            onBlur={(e) =>
                                showLanguageChangeModal((e.target as HTMLInputElement)?.value as typeof window.LOCALE)
                            }
                            onChange={(e) =>
                                showLanguageChangeModal((e.target as HTMLInputElement)?.value as typeof window.LOCALE)
                            }>
                            <option value={window.LOCALE}>
                                <Text id={`language-desc-${window.LOCALE}`} />
                            </option>
                            {language_options}
                        </select>
                        <div className="icon icon-arrow-down" />
                    </div>
                </div>
                {!props.showLanguageOnly && (
                    <div className="i18n-widget-country">
                        <h2>
                            <Text id="country" />
                        </h2>
                        <div className="select-container">
                            <select
                                value={country}
                                onChange={(e) => {
                                    window.globals.country = (e.target as HTMLInputElement)
                                        ?.value as typeof window.globals.country;
                                }}>
                                {country_options}
                            </select>
                            <div className="icon icon-arrow-down" />
                        </div>
                    </div>
                )}
                {!props.minimal && (
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
};

export const I18nButton = () => {
    // Don't ever update `country` directly but rather use `globals.country`.
    const [country, setCountry] = useState(window.globals.country);
    window.globals._country_listeners.push((new_country) => setCountry(new_country));

    return (
        <IntlProvider scope="i18n-widget" definition={window.I18N_DEFINITION}>
            <div className="dropup-container">
                <button
                    className="i18n-button button button-secondary icon icon-i18n menu-link"
                    href="javascript:void(0)">
                    <Text id={`language-${window.LOCALE}`} /> / {t(country, 'countries')}
                </button>
                <div className="dropup i18n-widget-container">
                    <I18nWidget minimal={false} showLanguageOnly={false} />
                </div>
            </div>
        </IntlProvider>
    );
};
