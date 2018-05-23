const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
    entry: {
        'home': './src/home.js',
        'generator': './src/generator.js',
        'company-list': './src/company-list.js',
        'my-requests': './src/my-requests.js',
        'privacy-controls': './src/privacy-controls.js',
        'pdfworker': './src/PdfWorker.js',
        'style': './src/main.css'
    },
    output: {
        filename: 'js/[name].gen.js',
        path: path.resolve(__dirname, 'static')
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true
            }),
            new OptimizeCSSAssetsPlugin({})
        ],
        splitChunks: {
            cacheGroups: {
                styles: {
                    name: 'style',
                    test: /\.css$/,
                    chunks: 'all',
                    enforce: true
                }
            }
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/[name].gen.css'
        }),
        new webpack.BannerPlugin('[file]\nThis code is part of the Datenanfragen.de project. We want to help you exercise your rights under the GDPR.\n\n@license MIT\n@author the Datenanfragen.de project\n@version ' + process.env.npm_package_version + '\n@updated ' + new Date().toISOString() + '\n@see {@link https://github.com/datenanfragen/website|Code repository}\n@see {@link https://www.datenanfragen.de|German website}\n@see {@link https://datarequests.org|English website}')
    ],
    resolve: {
        modules: [ 'src', 'node_modules', 'i18n' ],
        alias: {
            'react': 'preact-compat',
            'react-dom': 'preact-compat',
            // Not necessary unless you consume a module using `createClass`
            'create-react-class': 'preact-compat/lib/create-react-class'
        }
    }
};
