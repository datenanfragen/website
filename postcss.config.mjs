import { resolve } from 'path';
import fonticons from 'postcss-fonticons';
import presetEnv from 'postcss-preset-env';
import cssnano from 'cssnano';

export default {
    plugins: [
        fonticons({
            iconPath: resolve(import.meta.dirname, 'assets/icons/'),
            enforcedTimestamp: 1528942455,
        }),
        presetEnv({
            browsers: ['last 2 versions', '> 5%'],
        }),
        cssnano({}),
    ],
};
