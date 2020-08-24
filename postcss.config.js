const path = require('path');

module.exports = (ctx) => {
    return {
        plugins: [
            require('postcss-fonticons')({
                iconPath: path.resolve(__dirname, 'assets/icons/'),
            }),
            require('postcss-preset-env')({
                browsers: ['last 2 versions', '> 5%'],
            }),
            require('cssnano')({}),
        ],
    };
};
