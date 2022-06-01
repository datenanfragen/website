import type { JSX } from 'preact';
import { IntlProvider, MarkupText, Text } from 'preact-i18n';
import { useCallback, useState } from 'preact/hooks';
import { Country, useAppStore } from '../store/app';
import t from '../Utility/i18n';
import { useModal } from './Modal';

type I18nWidgetProps = {
    minimal: boolean;
    showLanguageOnly: boolean;
};

export const I18nWidget = (props: I18nWidgetProps) => {
    const [country, changeCountry] = useAppStore((state) => [state.country, state.changeCountry]);

    const [newLanguage, setNewLanguage] = useState(window.LOCALE);

    const [Modal, showModal, dismissModal] = useModal(<MarkupText id="language-change-modal" />, {
        positiveButton: (
            <a className="button button-primary" href={window.SUPPORTED_LANGUAGES[newLanguage]} style={'float: right'}>
                <Text id="change-lang" />
            </a>
        ),
        negativeText: <Text id="stay" />,
        onNegativeFeedback: () => {
            setNewLanguage(window.LOCALE);
            dismissModal();
        },
        hasDismissButton: false,
        backdropDismisses: false,
    });
    const changeLanguage = useCallback(
        (e: JSX.TargetedEvent<HTMLSelectElement>) => {
            const selected_language = e.currentTarget.value as typeof window.LOCALE;
            if (selected_language === window.LOCALE || selected_language === newLanguage) return;

            setNewLanguage(selected_language);
            showModal();
        },
        [newLanguage, showModal]
    );

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
            <IntlProvider scope={newLanguage} definition={window.I18N_DEFINITION_REQUESTS}>
                <Modal />
            </IntlProvider>

            <div className="i18n-widget">
                <div className="i18n-widget-language">
                    <h2>
                        <Text id="language" />
                    </h2>
                    <div className="select-container">
                        <select value={window.LOCALE} onBlur={changeLanguage} onChange={changeLanguage}>
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
                            <select value={country} onChange={(e) => changeCountry(e.currentTarget.value as Country)}>
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
    const { country } = useAppStore();

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
