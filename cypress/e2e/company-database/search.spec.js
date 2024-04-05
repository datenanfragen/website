import { isOn, skipOn } from '@cypress/skip-test';

describe('Search for company by slug and visit company detail page', () => {
    beforeEach(() => {
        cy.visit('/company');
    });

    it('Search for and visit 1&1 single page', () => {
        // TODO: There is really no reason why this shouldn't work in prod, but typing in the search box consistently
        // doesn't result in any results being displayed in prod, while it works fine locally. No idea why.
        skipOn(isOn('production'));

        // The blur should fix the flaking here: https://github.com/cypress-io/cypress/issues/5830
        cy.get('#aa-search-input').type('1&1').blur();
        cy.get('.aa-suggestions').contains('1&1 Internet Ltd.').click();

        cy.url().should('include', '/company/1and1-gb');
        cy.title().should('include', '1&1 Internet Ltd.');
    });
});
