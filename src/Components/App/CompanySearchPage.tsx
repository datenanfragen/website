import { Text } from 'preact-i18n';
import { InstantSearch, SearchBox, connectHits, Highlight } from 'react-instantsearch-dom';
import { useGeneratorStore } from '../../store/generator';
import { SetPageFunction } from './App';
import { instantSearchClient } from '../../Utility/search';
import t from '../../Utility/i18n';
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
        // TODO!
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <div
            className="box box-thin"
            style="margin-bottom: 10px;"
            onClick={() => {
                if (batch?.includes(hit.slug)) removeFromBatch(hit.slug);
                else appendToBatch(hit.slug);
            }}>
            <input
                checked={batch?.includes(hit.slug)}
                type="checkbox"
                className="form-element"
                style="margin-top: -3px"
            />
            <h4>
                <Highlight attribute="name" hit={hit} />

                {hit.quality === 'tested' ? (
                    <>
                        &nbsp;
                        <span className="icon icon-check-badge color-green-800" title={t('quality-tested', 'search')} />
                    </>
                ) : (
                    hit.quality !== 'verified' && (
                        <>
                            &nbsp;
                            <span
                                className="icon icon-question-badge color-orange-800"
                                title={t('quality-unverified', 'search')}
                            />
                        </>
                    )
                )}
            </h4>

            {hit.runs && hit.runs.length > 0 && (
                <>
                    <span>
                        {t('also-runs', 'search')}
                        <Highlight attribute="runs" hit={hit} />
                    </span>
                    <br />
                </>
            )}

            {hit.categories && hit.categories.length > 0 && (
                <>
                    <span>
                        {t('categories', 'search')}
                        <Highlight attribute="categories" hit={hit} />
                    </span>
                    <br />
                </>
            )}
        </div>
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
                disabled={(batch?.length || 0) < 1}
                onClick={() => props.setPage('review_selection')}>
                <Text id="review-n-companies" plural={batch?.length || 0} fields={{ count: batch?.length || 0 }} />
            </button>

            {/* TODO: Pagination? */}
        </InstantSearch>
    );
};
