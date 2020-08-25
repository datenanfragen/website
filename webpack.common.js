const webpack = require('webpack');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    entry: {
        'error-handler': './src/error-handler.js',
        general: './src/general.js',
        home: './src/home.js',
        generator: './src/generator.js',
        'company-list': './src/company-list.js',
        'my-requests': './src/my-requests.js',
        'privacy-controls': './src/privacy-controls.js',
        'suggest-edit': './src/suggest-edit.js',
        'id-data-controls': './src/id-data-controls.js',
        'sva-finder': './src/Components/SvaFinder.js',
        'act-widget': './src/Components/ActWidget.js',
        'donation-widget': './src/Components/DonationWidget.js',
        pdfworker: './src/Utility/PdfWorker.js',
        'test-interface': './src/test-interface.js',
        // We need to define a dummy entrypoint that requires all our translation files, otherwise Webpack will not
        // process them.
        'translations-dummy': ['./src/i18n/de.json', './src/i18n/en.json', './src/i18n/fr.json', './src/i18n/pt.json'],
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                sourceMap: true,
                extractComments: false,
                cache: true,
                parallel: true,
                terserOptions: {
                    mangle: {
                        reserved: [
                            'ActionButtonPlaceholder',
                            'NewRequestButtonPlaceholder',
                            'CompanySelectorPlaceholder',
                            'RequestFormPlaceholder',
                            'DynamicInputContainerPlaceholder',
                            'SignatureInputPlaceholder',
                            'RequestTypeChooserPlaceholder',
                            'RecipientInputPlaceholder',
                            'TransportMediumChooserPlaceholder',
                        ],
                    },
                },
            }),
        ],
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
                test: /\.js$/,
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
                test: /src\/i18n\/[a-z]{2}\.json/,
                loader: path.resolve('src/Utility/webpack-i18n-loader.js'),
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
@see {@link https://www.pedidodedados.org/|Portuguese website}`),

        // Make the version number available in the code, see https://github.com/webpack/webpack/issues/237
        new webpack.DefinePlugin({
            CODE_VERSION: JSON.stringify(process.env.npm_package_version),
        }),
    ],
    resolve: {
        modules: ['src', 'node_modules', 'i18n', 'res/icons'],
        alias: {
            react: 'preact-compat',
            'react-dom': 'preact-compat',
            // Not necessary unless you consume a module using `createClass`
            'create-react-class': 'preact-compat/lib/create-react-class',
        },
    },
};
