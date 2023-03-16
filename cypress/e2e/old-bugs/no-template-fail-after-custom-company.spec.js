/*
 * In #1008, we noticed a template load error after completing a request to a company with a custom template that
 * doesn't exist in English (the request fallback language).
 */

describe('Custom template load error', () => {
    it('No template load error after completing request to company with custom template', () => {
        cy.visit('/generator/#!companies=bundesjustizamt,schufa&request_type=access');

        cy.contains('Bundesamt für Justiz');
        cy.contains('SCHUFA Holding AG');
        cy.contains('Continue with these companies').click();

        cy.contains('Bundesamt für Justiz');
        cy.contains('Skip request').click();
        // The bug would have occurred here.
        cy.get('.modal').should('not.exist');

        cy.contains('SCHUFA Holding AG');
        cy.contains('Skip request').click();

        cy.contains('What’s next?');
    });
});
