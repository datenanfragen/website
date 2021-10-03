import { render } from 'preact-render-to-string';
import { Comment } from '../../src/Components/Comment';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

declare global {
    interface Window {
        LOCALE: string;
        fetch: any;
    }
}
(async () => {
    // TODO how do we get all comments?
    const request = await axios.get('https://backend.datenanfragen.de/comments/get');
    const all_comments: Array<any> = request.data;

    let grouped_comments: Record<string, Array<any>> = {};

    for (const c of all_comments) {
        if (!grouped_comments[c.target]) grouped_comments[c.target] = [];
        const n = Object.assign({}, c);
        delete n.target;
        grouped_comments[c.target].push(n);
    }
    for (const target in grouped_comments) {
        const comments = grouped_comments[target];
        let output = '';
        for (const c of comments) {
            output += render(
                <Comment id={c.id} author={c.author} message={c.message} date={c.added_at} additional={c.additional} />
            );
        }
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
