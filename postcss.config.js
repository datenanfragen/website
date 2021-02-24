const path = require('path');

module.exports = (ctx) => {
    return {
        plugins: [
            require('postcss-fonticons')({
                iconPath: path.resolve(__dirname, 'assets/icons/'),
                enforcedTimestamp: 1528942455,
            }),
            require('postcss-preset-env')({
                browsers: ['last 2 versions', '> 5%'],
            }),
            require('cssnano')({}),
            require('postcss-url')([
                {
                    filter: /\.svg/,
                    basePath: path.resolve(__dirname, 'assets/'),
                    url: 'inline',
                    optimizeSvgEncode: true,
                },
                {
                    filter: /\.(png|jpg|gif|eot|ttf|woff|woff2)$/,
                    basePath: path.resolve(__dirname, 'assets/'),
                    maxSize: 10,
                    fallback: 'copy',
                    assetsPath: path.resolve(__dirname, 'public/img'),
                    useHash: true,
                },
            ]),
        ],
    };
};
