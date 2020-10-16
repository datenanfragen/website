const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    devtool: 'eval-source-map',
    mode: 'development'
});
