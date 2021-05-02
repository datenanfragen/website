describe('switching languages', () => {
    it('shows a warning', () => {
        cy.visit('/');
        cy.contains('English /');
        cy.get('footer .i18n-widget-language select').select('German (Deutsch)', { force: true });
        cy.contains('Changing the language will redirect you to another domain.');
        cy.contains('Change language');
    });
});
