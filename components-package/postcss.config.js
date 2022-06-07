const path = require('path');

module.exports = {
    plugins: [
        require('postcss-fonticons')({
            iconPath: path.resolve(__dirname, '../assets/icons/'),
            enforcedTimestamp: 1528942455,
            fontName: 'dade-icon-font',
        }),
        require('postcss-url')([
            {
                filter: /\.svg/,
                basePath: path.resolve(__dirname, 'assets/'),
                url: 'inline',
                optimizeSvgEncode: true,
            },
        ]),
    ],
};
