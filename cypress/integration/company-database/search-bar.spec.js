const search_bar_selector = '#aa-search-input';
const cookie_name = 'privacy_control-search';

describe('Search bar should not be shown iff the `privacy_control-search` cookie is set to `false`', () => {
    beforeEach(() => {
        cy.clearCookies();
    });

    it('Search bar shown when cookie is not set', () => {
        cy.visit('/company');
        cy.get(search_bar_selector);
    });

    it('Search bar shown when cookie is correctly set to `true`', () => {
        cy.setCookie(cookie_name, 'true');
        cy.visit('/company');

        cy.get(search_bar_selector);
    });

    it('Search bar not shown when cookie is correctly set to `false`', () => {
        cy.setCookie(cookie_name, 'false');
        cy.visit('/company');

        cy.get(search_bar_selector).should('not.exist');
        cy.get('a[href="/privacy-controls"]');
    });
});
