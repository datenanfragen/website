import * as Typesense from 'typesense';

export const searchClient = new Typesense.Client({
    masterNode: {
        host: 'search.datenanfragen.de',
        port: '443',
        protocol: 'https',
        apiKey: '',
    },
    timeoutSeconds: 2,
});
