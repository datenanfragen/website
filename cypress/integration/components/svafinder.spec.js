import { isOn, skipOn } from '@cypress/skip-test';

describe('SvaFinder component', () => {
    beforeEach(() => {
        cy.visit('/supervisory-authorities');
    });

    it('handles simple country (Austria) correctly', () => {
        cy.contains('Supervisory authority finder');
        cy.contains('Where do you live');
        cy.get('.sva-finder').contains('Austria').click();
        cy.contains('Österreichische Datenschutzbehörde')
            .should('have.attr', 'href')
            .and('match', /supervisory-authority\/atdsb/);
        cy.contains('Österreichische Datenschutzbehörde').click();
        cy.contains('Contact information for privacy-related requests to “Österreichische Datenschutzbehörde”');
    });

    it('handles Germany correctly', () => {
        cy.contains('Supervisory authority finder');
        cy.contains('Where do you live');

        const paths = [
            {
                path: ['Federal authority'],
                result_name: 'Der Bundesbeauftragte für den Datenschutz und die Informationsfreiheit',
                result_url_regex: /supervisory-authority\/debfdi/,
            },
            {
                path: ['Religious body', 'Catholic church', 'Bavarian dioceses'],
                result_name: 'Diözesandatenschutzbeauftragter Bayerische Bistümer',
                result_url_regex: /supervisory-authority\/dekathbayddsb/,
            },
            {
                path: ['Religious body', 'Catholic church', 'Other dioceses'],
                result_name: 'Die Datenschutzbeauftragte des Verbandes der Diözesen Deutschlands',
                result_url_regex: /supervisory-authority\/dekathverbdsb/,
            },
            {
                path: ['Religious body', 'Evangelical church'],
                result_name: 'Der Beauftragte für den Datenschutz der EKD',
                result_url_regex: /supervisory-authority\/deekdbfd/,
            },
            {
                path: ['Public or private entity', 'Entity is based in Germany', 'Lower Saxony'],
                result_name: 'Die Landesbeauftragte für den Datenschutz Niedersachsen',
                result_url_regex: /supervisory-authority\/dendslfd/,
            },
            {
                path: ['Public or private entity', 'Entity is based in Germany', 'Bavaria', 'Private entity'],
                result_name: 'Bayerisches Landesamt für Datenschutzaufsicht (BayLDA)',
                result_url_regex: /supervisory-authority\/debaylda/,
            },
            {
                path: ['Public or private entity', 'Entity is based in Germany', 'Bavaria', 'Public entity'],
                result_name: 'Der Bayerische Landesbeauftragte für den Datenschutz',
                result_url_regex: /supervisory-authority\/debayldb/,
            },
            {
                path: ['Public or private entity', 'Entity is based in other country', 'Lower Saxony'],
                result_name: 'Die Landesbeauftragte für den Datenschutz Niedersachsen',
                result_url_regex: /supervisory-authority\/dendslfd/,
            },
            {
                path: ['Public or private entity', 'Entity is based in other country', 'Bavaria'],
                result_name: 'Bayerisches Landesamt für Datenschutzaufsicht (BayLDA)',
                result_url_regex: /supervisory-authority\/debaylda/,
            },
            {
                path: ['Public service broadcasters', 'Deutschlandradio'],
                result_name: 'Der Rundfunkdatenschutzbeauftragte von BR, SR, WDR, Deutschlandradio und ZDF',
                result_url_regex: /supervisory-authority\/derf/,
            },
        ];

        const validatePath = (p) => {
            cy.get('.sva-finder').contains('Germany').click();
            for (const label of p.path) cy.get('.sva-finder').contains(label).click();
            cy.get('.sva-finder').contains(p.result_name).should('have.attr', 'href').and('match', p.result_url_regex);
            cy.get('.sva-finder').contains('Reset choices').click();
        };
        paths.forEach(validatePath);
    });

    it("moves the user's country to the top if set", () => {
        cy.window().then((win) => {
            win.globals.country = 'de';
            cy.reload();

            cy.get('.sva-finder .radio-group-vertical label:nth-child(1)')
                .contains('Germany')
                .should('have.class', 'active');
        });
    });

    it('works in the generator for complaints', () => {
        skipOn(isOn('production'));

        cy.window()
            .then((win) => {
                return win.accessLocalForageStore('my-requests').then((instance) =>
                    instance.setItem('2020-YWT4H4U-access', {
                        reference: '2020-YWT4H4U',
                        date: '2020-03-14',
                        type: 'access',
                        slug: 'datenanfragen',
                        recipient: 'Datenanfragen.de e. V.',
                        email: '',
                        via: 'email',
                    })
                );
            })
            .then(() => {
                cy.visit('/generator/#!response_type=complaint&response_to=2020-YWT4H4U-access');

                cy.get('.modal').contains(
                    'This assistant will help you select the supervisory data protection authority'
                );
                cy.get('.sva-finder').contains('Where do you live?');
                cy.get('.sva-finder').contains('Germany').click();
                cy.get('.sva-finder').contains('Which of the following areas does your request concern?');
                cy.get('.sva-finder').contains('Public or private entity').click();
                cy.get('.sva-finder').contains('Is the entity that your request concerns also based in Germany?');
                cy.get('.sva-finder').contains('Entity is based in other country').click();
                cy.get('.sva-finder').contains('In which state do you live?');
                cy.get('.sva-finder').contains('Saarland').click();

                cy.get('.sva-finder').should('not.exist');
                cy.get('#company-info .accordion-title').contains('Unabhängiges Datenschutzzentrum Saarland');
                cy.get('#request-recipient').should('have.value', 'poststelle@datenschutz.saarland.de');
            });
    });
});
