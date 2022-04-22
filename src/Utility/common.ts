// Adapted after: https://gist.github.com/mathewbyrne/1280286
export const slugify = (text: string) =>
    text
        ?.toString()
        .toLowerCase()
        .replace(/[^\w-]+/g, '-') // Replace all non-word chars with -
        .replace(/--+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, '') || // Trim - from end of text
    '';

export const fakeEvt = <T>(value: T) => ({ target: { value } });

// Adapted after: https://stackoverflow.com/a/8498629
export const domainWithoutTldFromUrl = (url?: string) =>
    url?.match(/^https?:\/\/([^#/:?]+)\.([^#./:?]+)(?:[#/:?]|$)/i)?.[1];

export const deepCopyObject = <T>(object: T): T => JSON.parse(JSON.stringify(object));

export const objFilter = <ValT>(obj: Record<string, ValT>, filter: (item: [string, ValT]) => boolean) =>
    Object.fromEntries(Object.entries<ValT>(obj).filter(filter));

// Adapted after: https://stackoverflow.com/a/15710692
export const hash = (s: string) =>
    btoa(
        s
            .split('')
            .reduce((acc, cur) => {
                acc = (acc << 5) - acc + cur.charCodeAt(0);
                return acc & acc;
            }, 0)
            .toString()
    );

export const almostUniqueId = (length = 9) => {
    const d = new Date();
    return (
        `${d.getUTCFullYear()}`.slice(-2) +
        `0${d.getUTCMonth() + 1}`.slice(-2) +
        `0${d.getUTCDate()}`.slice(-2) +
        Math.random()
            .toString(36)
            .substring(2, length + 2)
            .toUpperCase()
    );
};

export const renderMoney = (amount: number, currency = '') =>
    Number(amount).toLocaleString(window.LOCALE, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) +
    (currency ? ` ${currency}` : '');

export const parameters = (() => {
    const get_params = Object.fromEntries(new URLSearchParams(window.location.search).entries());

    // Inspired by: https://gist.github.com/miohtama/1570295
    const hashes = window.location.href.includes('#!')
        ? window.location.href.slice(window.location.href.indexOf('#!') + 2).split('&')
        : [];
    const fragment_params = hashes.reduce<Record<string, string>>((acc, cur) => {
        const [key, value] = cur.split('=');
        return { ...acc, [key]: decodeURIComponent(value) || '' };
    }, {});

    // In order not to break old URLs, we also use GET params if they exist but fragment params override GET params.
    return { ...get_params, ...fragment_params };
})();

/**
 * Determines the country we fallback to based on the user's language if we can't detect their country. Maps from
 * language to country.
 */
export const fallback_countries = { de: 'de', en: 'gb', fr: 'fr', pt: 'pt', es: 'es', hr: 'hr', nl: 'nl' } as const;
