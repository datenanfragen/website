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
            cy.contains('Skip request').click({ force: true });

            cy.generatorStore()
                .then((state) => state.request.type)
                .should('be.equal', type.type);
            for (const flagText of type.flagTexts) cy.get('#app').contains(flagText).should('be.visible');
        }
    });

    it('loads pdf worker for pdf only companies', () => {
        cy.visit('/generator');

        cy.contains('access').click();
        cy.searchAndRequestCompanies(['Instagram']);
        cy.window().then((win) => {
            expect(win.pdfWorker).not.to.be.undefined;
            expect(win.pdfWorker).to.satisfy((o) => o instanceof win.Worker);
        });
    });

    it('does not load pdf worker by default', () => {
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
});
