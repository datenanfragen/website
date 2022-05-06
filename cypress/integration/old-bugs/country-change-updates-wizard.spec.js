import { isOn, skipOn } from '@cypress/skip-test';
/*
 * In GitLab#103, we noticed that changing the country did not update the suggested companies in the wizard.
 */

describe('Changing the country should update the companies in the wizard', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.get('#wizard').scrollIntoView();
    });

    it('"All" should have no suggested companies', () => {
        skipOn(isOn('production'));

        cy.window().then((win) => {
            win.getAppStore().changeCountry('all');

            cy.contains('#wizard-user-country', 'all');
            cy.get('.wizard-selected-list .button.icon-trash').should('not.exist');
        });
    });

    it('"Germany" should have a few suggested companies', () => {
        skipOn(isOn('production'));

        cy.window().then((win) => {
            win.getAppStore().changeCountry('de');

            cy.contains('#wizard-user-country', 'Germany');
            cy.get('.wizard-selected-list .button.icon-trash').should('have.length.greaterThan', 2);
        });
    });

    it(
        'Changing the country after manually modifying the suggested companies',
        { retries: { runMode: 5, openMode: 0 } },
        () => {
            skipOn(isOn('production'));

            cy.window().then((win) => {
                win.getAppStore().changeCountry('de');

                cy.get('.wizard-selected-list .button.icon-trash')
                    .its('length')
                    .then((old_length) => {
                        cy.get('.wizard-selected-list .button.icon-trash').first().click();

                        cy.getCookie('changed_saved_companies').its('value').should('eq', 'true');

                        cy.window().then((w) => {
                            w.getAppStore().changeCountry('all');

                            cy.contains('#wizard-user-country', 'all');

                            cy.get('.wizard-selected-list .button.icon-trash')
                                .its('length')
                                .should('eq', old_length - 1);
                        });
                    });
            });
        }
    );
});
