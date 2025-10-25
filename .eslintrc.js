const path = require('path');

module.exports = {
    parser: '@typescript-eslint/parser',
    env: {
        browser: true,
        es6: true,
        amd: true,
        worker: true,
        node: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
        'plugin:jsx-a11y/recommended',
        'plugin:cypress/recommended',
        'plugin:eslint-comments/recommended',
        'plugin:prettier/recommended',
        'preact',
    ],
    parserOptions: {
        requireConfigFile: false,
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    plugins: [
        'react',
        '@typescript-eslint',
        'preact-i18n',
        'import',
        'babel',
        'html',
        'optimize-regex',
        'json',
        'jsx-a11y',
    ],
    rules: {
        'no-unused-vars': 'off',
        'no-empty': ['error', { allowEmptyCatch: true }],
        // Re-enable the `no-console` rule which gets disabled by the Node env.
        'no-console': 'error',
        'no-lonely-if': 'off',

        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-unused-vars': ['error'],
        '@typescript-eslint/no-empty-function': 'off',
        // TODO: Re-enable this once we've completely migrated to TypeScript.
        '@typescript-eslint/no-var-requires': 'off',

        'react/no-did-update-set-state': 'warn',
        'react/self-closing-comp': 'warn',
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
        // TODO: Enable this once we're done migrating to functional components.
        'react/prefer-stateless-function': 'off',

        'optimize-regex/optimize-regex': 'warn',
        'prefer-template': 'off',
        'jest/expect-expect': 'off',
        'jest/valid-expect-in-promise': 'off',
        'jest/valid-expect': 'off',
        'jest/valid-title': 'off',
        'react/prop-types': 'off',
    },
    overrides: [
        {
            files: ['*.ts', '*.tsx'],
            rules: {
                // https://github.com/typescript-eslint/typescript-eslint/blob/a85254817ae4914333e7236a5b0f9b6844ce8791/docs/linting/TROUBLESHOOTING.md#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
                'no-undef': 'off',
            },
        },
    ],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
        BASE_URL: 'readonly',
        LOCALE: 'readonly',
        SUPPORTED_LANGUAGES: 'readonly',
        SUPPORTED_COUNTRIES: 'readonly',

        // defined in `src/general.js`
        I18N_DEFINITION: 'readonly',
        I18N_DEFINITION_REQUESTS: 'readonly',
        PARAMETERS: 'readonly',

        // defined in `scripts.html` (only for entry points `app.tsx` and `generator.tsx`)
        PDF_WORKER_URL: 'readonly',
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
                {
                    name: 'cs',
                    path: 'src/i18n/cs.json',
                },
            ],
        },
        // The Preact config includes Jest rules but we don't have Jest installed. This stops them from complaining.
        jest: { version: 'n/a' },
        'import/resolver': { webpack: { config: path.resolve(__dirname, 'webpack.common.js') } },
    },
};
