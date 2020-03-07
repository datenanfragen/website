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
        prevSubject: true
    },
    subject => {
        cy.wrap(subject)
            .invoke('removeAttr', 'href')
            .click();
    }
);
