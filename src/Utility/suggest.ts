export const submitUrl =
    process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000/suggest'
        : 'https://backend.datenanfragen.de/suggest';
