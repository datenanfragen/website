// Taken from: https://gist.github.com/mathewbyrne/1280286
export function slugify(text) {
    if (!text) return '';

    return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w-]+/g, '') // Remove all non-word chars
        .replace(/--+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, ''); // Trim - from end of text
}

// Adapted after: https://stackoverflow.com/a/8498629
export function domainFromUrl(url) {
    if (!url) return;

    let matches = url.match(/^https?:\/\/([^#/:?]+)(?:[#/:?]|$)/i);
    return matches && matches[1];
}

// This is hideous but the only way to deep copy objects or arrays…
export function deepCopyObject(object) {
    return JSON.parse(JSON.stringify(object));
}

// Adapted after: https://stackoverflow.com/a/15710692
export function hash(s) {
    return window.btoa(
        s.split('').reduce(function(a, b) {
            a = (a << 5) - a + b.charCodeAt(0);
            return a & a;
        }, 0)
    );
}

export const PARAMETERS = (() => {
    // `URLSearchParams` only offers an iterator to get all values. We can deconstruct that using `Array.from()` but
    // then we get a structure like this: `[ ['key1', 'val1'], ['key2', 'val2'] ]` which we need to transform to an
    // object.
    const GET_PARAMETERS = Array.from(new URLSearchParams(window.location.search).entries()).reduce((acc, cur) => {
        acc[cur[0]] = cur[1];
        return acc;
    }, {});

    // Inspired by: https://gist.github.com/miohtama/1570295
    const HASHES = window.location.href.includes('#!')
        ? window.location.href.slice(window.location.href.indexOf('#!') + 2).split('&')
        : [];
    const FRAGMENT_PARAMETERS = HASHES.reduce((acc, cur) => {
        let hash = cur.split('=');
        acc[hash[0]] = hash.length > 1 ? decodeURIComponent(hash[1]) : '';
        return acc;
    }, {});

    // In order not to break old URLs, we also use GET params if they exist but fragment params override GET params.
    return Object.assign(GET_PARAMETERS, FRAGMENT_PARAMETERS);
})();
