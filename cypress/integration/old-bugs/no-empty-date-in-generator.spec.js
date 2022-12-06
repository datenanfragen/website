import { isOn, skipOn } from '@cypress/skip-test';
/*
 * In #507, we noticed that an empty date in the generator causes an error in 'My requests' as parsing the empty date
 * will fail.
 */

describe('Requests without a date should not be allowed', () => {
    it('Deleting the date should reset to today', () => {
        skipOn(isOn('production'));

        cy.visit('/g');

        cy.contains('Information block').click();
        cy.get('#request-date').clear();

        cy.contains('Send email').click();
        cy.get('.dropdown-container').contains('Copy text manually').should('be.visible');
        cy.contains('Copy text manually').click({ force: true });

        cy.get('#reference')
            .invoke('val')
            .then((reference) => {
                cy.window()
                    .then((win) => {
                        const store = win.getProceedingsStore();
                        expect(store._hasHydrated, 'Store should be hydrated').to.be.equal(true);
                        return store.proceedings[reference].messages[`${reference}-00`];
                    })
                    .then((i) => expect(i.date.toDateString()).to.equal(new Date().toDateString()))
                    .then(() => {
                        cy.visit('/my-requests');

                        cy.contains(reference);
                        cy.get('#error-modal').should('not.exist');
                    });
            });
    });
});
