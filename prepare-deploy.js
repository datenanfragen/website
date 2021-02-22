const glob = require('glob');
const fs = require('fs');
const path = require('path');
const schema = require('./static/schema');

// Find countries that have data.
const countries_not_to_stub = glob
    .sync('static/db/suggested-companies/@(??|all).json')
    .map((country_file) => path.basename(country_file, '.json'));

// Determine countries that need stubs by filtering out the countries that have data.
const all_countries = schema.properties['relevant-countries'].items.enum;
const countries_to_stub = all_countries.filter((country) => !countries_not_to_stub.includes(country));

// Create the stubs for the countries with no data.
countries_to_stub.forEach((country) => {
    fs.writeFileSync('static/db/suggested-companies/' + country + '.json', '[]');
});

// Create wizard files for all countries.
all_countries.forEach((country) => {
    const json = fs.readFileSync('static/db/suggested-companies/' + country + '.json', 'utf-8');
    const companies = JSON.parse(json);

    const companies_wizard = companies.reduce((acc, slug) => {
        const details = JSON.parse(fs.readFileSync('static/db/' + slug + '.json', 'utf-8'));
        acc[slug] = details['name'];
        return acc;
    }, {});

    fs.writeFileSync(
        'static/db/suggested-companies/' + country + '_wizard.json',
        JSON.stringify(companies_wizard, null, 4)
    );
});
