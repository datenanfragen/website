import type { I18nLanguage } from '../types/globals';
import type { Country } from '../store/app';

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

// Adapted after: https://stackoverflow.com/a/8498629
export const domainWithoutTldFromUrl = (url?: string) =>
    url?.match(/^https?:\/\/([^#/:?]+)\.([^#./:?]+)(?:[#/:?]|$)/i)?.[1];

export const deepCopyObject = <T>(object: T): T => JSON.parse(JSON.stringify(object));

export const objFilter = <KeyT extends string | number | symbol, ValT>(
    obj: Record<KeyT, ValT>,
    filter: (item: [string, ValT]) => boolean
) => Object.fromEntries(Object.entries<ValT>(obj).filter(filter)) as Record<KeyT, ValT>;

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

export const renderMoney = (amount: number, locale: I18nLanguage, currency = '') =>
    Number(amount || 0).toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) +
    (currency ? ` ${currency}` : '');

export const parameters = () => {
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
};

export const parseBcp47Tag = (bcp47_tag: string) => {
    // Taken from: https://github.com/gagle/node-bcp47/blob/a74d98d43d16b0094b2f4ea8e7a58f4b5830c15b/lib/index.js#L4
    const bcp47_regex =
        /^(?:(en-gb-oed|i-ami|i-bnn|i-default|i-enochian|i-hak|i-klingon|i-lux|i-mingo|i-navajo|i-pwn|i-tao|i-tay|i-tsu|sgn-be-fr|sgn-be-nl|sgn-ch-de)|(art-lojban|cel-gaulish|no-bok|no-nyn|zh-guoyu|zh-hakka|zh-min|zh-min-nan|zh-xiang))$|^((?:[a-z]{2,3}(?:(?:-[a-z]{3}){1,3})?)|[a-z]{4}|[a-z]{5,8})(?:-([a-z]{4}))?(?:-([a-z]{2}|\d{3}))?((?:-(?:[\da-z]{5,8}|\d[\da-z]{3}))*)?((?:-[\da-wyz](?:-[\da-z]{2,8})+)*)?(-x(?:-[\da-z]{1,8})+)?$|^(x(?:-[\da-z]{1,8})+)$/i;
    const res = bcp47_regex.exec(bcp47_tag);
    return { language: res?.[3]?.toLowerCase(), country: res?.[5]?.toLowerCase() };
};

/**
 * Determines the country we fallback to based on the user's language if we can't detect their country. Maps from
 * language to country.
 */
export const fallback_countries = { de: 'de', en: 'gb', fr: 'fr', pt: 'pt', es: 'es', hr: 'hr', nl: 'nl' } as const;

export const isSupportedCountry = (country: string): country is Country =>
    window.SUPPORTED_COUNTRIES.includes(country as Country);
