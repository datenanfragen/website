/**
 * Converts values from millimeters to PDF points.
 *
 * @param {number} mm
 *
 * @return {number}
 */
export function mm2pt(mm) {
    return (72.0 / 25.4) * mm;
}

/**
 * Generates a formatted address string.
 *
 * @param {string[]|string} address An array of the lines of the address or an already formatted string address.
 * @param {string} [delimiter='\n']
 * @return {string} The formatted address.
 */
export function formatAddress(address, delimiter = '\n') {
    return address ? (Array.isArray(address) ? address.filter(item => item).join(delimiter) : address) : '';
}

/**
 * Generates a random reference for correspondence in the given year.
 *
 * @param {Date} date
 * @return {string}
 */
export function generateReference(date) {
    return (
        date.getFullYear() +
        '-' +
        Math.random()
            .toString(36)
            .substring(2, 9)
            .toUpperCase()
    );
}

/**
 * Strip tags (<tag>) from the given text.
 *
 * @param {string} text
 * @returns {string} The text without tags.
 */
export function stripTags(text) {
    return text.replace(/<.+?>/gmu, '');
}
