const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: {
        'error-handler': './src/error-handler.js',
        general: './src/general.tsx',
        home: './src/home.ts',
        generator: './src/generator.tsx',
        app: './src/app.tsx',
        'company-list': './src/company-list.js',
        'my-requests': './src/my-requests.tsx',
        'privacy-controls': './src/privacy-controls.tsx',
        'suggest-edit': './src/suggest-edit.js',
        'id-data-controls': './src/id-data-controls.tsx',
        'sva-finder': './src/Components/SvaFinder.tsx',
        'act-widget': './src/Components/ActWidget.tsx',
        'donation-widget': './src/Components/DonationWidget.tsx',
        'test-interface': './src/test-interface.tsx',
        // We need to define a dummy entrypoint that requires all our translation files, otherwise Webpack will not
        // process them.
        'translations-dummy': [
            './src/i18n/de.json',
            './src/i18n/en.json',
            './src/i18n/fr.json',
            './src/i18n/pt.json',
            './src/i18n/es.json',
            './src/i18n/hr.json',
            './src/i18n/nl.json',
        ],
    },
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                commons: {
                    name: 'commons',
                    chunks: 'all',
                    test: (module, chunks) => {
                        // these are always included so others can reuse code from them, i.e. preact
                        const splitForEntries = ['general', 'error-handler'];
                        return chunks.filter((c) => splitForEntries.includes(c.name)).length > 0;
                    },
                    minChunks: 2,
                    priority: -10,
                },
                vendors: {
                    name: 'vendors',
                    chunks: 'all',
                    test: /[/\\]node_modules[/\\](?!@babel)/,
                    // autocomplete.js, localforage, typesense
                    minChunks: 4,
                    priority: -20,
                    reuseExistingChunk: true,
                },
            },
        },
    },
    output: {
        filename: 'js/[name].gen.js',
        chunkFilename: 'js/[name].bundle.gen.js',
        publicPath: '/',
        path: path.resolve(__dirname, 'static'),
    },
    module: {
        rules: [
            {
                test: /\.worker\.ts$/,
                use: [
                    {
                        loader: 'worker-loader',
                        options: {
                            filename: 'js/[name].worker.gen.js',
                        },
                    },
                    {
                        loader: 'babel-loader',
                    },
                ],
            },
            {
                test: /\.(js|jsx|ts|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            // This loader has three purposes:
            // * Hugo doesn't support nested translations but we want to have both the Hugo and Preact translations in a
            //   single file. The loader simply extracts the Hugo translations, prepares them for Hugo and outputs them
            //   to a separate file.
            // * It further generates the JS files to be included in the HTML for the individual languages.
            // * Finally, it combines the requests translations for all languages into one JS files to be included in
            //   the HTML of all language versions.
            {
                test: /src[/\\]i18n[/\\][a-z]{2}\.json/,
                loader: path.resolve('scripts/webpack-i18n-loader.js'),
            },
        ],
    },
    plugins: [
        new webpack.BannerPlugin(`[file]
This code is part of the Datenanfragen.de project. We want to help you exercise your rights under the GDPR.

@license MIT
@author the Datenanfragen.de project {@link https://github.com/datenanfragen/website/blob/master/AUTHORS}
@version ${process.env.npm_package_version}
@updated ${new Date().toISOString()}
@see {@link https://github.com/datenanfragen/website|Code repository}
@see {@link https://www.datenanfragen.de|German website}
@see {@link https://www.datarequests.org|English website}
@see {@link https://www.demandetesdonnees.fr|French website}
@see {@link https://www.pedidodedados.org/|Portuguese website}
@see {@link https://www.solicituddedatos.es/|Spanish website}
@see {@link https://www.osobnipodaci.org/|Croatian website}
@see {@link https://www.todo.tl/|Dutch website}`),

        // Make the version number available in the code, see https://github.com/webpack/webpack/issues/237
        new webpack.DefinePlugin({
            CODE_VERSION: JSON.stringify(process.env.npm_package_version),
        }),
        new webpack.ProvidePlugin({
            createElement: ['preact', 'createElement'],
            Fragment: ['preact', 'Fragment'],
        }),
    ],
    resolve: {
        modules: ['src', 'node_modules', 'i18n', 'res/icons'],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        alias: {
            react: 'preact/compat',
            'react-dom': 'preact/compat',
        },
    },
};
