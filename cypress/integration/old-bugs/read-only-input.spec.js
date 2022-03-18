/*
 * We previously used `:read-only` and `:moz-read-only` to match readonly elements in CSS. As it turned out, that doesn't really work.
 * Firefox needs annoying special cases and Firefox and Safari match way too much (see GitLab#125).
 *
 * Therefore, we have decided to manually apply a `readonly` class to readonly elements.
 */

describe('Readonly inputs', () => {
    beforeEach(() => {
        cy.visit('/generator');
    });

    it('Regular checkbox should not have readonly styling', () => {
        cy.get('#request-flags-data-portability').then(($el) => {
            // I am using the cursor property here since I expect that to be the least likely one to change (while the
            // colors might).
            expect($el).to.have.css('cursor', 'auto');
        });
    });

    it('Readonly checkbox should have appropriate styling', () => {
        cy.get('.accordion > .accordion-title-link').click();
        cy.get('#reference').then(($el) => {
            expect($el).to.have.css('cursor', 'not-allowed');
        });
    });
});
