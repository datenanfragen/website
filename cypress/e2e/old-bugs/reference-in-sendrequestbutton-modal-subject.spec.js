/*
 * In #1095, we noticed that in the new generator, the reference was only included in the `MailtoDropdown`'s subject
 * line but not in the subject input shown in the `SendRequestButton` modal.
 */

describe('Reference in generated subject', () => {
    it('Reference is in included in subject input for generated request', () => {
        cy.visit('/generator/#!companies=datenanfragen&request_type=access');
        cy.contains('Datenanfragen.de');

        cy.contains('Send request').click();

        cy.get('#send-request-modal-subject').should('contain.value', '(My reference:');

        cy.get('#send-request-modal-body')
            .invoke('val')
            .then((body) => {
                const reference = body.match(/My reference: ([\dA-Z-]+)/)[1];
                cy.get('#send-request-modal-subject').should('contain.value', reference);
            });
    });
});
