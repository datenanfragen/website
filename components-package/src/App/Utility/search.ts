import MiniSearch, { Options as MiniSearchOptions } from 'minisearch';
import type { SearchParams } from 'typesense/lib/Typesense/Documents';
import { defaultSearchParams, SearchClient, Query } from '../../../../src/Utility/search';
import { t_a, WarningException } from '../../index';

export type OfflineData = {
    date: string;
    'format-version': number;
    'company-search': {
        options: MiniSearchOptions;
        index: string;
    };
};
export const miniSearchIndexFromOfflineData = (offlineData: OfflineData) => {
    if (offlineData['format-version'] !== 1)
        throw new WarningException(
            'Unsupported offline dump format.',
            { version: offlineData['format-version'], date: offlineData.date },
            t_a('error-unsupported-offline-data', 'app')
        );
    return MiniSearch.loadJSON(offlineData['company-search'].index, offlineData['company-search'].options);
};
export const miniSearchClient = (
    miniSearch: MiniSearch,
    /**
     * At the moment, `filter_by` only supports `<field>:<value>` and `<field>:[<value1>, <value2>, …]`, and only a
     * single filter condition.
     */
    searchParams: Pick<SearchParams, 'filter_by'>
): SearchClient => {
    return {
        search: <TObject>(queries: Query[]) =>
            Promise.resolve({
                results: queries.map((q) => {
                    const res = miniSearch
                        .search(q.params.query, {
                            filter: (res) => {
                                if (!searchParams.filter_by) return true;
                                const [field, valueToCheckFor] = searchParams.filter_by.split(':');
                                if (!field || !valueToCheckFor) return true;

                                if (valueToCheckFor.startsWith('[') && valueToCheckFor.endsWith(']')) {
                                    const valuesToCheckFor = valueToCheckFor
                                        .slice(1, -1)
                                        .split(',')
                                        .map((v) => v.trim());
                                    return valuesToCheckFor.some((v) =>
                                        Array.isArray(res[field]) ? res[field].includes(v) : res[field] === v
                                    );
                                }
                                return res[field] === valueToCheckFor;
                            },
                        })
                        .slice(0, defaultSearchParams.per_page);
                    return {
                        hits: res.map((h) => ({
                            ...(h as unknown as TObject),
                            objectID: h.id,
                            // TODO: We could fake our own highlighing here, see:
                            // https://github.com/lucaong/minisearch/issues/37#issuecomment-611524092
                        })),
                        page: 0,
                        nbPages: 1,
                        hitsPerPage: defaultSearchParams.per_page, // TODO
                        nbHits: res.length,
                        processingTimeMs: 0,
                        exhaustiveNbHits: true, // "Whether the nbHits is exhaustive (true) or approximate (false)."
                        query: q.params.query,
                        params: '', // "A url-encoded string of all search parameters."
                        facets: {},
                        facets_stats: {},
                    };
                }),
            }),
    };
};
