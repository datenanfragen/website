import { Client } from 'typesense';

export const searchClient = new Client({
    nodes: [
        {
            host: 'search.datenanfragen.de',
            port: 443,
            protocol: 'https',
        },
    ],
    apiKey: '',
    connectionTimeoutSeconds: 2,
});

export const defaultSearchParams: any = {
    query_by: 'name, runs, web, slug, address, comments',
    sort_by: '_text_match:desc,sort-index:asc',
    num_typos: 4,
    per_page: 5,
    snippet_threshold: 5,
};
