const PRIVACY_CONTROLS = require('../../fixtures/privacy-controls.json');

describe('Clear all cookies button', () => {
    it('Deletes all cookies', () => {
        cy.visit('/privacy-controls');

        // Let's set some cookies.
        cy.get('#search-checkbox').click();
        cy.get('#search-checkbox').click();
        cy.get('#search-checkbox').click();

        cy.get('#save_my_requests-checkbox').click();
        cy.get('.modal .inner .close-button').click();

        cy.get('#save_id_data-checkbox').click();
        cy.get('.modal .inner .close-button').click();
        cy.get('#save_id_data-checkbox').click();

        cy.get('#save_wizard_entries-checkbox').click();
        cy.get('.modal .inner .close-button').click();

        cy.get('#clear-cookies-button').click({ force: true });

        PRIVACY_CONTROLS.forEach((c) => {
            cy.getCookie(c.cookie_name).should('not.exist');
        });
    });
});
