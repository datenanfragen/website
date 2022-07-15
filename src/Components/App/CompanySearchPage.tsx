import { IntlProvider, MarkupText, Text } from 'preact-i18n';
import { InstantSearch, SearchBox, connectHits, connectStateResults } from 'react-instantsearch-dom';
import { useGeneratorStore } from '../../store/generator';
import { SetPageFunction } from './App';
import { CompanyResult } from './CompanyResult';
import { countryFilter, instantSearchClient } from '../../Utility/search';
import { companyFromHit } from '../../Utility/companies';
import { rethrow, ErrorException } from '../../Utility/errors';
import type { HitsProvided, StateResultsProvided, Hit } from 'react-instantsearch-core';
import { useFetch } from '../../hooks/useFetch';
import { useModal } from '../Modal';
import type { Company, CompanyPack } from '../../types/company';
import { ComponentChildren } from 'preact';
import t from '../../Utility/i18n';
import { useState } from 'preact/hooks';
import { useAppStore } from '../../store/app';

// TODO: Respect privacy controls!

type CompanySearchPageProps = {
    setPage: SetPageFunction;
};

const Hits = connectHits(({ hits }: HitsProvided<Company>) => {
    const [appendToBatch, removeFromBatch] = useGeneratorStore((state) => [state.appendToBatch, state.removeFromBatch]);
    const batch = useGeneratorStore((state) => state.batch);
    const [focussedOption, setFocussedOption] = useState(-1);

    const toggleHitInBatch = (hit: Hit<Company>) => {
        if (Object.keys(batch || {}).includes(hit.slug)) removeFromBatch(hit.slug);
        else appendToBatch(companyFromHit(hit));
    };

    return (
        <ul
            tabIndex={0}
            role="listbox"
            aria-multiselectable={true}
            className="company-result-list"
            aria-label={t('search-results', 'search')}
            aria-activedescendant={`company-result-option-${focussedOption}`}
            onFocus={() => setFocussedOption(0)}
            onBlur={() => setFocussedOption(-1)}
            onKeyDown={(e) => {
                // Keys as per https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/listbox_role
                switch (e.code) {
                    case 'ArrowDown':
                        setFocussedOption(focussedOption + 1 < hits.length ? focussedOption + 1 : hits.length - 1);
                        break;
                    case 'ArrowUp':
                        setFocussedOption(focussedOption - 1 >= 0 ? focussedOption - 1 : 0);
                        break;
                    case 'Home':
                        setFocussedOption(0);
                        break;
                    case 'End':
                        setFocussedOption(hits.length - 1);
                        break;
                    case 'Space':
                        if (focussedOption >= 0 && focussedOption < hits.length) toggleHitInBatch(hits[focussedOption]);
                        break;
                }
            }}>
            {hits.map((hit, index) => (
                <CompanyResult
                    id={`company-result-option-${index}`}
                    focussed={index === focussedOption}
                    company={hit}
                    active={Object.keys(batch || {}).includes(hit.slug) || false}
                    onClick={() => toggleHitInBatch(hit)}
                />
            ))}
        </ul>
    );
});

const Results = connectStateResults(
    ({
        searchState,
        searchResults,
        children,
    }: Partial<StateResultsProvided<Company>> & { children?: ComponentChildren; batch_length: number }) => {
        const country = useAppStore((state) => state.country);
        const companyPacksUrl = `${window.BASE_URL}db/company-packs/${country}.json`;
        const { data: companyPacks, error: companyPacksError } = useFetch<CompanyPack[]>(companyPacksUrl);
        if (companyPacksError)
            rethrow(ErrorException.fromError(companyPacksError), 'Loading the company packs failed.', {
                suggested_companies_url: companyPacksUrl,
            });

        return searchState?.query ? (
            searchResults && searchResults.nbHits > 0 ? (
                children
            ) : (
                <IntlProvider scope="search" definition={window.I18N_DEFINITION}>
                    <p style="margin-left: 10px;">
                        <Text id="no-results" />
                        <br />
                        <a
                            href={`${window.BASE_URL}suggest#!type=new&for=cdb&name=${searchState.query}`}
                            target="_blank"
                            rel="noreferrer">
                            <Text id="suggest-a-company" />
                        </a>
                    </p>
                </IntlProvider>
            )
        ) : (
            <>
                <h3 style="margin-top: 30px;">
                    <Text id="empty-query-suggested-companies" />
                </h3>
                <div className="company-suggestion-container">
                    {companyPacks?.map((p) => (
                        <CompanySuggestionsPack pack={p} />
                    ))}
                </div>
            </>
        );
    }
);

type CompanySuggestionsPackProps = { pack: CompanyPack };

const CompanySuggestionsPack = ({ pack }: CompanySuggestionsPackProps) => {
    const description = t(`${pack.slug as 'address-brokers'}-description`, 'company-packs');

    const [batch, appendToBatchBySlug] = useGeneratorStore((state) => [state.batch, state.appendToBatchBySlug]);

    const [selectedCompanies, setSelectedCompanies] = useState(
        pack.type === 'choose' ? [] : pack.companies.map((c) => c.slug)
    );

    const [Modal, showModal, hideModal] = useModal(
        <>
            <h1>{t(`${pack.slug as 'address-brokers'}-title`, 'company-packs')}</h1>

            {description && <p>{description}</p>}

            <ul className="unstyled-list">
                {pack.companies.map((c) => {
                    return (
                        <li>
                            <input
                                type="checkbox"
                                className="form-element"
                                checked={selectedCompanies.includes(c.slug)}
                                onChange={(e) =>
                                    setSelectedCompanies(
                                        e.currentTarget.checked
                                            ? [...selectedCompanies, c.slug]
                                            : selectedCompanies.filter((s) => s !== c.slug)
                                    )
                                }
                                id={`company-pack-choose-${c.slug}`}
                            />
                            <label for={`company-pack-choose-${c.slug}`}>{c.name}</label>
                        </li>
                    );
                })}
            </ul>
        </>,
        {
            positiveText: t(
                'add-n-companies',
                'generator',
                { n: `${selectedCompanies.length}` },
                selectedCompanies.length
            ),
            onPositiveFeedback: () =>
                Promise.all(
                    selectedCompanies
                        .filter((slug) => !Object.keys(batch || {}).includes(slug))
                        .map((slug) => appendToBatchBySlug(slug))
                ).then(hideModal),
        }
    );

    return (
        <IntlProvider scope="company-packs" definition={window.I18N_DEFINITION}>
            <Modal />

            <section className="company-suggestion-pack">
                <h1>{t(`${pack.slug as 'address-brokers'}-title`, 'company-packs')}</h1>
                {pack.type === 'add-all' && (
                    <span className="icon icon-star color-yellow-600" title={t('add-all-star', 'company-packs')} />
                )}
                <p>
                    {pack.companies
                        .slice(0, 7)
                        .map((c) => c.name)
                        .join(', ')}
                    {pack.companies.length > 7 && (
                        <em>
                            <Text id="and-n-more" fields={{ n: pack.companies.length - 7 }} />
                        </em>
                    )}
                </p>
                <button className="company-suggestion-pack-cta button" onClick={showModal}>
                    {pack.type === 'add-all' ? (
                        <Text id="add-companies-button" />
                    ) : (
                        <Text id="choose-companies-button" />
                    )}
                </button>
            </section>
        </IntlProvider>
    );
};

export const CompanySearchPage = (props: CompanySearchPageProps) => {
    const batch = useGeneratorStore((state) => state.batch);
    const batch_length = Object.keys(batch || {}).length || 0;
    const country = useAppStore((state) => state.country);

    return (
        <InstantSearch
            indexName="companies"
            searchClient={instantSearchClient({ filter_by: country === 'all' ? '' : countryFilter(country) })}>
            <SearchBox translations={{ placeholder: t('select-company', 'cdb') }} />

            <Results>
                <Hits />
            </Results>

            <div className="app-cta-container">
                <button
                    className="button button-primary"
                    disabled={batch_length < 1}
                    onClick={() => props.setPage('review_selection')}>
                    <MarkupText id="review-n-companies" plural={batch_length} fields={{ count: batch_length }} />
                    <span className="icon icon-arrow-right padded-icon-right" />
                </button>
            </div>

            {/* TODO: Pagination? */}
        </InstantSearch>
    );
};
