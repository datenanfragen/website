const assertIsTrackingRequest = (company, isTrackingRequest) => {
    cy.contains(`Fill in request to “${company}”`);
    cy.get('#name0-value-id_data').type('{selectall}Kim Mustermensch');
    cy.containsSettled('Send request').click();

    cy.get('#send-request-modal-body')
        .should(
            `${isTrackingRequest ? 'not.' : ''}contain.value`,
            'I include the following information necessary to identify me'
        )
        .should(`${!isTrackingRequest ? 'not.' : ''}contain.value`, 'Please tell me which information');
    cy.get('.modal').contains('Skip request').click();
};

describe('Request generator tool component', () => {
    it('sets correct request type and shows flags', () => {
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

            cy.containsSettled(type.buttonText).click();
            cy.generatorStore()
                .then((state) => state.batchRequestType)
                .should('be.equal', type.type);

            cy.searchAndRequestCompanies(['Reddit', 'Datenanfragen']);

            cy.generatorStore()
                .then((state) => state.request.type)
                .should('be.equal', type.type);
            for (const flagText of type.flagTexts) cy.get('#app').contains(flagText).should('be.visible');

            cy.contains('Send request').click();
            cy.get('.modal').containsSettled('Skip request').click();

            cy.generatorStore()
                .then((state) => state.request.type)
                .should('be.equal', type.type);
            for (const flagText of type.flagTexts) cy.get('#app').contains(flagText).should('be.visible');
        }
    });

    it('loads pdf worker for pdf only companies', () => {
        cy.visit('/generator');

        cy.containsSettled('access').click();
        cy.searchAndRequestCompanies(['Instagram']);
        cy.window().then((win) => {
            expect(win.pdfWorker).not.to.be.undefined;
            expect(win.pdfWorker).to.satisfy((o) => o instanceof win.Worker);
        });
    });

    it('does not load pdf worker by default', () => {
        cy.visit('/generator');

        cy.containsSettled('access').click();
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
        cy.containsSettled('access').click();

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
        cy.containsSettled('Get access').click();

        cy.contains('Add a custom company').click();
        cy.get('.modal').containsSettled('Fill in the company’s details here.');
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

        cy.containsSettled('Continue with these companies').click();

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
        cy.containsSettled('Get access').click();

        cy.contains('Add a custom company').click();
        cy.get('.modal').containsSettled('Fill in the company’s details here.');
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

        cy.containsSettled('Continue with these companies').click();

        assertIsTrackingRequest('Darkenanfragen AG', true);
        assertIsTrackingRequest('Norddeutscher Rundfunk (NDR)', true);
        assertIsTrackingRequest('Adjust GmbH', false);
    });

    it('cannot toggle tracking status for non-access requests', () => {
        const types = ['Delete (parts of)', 'Correct data', 'Stop receiving direct marketing'];
        for (const type of types) {
            cy.visit('/generator');
            cy.containsSettled(type).click();

            cy.searchAndRequestCompanies(['TikTok'], false);
            cy.contains('TikTok').click();
            cy.contains('tracking data').should('not.exist');
        }
    });

    it('loads company from slug and clears URL parameters afterwards', () => {
        cy.visit('/generator#!company=airbnb');
        cy.containsSettled('Get access').click();
        cy.contains('Fill in request to “Airbnb Ireland UC”');

        cy.containsSettled('Skip request').click();
        cy.containsSettled('Send more requests').click();

        cy.url().should('not.include', 'airbnb').should('not.include', 'company');
    });

    it('loads companies from slug and clears URL parameters afterwards', () => {
        cy.visit('/generator#!companies=airbnb,apple');
        cy.containsSettled('Get access').click();

        cy.contains('Companies you selected');
        cy.contains('Airbnb Ireland UC');
        cy.contains('Apple Distribution');
        cy.containsSettled('Continue with these companies').click();

        cy.containsSettled('Skip request').click();
        cy.containsSettled('Skip request').click();
        cy.containsSettled('Send more requests').click();

        cy.url().should('not.include', 'airbnb').should('not.include', 'apple').should('not.include', 'companies');
    });
});
