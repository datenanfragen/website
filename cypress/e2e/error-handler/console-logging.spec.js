const msg = 'Does DRY apply to tests?';

describe('Errors should be logged to the console', () => {
    it('Error is shown in console', () => {
        cy.visit('/', {
            onBeforeLoad(win) {
                // See: https://docs.cypress.io/app/faq#How-do-I-spy-on-consolelog
                cy.spy(win.console, 'group').as('consoleGroup');
            },
        });

        Cypress.on('uncaught:exception', (err) => {
            // Returning `false` prevents Cypress from failing the test because of the uncaught error.
            if (err.message.includes(msg)) return false;
        });

        cy.window().then((win) => {
            win.setTimeout(() => {
                throw new Error(msg);
            });
        });

        cy.get('@consoleGroup')
            .should('be.calledWithMatch', 'An unexpected error occurred:')
            .should('be.calledWithMatch', msg);
    });
});
