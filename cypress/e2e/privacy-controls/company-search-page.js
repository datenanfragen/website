describe('Search bar on company search page', () => {
    it('is active by default', () => {
        cy.visit('/generator');
        cy.containsSettled('Get access').click();

        cy.get('.ais-SearchBox-input').type('twitter');
        cy.contains('Twitter International Company');
    });

    it('is not active when the privacy control is disabled', () => {
        cy.setCookie('privacy_control-search', 'false');
        cy.visit('/generator');
        cy.containsSettled('Get access').click();

        cy.get('.ais-SearchBox-input').should('not.exist');
        cy.contains('You have disabled the search feature.');
    });
});
