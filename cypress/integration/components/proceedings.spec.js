const message_template = {
    reference: '2022-KKD2YF1',
    date: new Date(),
    type: 'access',
    slug: 'datenanfragen',
    correspondent_address: 'Datenanfragen.de e. V.\nSchreinerweg 6\n38126 Braunschweig\nDeutschland',
    correspondent_email: 'datenschutz@datenanfragen.de',
    transport_medium: 'email',
    subject: undefined,
    content: undefined,
    sentByMe: true,
    extra: undefined,
};

describe('Proceedings page', () => {
    beforeEach(() => {
        cy.clearIndexedDb('Datenanfragen.de');
        cy.visit('/my-requests');
        // Wait for proceedingsStore hydration TODO: Can this be more elegant? This seems bound to be undeterministic
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(100);

        cy.proceedingsStore()
            .then((state) => state._hasHydrated)
            .should('be.equal', true);
    });

    it('shows regular proceeding', () => {
        cy.proceedingsStore().then((store) =>
            store.addProceeding({
                reference: '2022-KKD2YF1',
                status: 'done',
                messages: {
                    '2022-KKD2YF1-00': {
                        id: '2022-KKD2YF1-00',
                        ...message_template,
                    },
                },
            })
        );
        cy.get('.proceeding-rows')
            .should('contain.text', '2022-KKD2YF1')
            .should('contain.text', 'Datenanfragen.de e. V.');
    });

    it('assigns correct state', () => {
        cy.proceedingsStore().then((store) => {
            store.addProceeding({
                reference: '2022-KKD2YF1',
                messages: {},
            });
            store.addMessage({
                ...message_template,
                date: new Date('2022-01-14T00:00:00.000Z'),
            });
        });
        cy.get('.proceeding-rows').should('contain.text', 'Overdue').should('contain.text', 'January 14, 2022');

        cy.proceedingsStore().then((store) => {
            store.addMessage({
                ...message_template,
                type: 'response',
                sentByMe: false,
            });
        });

        cy.get('.proceeding-rows').should('contain.text', 'Action needed');

        cy.proceedingsStore().then((store) => {
            store.addMessage({
                ...message_template,
                type: 'admonition',
                sentByMe: true,
            });
        });

        cy.get('.proceeding-rows').should('contain.text', 'Response pending');
    });
});
