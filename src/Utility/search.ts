import { Client } from 'typesense';
import TypesenseInstantSearchAdapter, { SearchParametersWithQueryBy } from 'typesense-instantsearch-adapter';
import type { ConfigurationOptions } from 'typesense/lib/Typesense/Configuration';
import type { SearchParams } from 'typesense/lib/Typesense/Documents';

const serverConfig: ConfigurationOptions = {
    apiKey: '',
    nodes: [
        {
            host: 'search.datenanfragen.de',
            port: 443,
            protocol: 'https',
        },
    ],
};

export const defaultSearchParams: SearchParametersWithQueryBy = {
    query_by: 'name, runs, web, slug, address, comments',
    sort_by: '_text_match:desc,sort-index:asc',
    num_typos: 4,
    per_page: 5,
    snippet_threshold: 5,
};

export const searchClient = new Client({
    ...serverConfig,
    connectionTimeoutSeconds: 2,
});

export const instantSearchClient = (searchParams?: Omit<SearchParams, 'q'>) =>
    new TypesenseInstantSearchAdapter({
        server: serverConfig,

        additionalSearchParameters: { ...defaultSearchParams, ...searchParams },
    }).searchClient;
