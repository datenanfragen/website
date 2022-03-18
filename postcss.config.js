const path = require('path');

/*
 * We want to copy the file in a different path than the one we reference in the generated file. Thats why we need to use a custom function for postcss-url. We don't want to duplicate code/functionality, therefore we include the default function.
 */
const processCopy = require('postcss-url/src/type/copy');

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
                    filter: /\.(svg|png|jpg|gif|eot|ttf|woff|woff2)$/,
                    basePath: path.resolve(__dirname, 'assets/'),
                    maxSize: 5,
                    url: async (...args) => processCopy(...args).then(s => '../' + s.replace('static/', '')),
                    // we copy the files in a subfolder of static, we can't copy in to static directly (we would have to .gitignore them)
                    // sadly we can't copy into static/img either :(
                    assetsPath: path.resolve(__dirname, 'static/gen'),
                    optimizeSvgEncode: true,
                },
            ]),
        ],
    };
};
