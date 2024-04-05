import { readFileSync, writeFileSync } from 'fs';
import { join, basename } from 'path';
import * as glob from 'glob';
import dirname from 'es-dirname';

const companies = glob
    .sync('*.json', { cwd: join(dirname(dirname()), '..', 'static', 'db'), absolute: true })
    .map((p) => readFileSync(p, 'utf8'))
    .map((f) => JSON.parse(f));

const svas = glob
    .sync('*.json', { cwd: join(dirname(dirname()), '..', 'static', 'db', 'sva'), absolute: true })
    .map((p) => readFileSync(p, 'utf8'))
    .map((f) => JSON.parse(f));

const companyPacks = glob
    .sync('*.json', { cwd: join(dirname(dirname()), '..', 'static', 'db', 'company-packs'), absolute: true })
    .reduce((acc, p) => ({ ...acc, [basename(p, '.json')]: JSON.parse(readFileSync(p, 'utf8')) }), {});

writeFileSync(
    join(dirname(dirname()), '..', 'static', 'offline-data.json'),
    JSON.stringify({
        date: new Date().toISOString(),
        'dump-format': 1,
        companies: JSON.stringify(companies),
        'supervisory-authorities': JSON.stringify(svas),
        'company-packs': JSON.stringify(companyPacks),
    })
);
