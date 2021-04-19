/*
 * Previously, the request template wouldn't change for the request, even though the language was set by the company entry.
 *
 * This has been fixed by #564.
 */

describe('Request language fallback', () => {
    it('Request language should match the locale by default', () => {
        cy.visit(`${Cypress.env('baseUrl_DE') || Cypress.config().baseUrl.replace('1314', '1313')}/generator`);

        cy.contains('E-Mail senden').click();
        cy.get('.dropdown-container').contains('Text von Hand kopieren').click({ force: true });

        cy.get('#mailto-dropdown-copymanually-body')
            .should('contain.value', 'Guten Tag,') // Check the request template language
            .and('contain.value', 'Mein Zeichen:'); // Check the string translations
        cy.get('#mailto-dropdown-copymanually-subject').should('contain.value', 'Anfrage');
    });

    it('Request language should fallback to english, if language is not supported', () => {
        cy.visit('/generator');

        cy.window().LOCALE = 'tlh'; // We will never support this language

        cy.contains('Send email').click();
        cy.get('.dropdown-container').contains('Copy text manually').click({ force: true });

        cy.get('#mailto-dropdown-copymanually-body')
            .should('contain.value', 'To Whom It May Concern:')
            .and('contain.value', 'My reference:'); // English is the fallback language
        cy.get('#mailto-dropdown-copymanually-subject').should('contain.value', 'Request');
    });

    it('Request language should be set to the language defined in the database entry', () => {
        cy.visit('/generator');

        cy.get('#aa-search-input').type('gmx');
        cy.contains('GMX').click();

        cy.contains('Send email').click();
        cy.get('.dropdown-container').contains('Copy text manually').click({ force: true });

        cy.get('#mailto-dropdown-copymanually-body')
            .should('contain.value', 'Guten Tag,')
            .and('contain.value', 'Betrifft: GMX');
        cy.get('#mailto-dropdown-copymanually-subject').should('contain.value', 'Anfrage');
    });
});
