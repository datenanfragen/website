describe('Using the wizard', () => {
    it('Use case 1', () => {
        cy.setCookie('country', 'de');
        cy.visit('/');

        cy.get('#wizard-anchor').scrollIntoView();

        cy.get('.wizard-selected-list .button.icon-trash')
            .its('length')
            .then(old_length => {
                // Delete some of the suggested companies.
                cy.get('.wizard-selected-list > :nth-child(1) > .button.icon-trash').click();
                cy.get('.wizard-selected-list > :nth-child(3) > .button.icon-trash').click();
                cy.get('.wizard-selected-list > :nth-child(2) > .button.icon-trash').click();

                cy.get('.wizard-selected-list .button.icon-trash')
                    .its('length')
                    .should('eq', old_length - 3);
            });

        cy.get('#wizard-buttons > .button-primary').click();

        function addCompany(company, result_str) {
            cy.get('#aa-search-input').type(company);
            cy.contains(result_str).click();
        }

        // Commerce
        addCompany('amazon', 'Amazon Deutschland');
        addCompany('ebay', 'eBay GmbH');
        addCompany('h&m', 'H&M Hennes');

        cy.get('#wizard-buttons > .button-primary').click();

        // Entertainment
        addCompany('netflix', 'Netflix International');
        addCompany('spotify', 'Spotify AB');

        cy.get('#wizard-buttons > .button-primary').click();
        cy.get('#wizard-buttons > .button-primary').click();
        cy.get('#wizard-buttons > .button-primary').click();

        // Insurance
        addCompany('huk co', 'HUK-COBURG');
        addCompany('allianz', 'Allianz');

        cy.contains('SCHUFA Holding AG')
            .parent()
            .within(() => {
                cy.get('.button.icon-trash').click();
            });

        cy.contains('Done adding companies').click();

        cy.url()
            .should('include', '/generator')
            .should('include', '#!from=wizard');

        cy.get('.joyride-tooltip__close').click();

        cy.get('aside.company-info.box');

        cy.get('.dynamic-input.dynamic-input-name input[name=value]').type('Kim Mustermensch');
        cy.get('.request-transport-medium-chooser')
            .contains('Fax')
            .click();

        cy.contains('Download PDF')
            .should('not.have.class', 'disabled')
            .clickLinkWithoutFollowingHref();

        cy.contains('Next request').click();
        cy.get('aside.company-info.box').get('.company-info-content');
        cy.contains('Next request').click();

        // We are prompted if we really don't want to use our request first. We don't.
        cy.contains('New request').click();

        cy.get('aside.company-info.box').get('.accordion-title');

        cy.contains('Send email').click();
        cy.contains('Default email software').clickLinkWithoutFollowingHref();
    });
});
