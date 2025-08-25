import { getDirname } from 'cross-dirname';
import { join } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import glob from 'glob';

const dirname = getDirname();

type ObsoleteRecord = {
    slug: string;
    name: string;
    reason: string;
    'redirect-to'?: string;
    sources: string[];
    quality: 'obsolete';
};

const companyContentFolders = glob.sync('*/company', { cwd: join(dirname, '..', 'content'), absolute: true });

const obsoleteRecords: ObsoleteRecord[] = glob
    .sync('*.json', { cwd: join(dirname, '..', 'data_tmp', 'obsolete-records'), absolute: true })
    .map((p) => readFileSync(p, 'utf8'))
    .map((f) => JSON.parse(f));

const redirects = obsoleteRecords
    .filter((r) => r['redirect-to'])
    .map((r) => `/company/${r.slug} /company/${r['redirect-to']}`)
    .join('\n');
writeFileSync(join(dirname, '..', '_redirects'), redirects);

for (const record of obsoleteRecords) {
    if (!record['redirect-to']) {
        for (const folder of companyContentFolders)
            writeFileSync(join(folder, `${record.slug}.md`), JSON.stringify(record, null, 4));
    }
}
