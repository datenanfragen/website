const path = require('path');

module.exports = {
    parser: 'babel-eslint',
    env: {
        browser: true,
        es6: true,
        amd: true,
        worker: true,
        node: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:jsx-a11y/recommended',
        'plugin:cypress/recommended',
    ],
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    plugins: ['react', 'preact-i18n', 'import', 'babel', 'html', 'optimize-regex', 'json', 'jsx-a11y'],
    rules: {
        'no-unused-vars': ['warn', { args: 'none', caughtErrors: 'none' }],
        'no-empty': ['error', { allowEmptyCatch: true }],
        // Re-enable the `no-console` rule which gets disabled by the Node env.
        'no-console': 'error',

        'react/no-did-update-set-state': 'warn',

        'react/jsx-no-bind': [
            'error',
            {
                allowArrowFunctions: true,
                allowBind: false,
                ignoreRefs: true,
            },
        ],
        'react/react-in-jsx-scope': 'off',
        'react/jsx-key': 'off',
        'react/no-unknown-property': ['error', { ignore: ['for'] }],

        'optimize-regex/optimize-regex': 'warn',
    },
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
        // defined in `layouts/partials/scripts.html`
        globals: 'readonly',
        BASE_URL: 'readonly',
        LOCALE: 'readonly',
        SUPPORTED_LANGUAGES: 'readonly',
        SUPPORTED_COUNTRIES: 'readonly',
        COUNTRIES_WITH_SUGGESTED_COMPANIES: 'readonly',

        // defined in `src/general.js`
        I18N_DEFINITION: 'readonly',
        I18N_DEFINITION_REQUESTS: 'readonly',

        // defined in `webpack.common.js`
        CODE_VERSION: 'readonly',
    },
    settings: {
        react: {
            pragma: 'h',
            version: 'latest',
        },
        'preact-i18n': {
            languageFiles: [
                {
                    name: 'en',
                    path: 'src/i18n/en.json',
                },
                {
                    name: 'de',
                    path: 'src/i18n/de.json',
                },
                {
                    name: 'fr',
                    path: 'src/i18n/fr.json',
                },
                {
                    name: 'pt',
                    path: 'src/i18n/pt.json',
                },
                {
                    name: 'es',
                    path: 'src/i18n/es.json',
                },
                {
                    name: 'hr',
                    path: 'src/i18n/hr.json',
                },
                {
                    name: 'nl',
                    path: 'src/i18n/nl.json',
                },
            ],
        },
        'import/resolver': { webpack: { config: path.resolve(__dirname, 'webpack.common.js') } },
    },
};
