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
                    checked={batch?.has(hit.slug) || false}
                    type="checkbox"
                    className="form-element"
                    style="margin-top: -3px"
                />
            }
            onClick={() => {
                if (batch?.has(hit.slug)) removeFromBatch(hit.slug);
                else appendToBatch(companyFromHit(hit));
            }}
        />
    ));
});

export const CompanySearchPage = (props: CompanySearchPageProps) => {
    const batch = useGeneratorStore((state) => state.batch);

    return (
        <InstantSearch indexName="companies" searchClient={instantSearchClient()}>
            <SearchBox />

            {/* TODO: Display suggested companies in "no query" case. */}
            <Hits />
            <button
                className="button button-secondary button-small"
                disabled={(batch?.size || 0) < 1}
                onClick={() => props.setPage('review_selection')}>
                <Text id="review-n-companies" plural={batch?.size || 0} fields={{ count: batch?.size || 0 }} />
            </button>

            {/* TODO: Pagination? */}
        </InstantSearch>
    );
};
