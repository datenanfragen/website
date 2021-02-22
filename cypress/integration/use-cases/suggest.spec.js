describe('Using the suggest form', () => {
    it('navigates to the suggest form and sends its content', () => {
        cy.visit('/');
        cy.contains('a', 'Company database').click();
        cy.contains('Suggest a new company').click();

        // cypress doesn't support interception of fetch()
        // so lets do it manually
        cy.window().then((win) => {
            win.fetch = async function (x, opt) {
                if (!win.fetchlog) {
                    win.fetchlog = [[x, opt]];
                } else {
                    win.fetchlog.push([x, opt]);
                }
                return {
                    status: 201,
                    json: async function () {
                        return {
                            message: 'Successfully posted issue to GitHub',
                            number: 42,
                            url: 'MAGICSTRING',
                        };
                    },
                };
            };
        });

        cy.get('tr[data-schema_id="$.name"]').find('.prop-value').type('Test Company LLC');
        cy.get('tr[data-schema_id="$.address"]').find('.prop-value').type('Test Address 123\nTestcity');
        cy.get('#submit-suggest-form').click();
        cy.contains('You can follow the progress')
            .should('have.attr', 'href')
            .and('match', /MAGICSTRING/);
        cy.contains('You can follow the progress').clickLinkWithoutFollowingHref();

        // now check if the fetchlog contains the suggestion
        cy.window().then((win) => {
            const body = win.fetchlog[0][1].body;
            const json = JSON.parse(body);
            expect(json.data.name).to.equal('Test Company LLC');
            expect(json.data.address).to.equal('Test Address 123\nTestcity');
            expect(json.new).to.be.true;
        });
    });
});
