import { isOn, skipOn } from '@cypress/skip-test';
/*
 * In #830, we almost changed the behaviour that requests should be saved after the modal opened without waiting until the modal closed.
 */

describe('Request should be saved without clicking ok in the copy manually modal', () => {
    it('After click on the ActionButton', () => {
        skipOn(isOn('production'));

        cy.visit('/g');
        cy.contains('Information block').click();

        cy.contains('Send email').click();
        cy.get('.dropdown-container').contains('Copy text manually').should('be.visible');
        cy.contains('Copy text manually').click({ force: true });

        // Explicitly leaving out the click on the "Ok" button

        cy.get('#reference')
            .invoke('val')
            .then((reference) =>
                cy.window().then((win) => win.accessLocalForageStore('my-requests').getItem(`${reference}-access`))
            );
    });

    it('After click in the new request modal', () => {
        skipOn(isOn('production'));

        cy.visit('/g');
        cy.contains('Information block').click();

        cy.contains('New request').click();
        cy.get('.modal').contains('Send email first').should('be.visible').click();
        cy.get('.modal').contains('Copy text manually').click({ force: true });

        // Explicitly leaving out the click on the "Ok" button

        cy.get('#reference')
            .invoke('val')
            .then((reference) =>
                cy.window().then((win) => win.accessLocalForageStore('my-requests').getItem(`${reference}-access`))
            );
    });
});
