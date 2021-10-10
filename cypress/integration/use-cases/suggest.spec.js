describe('Using the suggest form', () => {
    it('navigates to the suggest form and sends its content', () => {
        cy.visit('/');
        cy.contains('a', 'Company database').click();
        cy.contains('Suggest a new company').click();

        cy.get('tr[data-schema_id="$.name"]').find('.prop-value').type('Test Company LLC');
        cy.get('tr[data-schema_id="$.address"]').find('.prop-value').type('Test Address 123\nTestcity');

        cy.intercept('/suggest', (req) => {
            req.reply({
                statusCode: 201,
                body: {
                    message: 'Successfully posted issue to GitHub',
                    number: 42,
                    url: 'MAGICSTRING',
                },
            });
        }).as('suggest-request');

        cy.get('#submit-suggest-form').click();

        cy.wait('@suggest-request').then((r) => {
            expect(r.request.body.data.name).to.equal('Test Company LLC');
            expect(r.request.body.data.address).to.equal('Test Address 123\nTestcity');
            expect(r.request.body.new).to.be.true;

            cy.contains('You can follow the progress')
                .should('have.attr', 'href')
                .and('match', /MAGICSTRING/);
            cy.contains('You can follow the progress').clickLinkWithoutFollowingHref();
        });
    });
});
