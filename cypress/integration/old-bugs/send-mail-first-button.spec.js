/*
 * In #252, we noticed that the 'Send mail first' button in the generator was broken after changing the ActionButton.
 */

describe("'Send mail first' button", () => {
    beforeEach(() => {
        cy.visit('/generator');
    });

    it('Modal appears and button works', () => {
        cy.get('.request-transport-medium-chooser').contains('Email').click();

        cy.contains('New request').click();

        cy.get('.modal').contains('You have not yet used your generated request.');

        cy.contains('Send email first').click();

        cy.get('.modal .dropdown-container').contains('How do you want to send the email?').should('be.visible');

        cy.contains('Default email software').should('have.attr', 'href').and('contain', 'mailto:');

        cy.get('.modal .close-button').click();
        cy.get('.modal').should('not.exist');

        cy.get('.request-transport-medium-chooser').contains('Fax').click();

        cy.contains('New request').click();

        cy.get('.modal').contains('You have not yet used your generated request.');

        cy.contains('Download PDF first').clickLinkWithoutFollowingHref();
    });
});
