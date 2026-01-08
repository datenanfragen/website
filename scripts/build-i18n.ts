/**
 * @file This script builds our translation files for Hugo and JS because Hugo cannot do that itself. It replaces our
 * old custom Webpack i18n loader.
 *
 * It supports building for production (without any flags) or watch mode for development (with `--watch`). It is run by
 * `yarn dev` and `yarn build`.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, basename } from 'path';
import glob from 'glob';
import { getDirname } from 'cross-dirname';
import deepmerge from 'deepmerge';
import { watch as chokidar } from 'chokidar';

type TranslationScope = string;
type TranslationKey = string;
type TranslationFile = Record<TranslationScope, Record<TranslationKey, string>>;

const watch = process.argv.includes('--watch');
const quiet = process.argv.includes('--quiet');

const dirname = getDirname();

const inputDir = join(dirname, '..', 'src', 'i18n');
const hugoOutputDir = join(dirname, '..', 'i18n');
const jsOutputDir = join(dirname, '..', 'static', 'js');

const allTranslations = Object.fromEntries(
    glob
        .sync('*.json', { cwd: inputDir, absolute: true })
        .map((p) => [basename(p, '.json'), readFileSync(p, 'utf8')] as const)
        .map((r) => [r[0], JSON.parse(r[1]) as TranslationFile] as const)
);

// eslint-disable-next-line no-console
const log = (...messages: unknown[]) => !quiet && console.log('[i18n]', ...messages, `(${new Date().toISOString()})`);

/**
 * Emit the Hugo and JS translations for the given input translations.
 */
const emitTranslations = (translations: Record<string, TranslationFile>) => {
    const en = allTranslations['en'];

    // Ensure output directories exist.
    mkdirSync(hugoOutputDir, { recursive: true });
    mkdirSync(jsOutputDir, { recursive: true });

    // eslint-disable-next-line prefer-const
    for (let [language, data] of Object.entries(translations)) {
        // Since we support languages where we cannot guarantee that all strings are always translated, we need to
        // fallback to English for untranslated strings.
        data = deepmerge(en, data);

        // Macros allow us set set common strings (like the site name) once in the translations, and then use that value
        // in many places. Macros are used by inserting `${macro_name}` somewhere in a translation, where `macro_name`
        // is the key of the translation under the `macros` context that sets the macro's value.
        let json = JSON.stringify(data);
        for (const [name, value] of Object.entries(data.macros)) {
            json = json.replace(new RegExp(`\\\${${name}}`, 'g'), value);
        }
        data = JSON.parse(json);

        // Emit the translation files for Hugo.
        if (data.hugo) {
            const hugoData = data.hugo;

            // To avoid translating the same strings multiple times, we can import other translations into Hugo here.
            const importKeys = {
                generator: [
                    'access-request-statement',
                    'erasure-request-statement',
                    'rectification-request-statement',
                    'objection-request-statement',
                ],
            } as const;

            for (const scope of Object.keys(importKeys) as (keyof typeof importKeys)[]) {
                const keys = importKeys[scope].filter((key) => data[scope][key] !== undefined);

                for (const key of keys) hugoData[`imported--${scope}-${key}`] = data[scope][key];
            }

            writeFileSync(join(hugoOutputDir, `${language}.json`), JSON.stringify(hugoData, null, 4));
        }

        // The JS translation files don't need to include the translations only used by Hugo (#620).
        delete data.hugo;
        // Same for the `requests` scope which is only used to generate `I18N_DEFINITION_REQUESTS` (#871).
        delete data.requests;

        // Emit the translation files to be included in the HTML.
        writeFileSync(
            join(jsOutputDir, `translations-${language}.gen.js`),
            `window.I18N_DEFINITION = ${JSON.stringify(data)}`
        );
        log('Emitted translations for:', language);
    }
};

/**
 * Emit the special requests translations file to be included in the HTML.
 */
const emitRequestsTranslations = () => {
    const requestsTranslations = Object.entries(allTranslations).reduce(
        (acc, [language, translations]) => ({ ...acc, [language]: translations.requests || {} }),
        {}
    );

    writeFileSync(
        join(jsOutputDir, 'translations-requests.gen.js'),
        `window.I18N_DEFINITION_REQUESTS = ${JSON.stringify(requestsTranslations)}`
    );
    log('Emitted requests translations.');
};

if (watch) {
    log('Watching translation files for changes …');

    const watcher = chokidar(inputDir, {
        ignored: (path, stats) => !!stats?.isFile() && !path.endsWith('.json'),
        ignoreInitial: false,
        depth: 0,
    });

    const handler = (path: string) => {
        try {
            const language = basename(path, '.json');
            const translations =
                // As English is used as the fallback, changes to the English translations can affect all other
                // languages as well.
                language === 'en'
                    ? allTranslations
                    : { [language]: JSON.parse(readFileSync(path, 'utf8')) as TranslationFile };
            emitTranslations(translations);
            emitRequestsTranslations();
        } catch (err) {
            log('Error while rebuilding translations:', err);
        }
    };
    watcher.on('add', handler);
    watcher.on('change', handler);

    process.on('SIGINT', () => {
        watcher.close();
        log('Stopped watching translation files.');
        process.exit();
    });
} else {
    emitTranslations(allTranslations);
    emitRequestsTranslations();
}
