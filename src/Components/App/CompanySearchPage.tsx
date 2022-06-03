import { IntlProvider, MarkupText, Text } from 'preact-i18n';
import { InstantSearch, SearchBox, connectHits, connectStateResults } from 'react-instantsearch-dom';
import { useGeneratorStore } from '../../store/generator';
import { SetPageFunction } from './App';
import { CompanyResult } from './CompanyResult';
import { instantSearchClient } from '../../Utility/search';
import { companyFromHit } from '../../Utility/companies';
import type { HitsProvided, StateResultsProvided, Hit } from 'react-instantsearch-core';
import type { Company } from '../../types/company';
import { ComponentChildren } from 'preact';
import t from '../../Utility/i18n';
import { useState } from 'preact/hooks';

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
            onFocus={() => {
                setFocussedOption(0);
            }}
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
    }: Partial<StateResultsProvided<Company>> & { children?: ComponentChildren }) =>
        searchState?.query ? (
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
                <h3>
                    <Text id="empty-query-suggested-companies" />
                </h3>
            </>
        )
);

export const CompanySearchPage = (props: CompanySearchPageProps) => {
    const batch = useGeneratorStore((state) => state.batch);
    const batch_length = Object.keys(batch || {}).length || 0;

    return (
        <InstantSearch indexName="companies" searchClient={instantSearchClient()}>
            <SearchBox />

            {/* TODO: Display suggested companies in "no query" case. */}
            <Results>
                <Hits />
            </Results>

            <button
                id="review-company-button"
                className="button button-secondary"
                disabled={batch_length < 1}
                onClick={() => props.setPage('review_selection')}>
                <MarkupText id="review-n-companies" plural={batch_length} fields={{ count: batch_length }} />
            </button>

            {/* TODO: Pagination? */}
        </InstantSearch>
    );
};
