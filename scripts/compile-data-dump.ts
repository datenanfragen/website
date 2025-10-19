import { readFileSync, writeFileSync } from 'fs';
import { join, basename } from 'path';
import { globSync } from 'node:fs';
import { getDirname } from 'cross-dirname';

const dirname = getDirname();

const companies = globSync('*.json', { cwd: join(dirname, '..', 'static', 'db'), absolute: true })
    .map((p) => readFileSync(p, 'utf8'))
    .map((f) => JSON.parse(f));

const svas = globSync('*.json', { cwd: join(dirname, '..', 'static', 'db', 'sva'), absolute: true })
    .map((p) => readFileSync(p, 'utf8'))
    .map((f) => JSON.parse(f));

const companyPacks = globSync('*.json', {
    cwd: join(dirname, '..', 'static', 'db', 'company-packs'),
    absolute: true,
}).reduce((acc, p) => ({ ...acc, [basename(p, '.json')]: JSON.parse(readFileSync(p, 'utf8')) }), {});

writeFileSync(
    join(dirname, '..', 'static', 'offline-data.json'),
    JSON.stringify({
        date: new Date().toISOString(),
        'dump-format': 1,
        companies: JSON.stringify(companies),
        'supervisory-authorities': JSON.stringify(svas),
        'company-packs': JSON.stringify(companyPacks),
    })
);
