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
});
