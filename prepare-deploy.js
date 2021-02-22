const glob = require('glob');
const fs = require('fs');
const path = require('path');
const schema = require('./static/schema');

// Find countries that have data.
let do_not_stub_countries = [];
glob.sync('static/db/suggested-companies/@(??|all).json').forEach((country_file) => {
    let country_code = path.basename(country_file, '.json');
    do_not_stub_countries.push(country_code);
});

// Determine countries that need stubs by filtering out the countries that have data.
let all_countries = schema.properties['relevant-countries'].items.enum;
let stub_countries = all_countries.filter((country) => !do_not_stub_countries.includes(country));

// Create the stubs for the countries with no data.
stub_countries.forEach((country) => {
    fs.writeFileSync('static/db/suggested-companies/' + country + '.json', '[]');
});

// Create wizard files for all countries.
glob('static/db/suggested-companies/@(??|all).json', async (err, countries) => {
    countries.forEach((country_file) => {
        fs.readFile(country_file, 'utf-8', (err, json) => {
            let companies = JSON.parse(json);
            let companies_wizard = {};

            companies.forEach((slug) => {
                let details_json = fs.readFileSync('static/db/' + slug + '.json', 'utf-8');
                let details = JSON.parse(details_json);
                companies_wizard[slug] = details['name'];
            });

            fs.writeFileSync(
                'static/db/suggested-companies/' + path.basename(country_file, '.json') + '_wizard.json',
                JSON.stringify(companies_wizard, null, '    ')
            );
        });
    });
});
