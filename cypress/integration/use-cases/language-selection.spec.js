describe('switching languages', () => {
    it('shows a warning', () => {
        cy.visit('/');
        cy.contains('English /');
        cy.get('footer .i18n-widget-language select').select('German (Deutsch)', {
            force: true,
        });
        cy.contains('Changing the language will redirect you to another domain.');
        // RegEx taken from https://github.com/datenanfragen/website/pull/564/files#diff-56682af89782eee8f291dc44df0b21449b4203c2bc27990c869d3cd83ba8e036R9
        cy.contains('Change language')
            .should('have.attr', 'href')
            .and('match', /`${Cypress.env('baseUrl_DE') || Cypress.config().baseUrl.replace('1314', '1313')}`/);
    });
});
