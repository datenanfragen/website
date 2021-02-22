// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import '@percy/cypress';

/**
 * Click a link without following its `href`. This is useful for `mailto` links and file downloads as Cypress doesn't
 * support those.
 *
 * Note: This will currently *not* restore the `href` after clicking!
 */
Cypress.Commands.add(
    'clickLinkWithoutFollowingHref',
    {
        prevSubject: true,
    },
    (subject) => {
        cy.wrap(subject).invoke('removeAttr', 'href').click();
    }
);

/**
 * This command will add a company to the wizard by searching for `company` and clicking the result containing
 * `result_str`.
 *
 * Make sure that you are on the homepage and in a tab that can find this company.
 */
Cypress.Commands.add('addCompanyToWizard', (company, result_str) => {
    cy.get('#aa-search-input').clear().type(company);
    cy.contains(result_str).click();
});

/**
 * This command will make sure that the company list in the wizard contains exactly the following elements:
 *   - Datenanfragen.de e. V.
 *   - Gabriele Altpeter, Internethandel
 *   - SCHUFA Holding AG
 *   - Niedersächsisches Ministerium für Inneres und Sport – Abteilung Verfassungsschutz
 *
 * This will cause navigation to occur.
 */
Cypress.Commands.add('seedWizardCompaniesWithKnownList', () => {
    cy.visit('/contact');
    cy.window()
        .then((win) => {
            return win.accessLocalForageStore('wizard-companies').then((instance) => {
                const promises = [
                    instance.clear(),

                    instance.setItem('datenanfragen', 'Datenanfragen.de e. V.'),
                    instance.setItem('gabriele-altpeter-internethandel', 'Gabriele Altpeter, Internethandel'),
                    instance.setItem('schufa', 'SCHUFA Holding AG'),
                    instance.setItem(
                        'verfassungsschutz-nds',
                        'Niedersächsisches Ministerium für Inneres und Sport – Abteilung Verfassungsschutz'
                    ),
                ];
                return Promise.all(promises);
            });
        })
        .then(() => {
            cy.clearCookies();
            cy.setCookie('changed_saved_companies', 'true');
            cy.visit('/');

            cy.get('#wizard').scrollIntoView();
        });
});
