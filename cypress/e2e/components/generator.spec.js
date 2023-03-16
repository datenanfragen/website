import { isOn, skipOn } from '@cypress/skip-test';

const assertIsTrackingRequest = (company, isTrackingRequest) => {
    cy.contains(`Fill in request to “${company}”`);
    cy.get('#name0-value-id_data').clear().type('{selectall}Kim Mustermensch');
    cy.contains('Send request').click();

    cy.get('#send-request-modal-body')
        .should(
            `${isTrackingRequest ? 'not.' : ''}contain.value`,
            'I include the following information necessary to identify me'
        )
        .should(`${!isTrackingRequest ? 'not.' : ''}contain.value`, 'Please tell me which information');
    cy.get('.modal').contains('Skip request').click();
};

describe('Request generator tool component', () => {
    // TODO: We consitently run into an error on the remote here where the generatorStore is not set (or rather: not recognized to be set) that we just cannot reproduce locally.
    /* it('sets correct request type and shows flags', () => {
        const types = [
            { type: 'access', buttonText: 'access', flagTexts: [] },
            {
                type: 'erasure',
                buttonText: 'Delete',
                flagTexts: ['Erase all data', 'Additionally include an objection'],
            },
            { type: 'rectification', buttonText: 'Correct', flagTexts: ['Correct data'] },
            { type: 'objection', buttonText: 'direct marketing', flagTexts: [] },
        ];

        for (const type of types) {
            cy.visit('/generator');

            cy.contains(type.buttonText).click();
            cy.generatorStore()
                .then((state) => state.batchRequestType)
                .should('be.equal', type.type);

            cy.searchAndRequestCompanies(['Reddit', 'Datenanfragen']);

            cy.generatorStore()
                .then((state) => state.request.type)
                .should('be.equal', type.type);
            for (const flagText of type.flagTexts) cy.get('#app').contains(flagText).should('be.visible');

            cy.contains('Send request').click();
            cy.get('.modal').contains('Skip request').click();

            cy.generatorStore()
                .then((state) => state.request.type)
                .should('be.equal', type.type);
            for (const flagText of type.flagTexts) cy.get('#app').contains(flagText).should('be.visible');
        }
    }); */

    it('loads pdf worker for pdf only companies', () => {
        // `window.pdfWorker` is not populated in prod.
        skipOn(isOn('production'));

        cy.visit('/generator');

        cy.contains('access').click();
        cy.searchAndRequestCompanies(['Instagram']);
        cy.window().then((win) => {
            expect(win.pdfWorker).not.to.be.undefined;
            expect(win.pdfWorker).to.satisfy((o) => o instanceof win.Worker);
        });
    });

    it('does not load pdf worker by default', () => {
        // `window.pdfWorker` is not populated in prod.
        skipOn(isOn('production'));

        cy.visit('/generator');

        cy.contains('access').click();
        cy.searchAndRequestCompanies(['Netflix']);
        cy.window().then((win) => {
            expect(win.pdfWorker).to.be.undefined;
        });
    });

    it('changes company packs based on the country', () => {
        cy.visit('/generator', {
            onBeforeLoad(win) {
                Object.defineProperty(win.navigator, 'language', { value: ['de-DE'] });
            },
        });
        cy.contains('access').click();

        const assertPacksForAll = () => {
            cy.contains('Entertainment');
            cy.contains('Finance');
            cy.contains('Telecommunication');
            cy.contains('Social media and communication');
        };

        cy.contains('Address broking and management');
        cy.contains('Credit agencies');
        cy.contains('Commerce').parent().contains('ABOUT YOU');
        assertPacksForAll();

        cy.get('footer .i18n-button').click();
        cy.get('footer .i18n-widget-country select').select('all').blur();

        cy.contains('Address broking and management').should('not.exist');
        cy.contains('Credit agencies').should('not.exist');
        assertPacksForAll();
    });

    it('respects request tracking status', () => {
        cy.visit('/generator', {
            onBeforeLoad(win) {
                Object.defineProperty(win.navigator, 'language', { value: ['de-DE'] });
            },
        });
        cy.contains('Get access').click();

        cy.contains('Add a custom company').click();
        cy.get('.modal').contains('Fill in the company’s details here.');
        cy.get('#custom-company-input-name').type('Darkenanfragen AG');
        cy.get('#custom-company-input-email').type('privacy@darkenanfragen.tld');
        cy.contains('Add company').click();

        cy.searchAndRequestCompanies(['tagesschau.de', 'Adjust GmbH'], false);

        const assertChecked = (company, checked) => {
            cy.contains(company).click();
            cy.contains(company)
                .parent()
                .parent()
                .contains('tracking data')
                .within(() => {
                    cy.get('input[type="checkbox"]').should(`${!checked ? 'not.' : ''}be.checked`);
                });
        };

        assertChecked('Darkenanfragen AG', false);
        assertChecked('Norddeutscher Rundfunk (NDR)', false);
        assertChecked('Adjust GmbH', true);

        cy.contains('Continue with these companies').click();

        assertIsTrackingRequest('Darkenanfragen AG', false);
        assertIsTrackingRequest('Norddeutscher Rundfunk (NDR)', false);
        assertIsTrackingRequest('Adjust GmbH', true);
    });

    it('can toggle request tracking status', () => {
        cy.visit('/generator', {
            onBeforeLoad(win) {
                Object.defineProperty(win.navigator, 'language', { value: ['de-DE'] });
            },
        });

        cy.contains('Get access').click();

        cy.contains('Add a custom company').click();
        cy.get('.modal').contains('Fill in the company’s details here.');
        cy.get('#custom-company-input-name').type('Darkenanfragen AG');
        cy.get('#custom-company-input-email').type('privacy@darkenanfragen.tld');
        cy.contains('Add company').click();

        cy.searchAndRequestCompanies(['tagesschau.de', 'Adjust GmbH'], false);

        const toggleTrackingStatusStatus = (company) => {
            cy.contains(company).click();
            cy.contains(company)
                .parent()
                .parent()
                .contains('tracking data')
                .within(() => {
                    cy.get('input[type="checkbox"]').click();
                });
        };

        toggleTrackingStatusStatus('Darkenanfragen AG');
        toggleTrackingStatusStatus('Norddeutscher Rundfunk (NDR)');
        toggleTrackingStatusStatus('Adjust GmbH');

        cy.contains('Continue with these companies').click();

        assertIsTrackingRequest('Darkenanfragen AG', true);
        assertIsTrackingRequest('Norddeutscher Rundfunk (NDR)', true);
        assertIsTrackingRequest('Adjust GmbH', false);
    });

    it('cannot toggle tracking status for non-access requests', () => {
        const types = ['Delete (parts of)', 'Correct data', 'Stop receiving direct marketing'];
        for (const type of types) {
            cy.visit('/generator');
            cy.contains(type).click();

            cy.searchAndRequestCompanies(['TikTok'], false);
            cy.contains('TikTok').click();
            cy.contains('tracking data').should('not.exist');
        }
    });

    // `cy.generatorStore()` still doesn't work in CI, unfortunately
    // (https://github.com/datenanfragen/website/issues/1043#issuecomment-1472355575,
    // https://github.com/datenanfragen/website/issues/1043#issuecomment-1472476245).
    // it('loads company from slug and clears URL parameters afterwards', () => {
    //     skipOn(isOn('production'));

    //     cy.visit('/generator#!company=airbnb');
    //     cy.waitUntil(() =>
    //         cy
    //             .generatorStore()
    //             .then((state) => state.batch)
    //             .should('have.property', 'airbnb')
    //     );

    //     cy.contains('Get access').click();
    //     cy.contains('Fill in request to “Airbnb Ireland UC”');

    //     cy.contains('Skip request').click();
    //     cy.contains('Send more requests').click();

    //     cy.url().should('not.include', 'airbnb').should('not.include', 'company');
    // });

    // it('loads companies from slug and clears URL parameters afterwards', () => {
    //     skipOn(isOn('production'));

    //     cy.visit('/generator#!companies=airbnb,apple');

    //     cy.waitUntil(() =>
    //         cy
    //             .generatorStore()
    //             .then((state) => state.batch)
    //             .should('have.property', 'apple')
    //     );
    //     cy.contains('Get access').click();

    //     cy.contains('Companies you selected');
    //     cy.contains('Airbnb Ireland UC');
    //     cy.contains('Apple Distribution');
    //     cy.contains('Continue with these companies').click();

    //     cy.contains('Skip request').click();
    //     cy.contains('Skip request').click();
    //     cy.contains('Send more requests').click();

    //     cy.url().should('not.include', 'airbnb').should('not.include', 'apple').should('not.include', 'companies');
    // });

    it('load company from slug, sets request type and clears URL parameters afterwards', () => {
        cy.visit('/generator#!company=mtch-technology&request_type=erasure');
        cy.contains('Fill in request to “OkCupid”');
        cy.contains('Erase all data');

        cy.contains('Skip request').click();
        cy.contains('Send more requests').click();

        cy.url()
            .should('not.include', 'mtch-technology')
            .should('not.include', 'company')
            .should('not.include', 'access')
            .should('not.include', 'request_type');
    });
});
