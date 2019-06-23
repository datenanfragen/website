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
