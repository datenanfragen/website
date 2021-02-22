describe('MailtoDropdown', () => {
    it('Copying the email elements manually', () => {
        cy.visit('/generator');

        cy.get('.request-transport-medium-chooser').contains('Email').click();
        cy.get('#request-recipient').type('data.protection@acme.com');
        cy.get('#1-value-id_data').type('Jane Doe');
        cy.contains('Send email').click();
        cy.get('.dropdown-container').contains('Copy text manually').should('be.visible');

        cy.contains('Copy text manually').click({ force: true });
        cy.get('.modal').contains('Here you can copy').should('be.visible');

        cy.get('#mailto-dropdown-copymanually-subject').should('have.attr', 'readonly');
        cy.get('#mailto-dropdown-copymanually-subject').should('have.contain.value', 'Request to access');
        cy.get('#mailto-dropdown-copymanually-recipient').should('have.attr', 'readonly');
        cy.get('#mailto-dropdown-copymanually-recipient').should('have.contain.value', 'acme.com');
        cy.get('#mailto-dropdown-copymanually-body').should('have.attr', 'readonly');
        cy.get('#mailto-dropdown-copymanually-body')
            .should('have.contain.value', 'To Whom It May Concern:')
            .should('have.contain.value', 'Jane Doe');

        cy.get('.modal').contains('Ok').click();
        cy.get('.modal').should('not.exist');
    });
});
