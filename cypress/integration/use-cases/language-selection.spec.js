describe('switching languages', () => {
    it('shows a warning', () => {
        cy.visit('/');
        cy.contains('English /');
        cy.get('footer .i18n-widget-language select').select('German (Deutsch)', {
            force: true,
        });
        cy.contains('Wenn Du die Sprache wechelst, wirst Du zu einer anderen Domain weitergeleitet.');
        // RegEx taken from https://github.com/datenanfragen/website/pull/564/files#diff-56682af89782eee8f291dc44df0b21449b4203c2bc27990c869d3cd83ba8e036R9
        cy.contains('Trotzdem wechseln')
            .should('have.attr', 'href')
            .and('match', /`${Cypress.env('baseUrl_DE') || Cypress.config().baseUrl.replace('1314', '1313')}`/);
    });
});
