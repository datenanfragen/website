describe('Search for company by slug and visit company detail page', () => {
    beforeEach(() => {
        cy.visit('/company');
    });

    it('Search for and visit 1&1 single page', () => {
        // The blur should fix the flaking here: https://github.com/cypress-io/cypress/issues/5830
        cy.get('#aa-search-input').type('1&1').blur();
        cy.get('.aa-suggestions').contains('1&1 Internet SE').click();

        cy.url().should('include', '/company/1und1');
        cy.title().should('include', '1&1 Internet SE');
    });
});
