const path = require('path');
const fs = require('fs');
const deepmerge = require('deepmerge');

module.exports = function (content) {
    let data = JSON.parse(content);

    // Since we now support languages where we cannot guarantee that all strings are always translated, we now need to
    // fallback to English for untranslated strings.
    const en = require('../i18n/en.json');
    data = deepmerge(en, data);

    // Emit the translation files for Hugo.
    if (data.hugo) {
        // Hugo always requires setting the translation as an object with at least the `other` key set even if there are
        // no other plural forms. This makes for a very ugly translation file. As we are transforming the input data
        // anyway, we might as well also allow specifying translations simply as a string and then unroll them here for
        // Hugo.
        const hugo_data = Object.keys(data.hugo).reduce(
            (acc, key) => ({
                ...acc,
                [key]: typeof data.hugo[key] === 'string' ? { other: data.hugo[key] } : data.hugo[key],
            }),
            {}
        );
        this.emitFile(path.join('..', 'i18n', path.basename(this.resource)), JSON.stringify(hugo_data));
    }

    // The JS translation files don't need to include the translations only used by Hugo (#620).
    delete data.hugo;

    // Emit the translation files to be included in the HTML.
    this.emitFile(
        path.join('js', `translations-${path.basename(this.resource, '.json')}.gen.js`),
        `window.I18N_DEFINITION = ${JSON.stringify(data)}`
    );

    // Emit the special requests translations file to be included in the HTML.
    // This isn't exactly an elegant approach since Webpack loaders are only supposed to operate on a single file, not
    // combine multiple ones. But since @zner0L will soon tear all this down, I didn't want to optimize it too much.
    const requests_translation_path = path.join(this.rootContext, 'static', 'js', 'translations-requests.js');
    if (!fs.existsSync(requests_translation_path)) {
        const languages = fs
            .readdirSync(path.join(this.rootContext, 'src', 'i18n'))
            .filter((f) => f.endsWith('.json'))
            .map((f) => path.basename(f, '.json'));
        const requests_translations = languages.reduce((acc, cur) => {
            const translations = require(`../i18n/${cur}.json`);
            if (translations.requests) return { ...acc, [cur]: translations.requests };
            return acc;
        }, {});
        this.emitFile(
            path.join('js', `translations-requests.gen.js`),
            `window.I18N_DEFINITION_REQUESTS = ${JSON.stringify(requests_translations)}`
        );
    }

    return JSON.stringify(data, null, 4);
};
