const PRIVACY_CONTROLS = require('../../fixtures/privacy-controls.json');

describe('Toggling privacy controls', () => {
    it('Should update the respective cookies', () => {
        cy.visit('/privacy-controls');

        PRIVACY_CONTROLS.forEach((c) => {
            const selector = '#' + c.checkbox_id;

            cy.get(selector).should(c.default_value ? 'be.checked' : 'not.be.checked');

            [!c.default_value, c.default_value].forEach((val) => {
                cy.get(selector).click();

                if (c.checkbox_id !== 'search-checkbox' && !val) cy.get('.modal .close-button').click();

                if (val !== c.default_value)
                    cy.getCookie(c.cookie_name)
                        .its('value')
                        .should('eq', '' + val);
                else cy.getCookie(c.cookie_name).should('not.exist');
            });
        });
    });
});
