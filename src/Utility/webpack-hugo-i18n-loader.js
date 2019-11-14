const path = require('path');
const deepmerge = require('deepmerge');

module.exports = function(content) {
    let data = JSON.parse(content);

    // Since we now support languages where we cannot guarantee that all strings are always translated, we now need to
    // fallback to English for untranslated strings.
    const en = require('../i18n/en.json');
    data = deepmerge(en, data);

    if (data.hugo) {
        // Hugo always requires setting the translation as an object with at least the `other` key set even if there are
        // no other plural forms. This makes for a very ugly translation file. As we are transforming the input data
        // anyway, we might as well also allow specifying translations simply as a string and then unroll them here for
        // Hugo.
        const hugo_data = Object.keys(data.hugo).reduce(
            (acc, key) => ({
                ...acc,
                [key]: typeof data.hugo[key] === 'string' ? { other: data.hugo[key] } : data.hugo[key]
            }),
            {}
        );
        this.emitFile('../i18n/' + path.basename(this.resource), JSON.stringify(hugo_data));
    }

    return JSON.stringify(data, null, 4);
};
