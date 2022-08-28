import { readFileSync, writeFileSync } from 'fs';
import { join, basename } from 'path';
import glob from 'glob';
import dirname from 'es-dirname';
import MiniSearch from 'minisearch';

import schema from '../static/schema.json';
import { defaultSearchParams } from '../src/Utility/search';

const companies = glob
    .sync('*.json', { cwd: join(dirname(dirname()), '..', 'static', 'db'), absolute: true })
    .map((p) => readFileSync(p, 'utf8'))
    .map((f) => JSON.parse(f));
const options = {
    idField: 'slug',
    fields: defaultSearchParams.query_by.split(',').map((f) => f.trim()),
    storeFields: Object.keys(schema.properties),
    searchOptions: {
        prefix: true,
        fuzzy: true,
    },
};
const miniSearch = new MiniSearch(options);
miniSearch.addAll(companies);

const companyPacks = glob
    .sync('*.json', { cwd: join(dirname(dirname()), '..', 'static', 'db', 'company-packs'), absolute: true })
    .reduce((acc, p) => ({ ...acc, [basename(p, '.json')]: JSON.parse(readFileSync(p, 'utf8')) }), {});

writeFileSync(
    join(dirname(dirname()), '..', 'static', 'offline-data.json'),
    JSON.stringify({
        date: new Date().toISOString(),
        'format-version': 1,
        'company-search': { options, index: JSON.stringify(miniSearch) },
        'company-packs': companyPacks,
    })
);
