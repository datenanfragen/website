describe('Search for company by slug and visit company detail page', () => {
    beforeEach(() => {
        cy.visit('/company');
    });

    it('Search for and visit Facebook single page', () => {
        cy.get('#aa-search-input').type('facebook').blur();
        // The blur should fix the flaking here: https://github.com/cypress-io/cypress/issues/5830
        cy.get('.aa-suggestions').contains('Facebook Ireland Ltd.').click();

        cy.url().should('include', '/company/facebook');
        cy.title().should('include', 'Facebook Ireland Ltd.');
    });
});
