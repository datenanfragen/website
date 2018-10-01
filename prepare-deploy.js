const glob = require('glob');
const fs = require('fs');
const path = require('path');

glob('static/db/suggested-companies/??.json', async (err, countries) => {
    countries.forEach(country_file => {
        fs.readFile(country_file, 'utf-8', (err, json) => {
            let companies = JSON.parse(json);
            let companies_wizard = {};

            companies.forEach(slug => {
                let details_json = fs.readFileSync('static/db/' + slug + '.json', 'utf-8');
                let details = JSON.parse(details_json);
                companies_wizard[slug] = details['name'];
            });

            fs.writeFileSync('static/db/suggested-companies/' + path.basename(country_file, '.json') + '_wizard.json', JSON.stringify(companies_wizard, null, '    '));
        });
    });
});
