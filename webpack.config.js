const path = require('path');

module.exports = {
    entry: {
        'generator': './src/generator.js',
        'company-list': './src/company-list.js',
        'home': './src/home.js'
    },
    output: {
        filename: '[name].gen.js',
        path: path.resolve(__dirname, 'static/js')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    },
    resolve: {
        modules: [path.resolve(__dirname, 'src'), 'node_modules']
    }
};
