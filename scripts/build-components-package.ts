import { join } from 'path';
import fs from 'fs-extra';
import yesno from 'yesno';
import { globSync } from 'node:fs';
import { execa } from 'execa';
import { getDirname } from 'cross-dirname';
import { objFilter, deepCopyObject } from '../src/Utility/common';
import website_pjson from '../package.json';
import pjson_template from '../components-package/package.template.json';

const dirname = getDirname();

const website_dir = join(dirname, '..');
const package_dir = join(website_dir, 'components-package');
const generated_dir = join(package_dir, 'src', 'generated');

const getSupportedCountries = () => {
    const db_dir = join(website_dir, 'static', 'db');
    const country_counts = globSync('*.json', { cwd: db_dir }).reduce((acc: Record<string, number>, cur: string) => {
        const entry = JSON.parse(fs.readFileSync(join(db_dir, cur), 'utf-8'));
        entry['relevant-countries'].forEach((country) => (acc[country] ? (acc[country] += 1) : (acc[country] = 1)));
        return acc;
    }, {});
    return Object.keys(objFilter(country_counts, ([, num]) => num > 10));
};

(async () => {
    if (
        !process.argv.includes('--skip-deploy-question') &&
        !(await yesno({ question: 'Have you run the deploy script to ensure that the templates are up-to-date?' }))
    )
        process.exit(1);

    // `make clean`
    fs.removeSync(join(package_dir, '.parcel-cache'));
    fs.removeSync(join(package_dir, 'dist'));
    fs.removeSync(join(package_dir, 'src', 'generated'));
    fs.removeSync(join(package_dir, 'package.json'));

    // Create `package.json` according to the template.
    const pjson = deepCopyObject(pjson_template);
    for (const property of [
        'version',
        'keywords',
        'repository',
        'bugs',
        'homepage',
        'author',
        'contributors',
        'license',
    ])
        pjson[property] = website_pjson[property];

    const moveToPeerDependencies = ['preact', 'preact-i18n'];
    const dependencies = objFilter(website_pjson.dependencies, ([pkg]) => !moveToPeerDependencies.includes(pkg));
    const peerDependencies = objFilter(website_pjson.dependencies, ([pkg]) => moveToPeerDependencies.includes(pkg));
    pjson.dependencies = { ...dependencies, ...pjson.dependencies };
    pjson.peerDependencies = { ...peerDependencies, ...pjson.peerDependencies };
    fs.writeFileSync(join(package_dir, 'package.json'), JSON.stringify(pjson, null, 4));

    // Copy license and attribution files over.
    for (const filename of ['LICENSE', 'ATTRIBUTION', 'AUTHORS'])
        fs.copySync(join(website_dir, filename), join(package_dir, filename));

    fs.ensureDirSync(generated_dir);

    // Build a JSON module that exports the templates.
    const template_dir = join(website_dir, 'static', 'templates');
    const template_files = globSync('**/*.txt', { cwd: template_dir });
    const templates = template_files.reduce((acc, cur) => {
        const [language, filename] = cur.split('/');
        if (!acc[language]) acc[language] = {};
        acc[language][filename.split('.')[0]] = fs.readFileSync(join(template_dir, cur), 'utf-8');
        return acc;
    }, {});
    fs.writeFileSync(join(generated_dir, 'templates.json'), JSON.stringify(templates, null, 4));
    fs.writeFileSync(
        join(generated_dir, 'globals.json'),
        JSON.stringify({ supported_countries: getSupportedCountries() })
    );

    // Install dependencies.
    await execa('yarn', { cwd: package_dir, stdio: 'inherit' });

    // Separately build the PDF worker, which needs to be a standalone JS file with bundled dependencies.
    const pdf_worker_dist = join(generated_dir, 'pdf.worker.ts');
    fs.copySync(join(website_dir, 'src', 'Utility', 'pdf.worker.ts'), pdf_worker_dist);
    await execa('yarn', ['parcel', 'build', pdf_worker_dist, '--target', 'worker', '--no-cache', '--no-source-maps'], {
        cwd: package_dir,
        stdio: 'inherit',
    });

    // Do the actual build.
    await execa('yarn', ['parcel', 'build', '--no-cache', '--no-source-maps'], { cwd: package_dir, stdio: 'inherit' });

    // Copy the data dump over.
    fs.copySync(join(website_dir, 'static', 'offline-data.json'), join(package_dir, 'dist', 'offline-data.json'));
})();
