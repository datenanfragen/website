describe('Feedback for privacy controls', () => {
    it('Ask for confirmation from the user before actually clearing data and give feedback', () => {
        function expectAndDismissFlash() {
            cy.get('.flash-message.flash-success button.close-button').click();
            // Wait for the flash to actually be dismissed.
            cy.get('.flash-message.flash-success').should('not.exist');
        }

        cy.visit('/privacy-controls');

        cy.get('#search-checkbox').click();
        expectAndDismissFlash();

        cy.get(
            '#privacy-controls-buttons .button, #privacy-controls-buttons button, .privacy-control input[type="checkbox"]'
        ).each(($el) => {
            // The 'search' privacy control and the 'clear cookies' button don't ask for confirmation—we exclude those.
            if (!['clear-cookies-button', 'search-checkbox'].includes($el.attr('id'))) {
                cy.wrap($el).click();

                // The checkboxes produce an initial flash for the setting, dismiss that.
                if ($el.prop('tagName') === 'INPUT') {
                    cy.get('.flash-message.flash-success button.close-button').click();
                    expectAndDismissFlash();
                }

                cy.get('.modal .button-primary').click();

                // After actually clearing, another flash is produced.
                expectAndDismissFlash();
            }
        });
    });
});
