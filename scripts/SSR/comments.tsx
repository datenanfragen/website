import { render } from 'preact-render-to-string';
import CommentsWidget from '../../src/Components/CommentsWidget';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import deepmerge from 'deepmerge';

declare global {
    interface Window {
        LOCALE: string;
        fetch: any;
    }
}
(async () => {
    // TODO how do we get all comments?
    // TODO pre-render form for pages w/o comments?
    const request = await axios.get('https://backend.datenanfragen.de/comments/get');
    const all_comments: Array<any> = request.data;

    let grouped_comments: Record<string, Array<any>> = {};

    // TODO load right language
    const en = require('../../src/i18n/en.json');
    //const i18n_data = deepmerge(en, en);

    for (const c of all_comments) {
        if (!grouped_comments[c.target]) grouped_comments[c.target] = [];
        const n = Object.assign({}, c);
        delete n.target;
        grouped_comments[c.target].push(n);
    }
    for (const target in grouped_comments) {
        const comments = grouped_comments[target];
        //TODO allowRating and displayWarning depending on site
        const output = render(
            <CommentsWidget allow_rating={true} comments={comments} target={'TODO'} i18n_definition={en} />
        );
        if (!['blog', 'company', 'act'].some((x) => target.split('/')[1].startsWith(x))) {
            console.log('u', target);
            continue;
        }
        const folder = path.join('.', 'content', target);
        if (!fs.existsSync(folder)) {
            console.log('f', target, folder);
            continue;
        }
        const outpath = path.join(folder, 'comments.ssr.html');
        fs.writeFileSync(outpath, output);
    }
})().catch((err) => console.error(err));
