import { Text } from 'preact-i18n';
import { InstantSearch, SearchBox, connectHits } from 'react-instantsearch-dom';
import { useGeneratorStore } from '../../store/generator';
import { SetPageFunction } from './App';
import { CompanyResult } from './CompanyResult';
import { instantSearchClient } from '../../Utility/search';
import { companyFromHit } from '../../Utility/companies';
import type { HitsProvided } from 'react-instantsearch-core';
import type { Company } from '../../types/company';

type CompanySearchPageProps = {
    setPage: SetPageFunction;
};

const Hits = connectHits(({ hits }: HitsProvided<Company>) => {
    const [appendToBatch, removeFromBatch] = useGeneratorStore((state) => [state.appendToBatch, state.removeFromBatch]);
    const batch = useGeneratorStore((state) => state.batch);

    if (hits.length < 1) return 'TODO';

    return hits.map((hit) => (
        <CompanyResult
            company={hit}
            actionElement={
                <input
                    checked={Object.keys(batch || {}).includes(hit.slug) || false}
                    type="checkbox"
                    className="form-element"
                    style="margin-top: -3px"
                />
            }
            onClick={() => {
                if (Object.keys(batch || {}).includes(hit.slug)) removeFromBatch(hit.slug);
                else appendToBatch(companyFromHit(hit));
            }}
        />
    ));
});

export const CompanySearchPage = (props: CompanySearchPageProps) => {
    const batch = useGeneratorStore((state) => state.batch);
    const batch_length = Object.keys(batch || {}).length || 0;

    return (
        <InstantSearch indexName="companies" searchClient={instantSearchClient()}>
            <SearchBox />

            {/* TODO: Display suggested companies in "no query" case. */}
            <Hits />
            <button
                className="button button-secondary button-small"
                disabled={batch_length < 1}
                onClick={() => props.setPage('review_selection')}>
                <Text id="review-n-companies" plural={batch_length} fields={{ count: batch_length }} />
            </button>

            {/* TODO: Pagination? */}
        </InstantSearch>
    );
};
