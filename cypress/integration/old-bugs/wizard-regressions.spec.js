import { isOn, skipOn } from '@cypress/skip-test';
/*
 * In #253, we noticed the following regressions for the wizard:
 *   - The first company was skipped.
 *   - Requests that were done (i.e. the user downloaded the PDF or sent the email) weren't removed from the list.
 */

describe('Make sure there are no wizard regressions', () => {
    beforeEach(() => {
        skipOn(isOn('production'));

        cy.visit('/');

        cy.window().then((win) => {
            win.globals.country = 'de';
        });

        cy.seedWizardCompaniesWithKnownList();
    });

    it('Wizard goes through correct companies', () => {
        cy.contains('Done adding companies').click();
        cy.url().should('include', '/generator').should('include', '#!from=wizard');
        cy.get('.joyride-tooltip__close').click();

        cy.get('aside.company-info.box').get('.accordion-title').contains('Datenanfragen.de');

        function checkNext(name_contains) {
            cy.contains('Next request').click();
            cy.contains('New request').click();
            cy.get('aside.company-info.box').get('.accordion-title').contains(name_contains);
        }

        checkNext('Gabriele Altpeter, Internethandel');
        checkNext('SCHUFA Holding');
        checkNext('Niedersächsisches Ministerium für Inneres und Sport – Abteilung Verfassungsschutz');

        cy.contains('New request').click();
        cy.get('.modal').contains('New request').click();
        cy.url().should('include', '/generator').should('not.include', '#!from=wizard');
        cy.contains('And that’s it already!');
    });

    it('Requests that are done should be removed from the list', () => {
        cy.contains('Done adding companies').click();
        cy.url().should('include', '/generator').should('include', '#!from=wizard');
        cy.get('.joyride-tooltip__close').click();

        cy.contains('Next request').click();
        cy.contains('New request').click();

        cy.contains('Next request').click();
        cy.contains('New request').click();

        cy.visit('/');

        cy.get('.wizard-selected-list .button.icon-trash').should('have.length', 2);
        cy.get('.wizard-selected-list').contains('SCHUFA Holding');
        cy.get('.wizard-selected-list').contains(
            'Niedersächsisches Ministerium für Inneres und Sport – Abteilung Verfassungsschutz'
        );
    });
});
