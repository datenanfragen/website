module.exports = {
    parser: 'sugarss',
    plugins: {
        'postcss-import': {},
        'postcss-cssnext': {
            browsers: [ 'last 2 versions', '> 5%' ],
        },
        'cssnano': {}
    }
};
