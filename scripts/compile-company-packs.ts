import { existsSync, readFileSync, writeFileSync, rmSync } from 'fs';
import { join } from 'path';
import dirname from 'es-dirname';
import schema from '../static/schema.json';

type CompanyPacks = { slug: string; type: 'add-all' | 'choose'; companies: string[] }[];
type CompanyPacksWithNames = {
    slug: string;
    type: 'add-all' | 'choose';
    companies: { slug: string; name: string }[];
}[];

const packsDir = join(dirname(), '..', 'data_tmp', 'company-packs');
const compiledPacksDir = join(dirname(), '..', 'static', 'db', 'company-packs');
const packsForAll = JSON.parse(readFileSync(join(packsDir, 'all.json'), 'utf-8')) as CompanyPacks;
const companiesDir = join(dirname(), '..', 'static', 'db');
const countries = schema.properties['relevant-countries'].items.enum.filter((c) => c !== 'all');

for (const country of countries) {
    const packsForCountryPath = join(packsDir, `${country}.json`);
    const packsForCountry: CompanyPacks = existsSync(packsForCountryPath)
        ? JSON.parse(readFileSync(packsForCountryPath, 'utf8'))
        : [];
    const compiledPacks: CompanyPacksWithNames = [
        ...packsForCountry.map((p) => p.slug),
        ...packsForAll.map((p) => p.slug),
    ].map((slug) => {
        const packForAll = packsForAll.find((p) => p.slug === slug);
        const packForCountry = packsForCountry.find((p) => p.slug === slug);
        return {
            slug,
            type: packForAll?.type === 'choose' || packForCountry?.type === 'choose' ? 'choose' : 'add-all',
            companies: [...new Set([...(packForCountry?.companies || []), ...(packForAll?.companies || [])])]
                .map((s) => ({
                    slug: s,
                    name: JSON.parse(readFileSync(join(companiesDir, `${s}.json`), 'utf-8')).name as string,
                }))
                .sort((a, b) => a.name.localeCompare(b.name)),
        };
    });
    writeFileSync(join(compiledPacksDir, `${country}.json`), JSON.stringify(compiledPacks));
}
