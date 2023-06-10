import { isOn, skipOn } from '@cypress/skip-test';

/*
 * In #1015, we noticed that typing an invalid date in the `ImportMessageModal` would cause an error.
 */

describe('ImportMessageModal', () => {
    beforeEach(() => {
        skipOn(isOn('production'));

        cy.visit('/my-requests');
        // TODO: Can this be more elegant?
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(100);

        cy.proceedingsStore()
            .then((state) => state._hasHydrated)
            .should('be.equal', true);
    });

    it("Don't fail when entering an invalid date.", () => {
        cy.proceedingsStore().then((store) =>
            store.addProceeding({
                reference: '2022-29KVS000',
                status: 'waitingForResponse',
                messages: {
                    '2022-29KVS000-00': {
                        id: '2022-29KVS000-00',
                        reference: '2022-29KVS000',
                        date: new Date('2022-01-01'),
                        type: 'access',
                        slug: 'datenanfragen',
                        correspondent_address:
                            'Datenanfragen.de e. V.\nSchreinerweg 6\n38126 Braunschweig\nDeutschland',
                        correspondent_email: 'datenschutz@datenanfragen.de',
                        transport_medium: 'email',
                        subject: 'Request to access to personal data according to Art. 15 GDPR',
                        content: undefined,
                        sentByMe: true,
                        extra: undefined,
                    },
                },
            })
        );

        cy.contains('Datenanfragen.de').click();
        cy.contains('Add message').click();

        cy.get('.modal');

        // Cypress doesn't let us type an invalid date, but clearing the input has the same effect here.
        cy.get('#message-metadata-input-date').clear().blur();
        cy.contains('The date you entered was invalid.');
        cy.get('#message-metadata-input-date').should('have.value', new Date().toISOString().substring(0, 10));
    });
});
