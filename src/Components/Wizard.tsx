import { useState, useEffect } from 'preact/hooks';
import { Text, MarkupText, IntlProvider } from 'preact-i18n';
import { useAppStore } from '../store/app';
import { useFetch } from '../hooks/useFetch';
import { SearchBar } from './SearchBar';
import { SavedCompanies } from '../DataType/SavedCompanies';
import t from '../Utility/i18n';
import { rethrow } from '../Utility/errors';
import { Privacy, PRIVACY_ACTIONS } from '../Utility/Privacy';

const categories = [
    'suggested',
    'commerce',
    'entertainment',
    'social media',
    'finance',
    'insurance',
    'telecommunication',
    'utility',
    /*'public body',*/
    'other',
] as const;

const saved_companies = Privacy.isAllowed(PRIVACY_ACTIONS.SAVE_WIZARD_ENTRIES) ? new SavedCompanies() : undefined;

type CompanyNameToSlug = Record<string, string>;

export const Wizard = () => {
    const country = useAppStore((state) => state.country);

    const [currentTab, setCurrentTab] = useState(0);
    const [selectedCompanies, setSelectedCompanies] = useState<CompanyNameToSlug>({});

    const isLastTab = currentTab === categories.length - 1;
    const changeTab = (new_tab: number) => setCurrentTab(new_tab % categories.length);
    const addCompany = (slug: string, name: string) => {
        setSelectedCompanies((prev) => ({ ...prev, [slug]: name }));

        if (Privacy.isAllowed(PRIVACY_ACTIONS.SAVE_WIZARD_ENTRIES)) saved_companies?.add(slug, name);
    };
    const removeCompany = (slug: string) => {
        setSelectedCompanies((prev) => {
            delete prev[slug];
            // Just returning `prev` itself does not trigger a rerender.
            return { ...prev };
        });

        if (Privacy.isAllowed(PRIVACY_ACTIONS.SAVE_WIZARD_ENTRIES)) saved_companies?.remove(slug);
    };

    const suggested_companies_url = `${window.BASE_URL}db/suggested-companies/${country}_wizard.json`;
    const { data: suggested_companies_data, error: suggested_companies_error } =
        useFetch<CompanyNameToSlug>(suggested_companies_url);

    useEffect(() => {
        if (suggested_companies_error) {
            rethrow(suggested_companies_error, 'Loading the suggested companies in the wizard failed.', {
                suggested_companies_url,
            });
            return;
        }
        if (!suggested_companies_data) return;

        if (Privacy.isAllowed(PRIVACY_ACTIONS.SAVE_WIZARD_ENTRIES)) {
            saved_companies?.length().then((length) => {
                if (length === 0 || !saved_companies?.getUserChanged()) {
                    if (Privacy.isAllowed(PRIVACY_ACTIONS.SAVE_WIZARD_ENTRIES)) {
                        saved_companies
                            ?.clearAll()
                            .then(() => saved_companies?.addMultiple(suggested_companies_data, false))
                            .then(() => setSelectedCompanies(suggested_companies_data));
                    }
                } else saved_companies.getAll().then((companies) => setSelectedCompanies(companies));
            });
        } else setSelectedCompanies(suggested_companies_data);
    }, [suggested_companies_url, suggested_companies_data, suggested_companies_error]);

    return (
        <IntlProvider scope="wizard" definition={window.I18N_DEFINITION}>
            <div id="wizard-tabs">
                {categories.map((category, i) => (
                    <button
                        onClick={() => changeTab(i)}
                        className={`button-unstyled wizard-tab${currentTab === i ? ' wizard-tab-current' : ''}`}>
                        {t(category, 'categories')}
                    </button>
                ))}
            </div>

            <div id="wizard" className="box">
                <div id="wizard-selector" className="col50">
                    {currentTab > 0 && (
                        <SearchBar
                            id="aa-search-input"
                            index="companies"
                            onAutocompleteSelected={(event, suggestion, dataset) =>
                                addCompany(suggestion.document.slug, suggestion.document.name)
                            }
                            debug={true}
                            placeholder={t('search-company', 'wizard', {
                                category: t(categories[currentTab], 'categories'),
                            })}
                            filters={
                                currentTab === categories.length - 1 ? [] : [`categories:${categories[currentTab]}`]
                            }
                            emptyTemplate={
                                isLastTab ? undefined : `<p style="margin-left: 10px;">${t('no-results', 'search')}</p>`
                            }
                        />
                    )}

                    <MarkupText
                        id={categories[currentTab]}
                        fields={{
                            suggested: t(
                                window.COUNTRIES_WITH_SUGGESTED_COMPANIES.includes(country)
                                    ? 'suggestions'
                                    : 'no-suggestions',
                                'wizard',
                                { country: t(country, 'countries') }
                            ),
                        }}
                    />

                    <div id="wizard-buttons">
                        <button
                            className={`button button-${isLastTab ? 'primary' : 'secondary'}`}
                            onClick={() => {
                                location.href = `${window.BASE_URL}/generator#!from=wizard${
                                    Privacy.isAllowed(PRIVACY_ACTIONS.SAVE_WIZARD_ENTRIES)
                                        ? ''
                                        : `&companies=${Object.keys(selectedCompanies).join(',')}`
                                }`;
                            }}
                            disabled={Object.values(selectedCompanies).length === 0}>
                            <Text id="finish" />
                        </button>
                        {!isLastTab && (
                            <button className="button button-primary" onClick={() => changeTab(currentTab + 1)}>
                                <Text id="next" />
                            </button>
                        )}
                    </div>
                    <div className="clearfix" />
                </div>

                <div id="wizard-selected" className="col50">
                    <h2 style="margin-top: 0;">
                        <Text id="selected-companies" />
                    </h2>

                    <div className="wizard-selected-list">
                        {Object.keys(selectedCompanies).length > 0
                            ? Object.keys(selectedCompanies)
                                  .sort()
                                  .map((slug) => (
                                      <p>
                                          <button
                                              className="button button-secondary button-small icon-trash"
                                              onClick={() => removeCompany(slug)}
                                              title={t('remove-company', 'wizard')}
                                          />
                                          <span>{selectedCompanies[slug]}</span>
                                      </p>
                                  ))
                            : t('none-selected', 'wizard')}
                    </div>
                </div>
                <div className="clearfix" />
            </div>
        </IntlProvider>
    );
};
