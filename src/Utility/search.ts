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
