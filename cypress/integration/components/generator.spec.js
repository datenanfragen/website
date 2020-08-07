describe('Generator component', () => {
    beforeEach(() => {
        cy.visit('/generator');
    });

    it('has generated a blob URL', () => {
        cy.get('.request-transport-medium-chooser')
            .contains('Fax')
            .click();

        cy.contains('Download PDF')
            .should('not.have.class', 'disabled')
            .should('have.attr', 'href')
            .and('match', /^blob:https?:\/\/[\S]+?\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    });
});
