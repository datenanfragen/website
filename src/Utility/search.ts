import type { Country } from '../store/app';
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

export const countryFilter = (country: Country) => {
    const items = ['all', country];

    // Our records often simply specify Germany for companies that are also relevant for Austria and/or Switzerland.
    // Thus, we explicitly include results from Germany for these countries.
    //
    // Ideally, we would rank those additional results lower but as far as I am aware, Typesense doesn't support that.
    if (['at', 'ch'].includes(country)) items.push('de');

    return `relevant-countries:[${items.join(', ')}]`;
};

export const searchClient = new Client({
    ...serverConfig,
    connectionTimeoutSeconds: 2,
});

export const instantSearchClient = (searchParams?: Omit<Partial<SearchParams>, 'q'>) =>
    new TypesenseInstantSearchAdapter({
        server: serverConfig,

        additionalSearchParameters: { ...defaultSearchParams, ...searchParams },
    }).searchClient;
