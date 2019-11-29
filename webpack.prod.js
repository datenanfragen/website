const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');

const smp = new SpeedMeasurePlugin({
    disable: !process.env.DADE_MEASURE_WEBPACK
});

module.exports = smp.wrap(
    merge(common, {
        devtool: 'cheap-source-map',
        mode: 'production'
    })
);
