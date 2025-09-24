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

const redirectingRecords = obsoleteRecords.filter((r) => r['redirect-to']);

const redirects = redirectingRecords
    .map((r) => `/company/${r.slug} /company/${r['redirect-to']}#redirected-from:${r.slug}`)
    .join('\n');
writeFileSync(join(dirname, '..', '_redirects'), redirects);

for (const record of obsoleteRecords) {
    if (!record['redirect-to']) {
        for (const folder of companyContentFolders)
            writeFileSync(join(folder, `${record.slug}.md`), JSON.stringify(record, null, 4));
    }
}

// Add redirection target metadata to company pages.
const redirectionTargets = redirectingRecords.reduce((acc, cur) => {
    const redirectionTarget = cur['redirect-to'];
    if (!redirectionTarget) throw new Error('This should never happen.');

    if (!acc[redirectionTarget]) acc[redirectionTarget] = [];
    acc[redirectionTarget].push(cur);

    return acc;
}, {} as Record<string, ObsoleteRecord[]>);

for (const [slug, redirectors] of Object.entries(redirectionTargets)) {
    const recordPath = join(dirname, '..', 'data_tmp', 'companies', `${slug}.json`);

    const record = JSON.parse(readFileSync(recordPath, 'utf8'));
    record['redirecting-records'] = redirectors;

    writeFileSync(recordPath, JSON.stringify(record, null, 4));
}
