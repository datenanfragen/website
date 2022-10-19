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

import '@this-dot/cypress-indexeddb';
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
    (subject, click_options) => {
        cy.wrap(subject).invoke('removeAttr', 'href').click(click_options);
    }
);

Cypress.Commands.add('generatorStore', () => cy.window().then((win) => win.generatorStoreApi.getState()));
Cypress.Commands.add('proceedingsStore', () => cy.window().then((win) => win.getProceedingsStore()));
Cypress.Commands.add('searchAndRequestCompanies', (searchTerms, skipReview = true) => {
    for (const search of searchTerms) {
        cy.get('.ais-SearchBox-input').clear().type(search);
        cy.get('.company-result-content').contains(search).click();
    }
    cy.get('#review-n-companies-button').click();
    if (skipReview) cy.contains('Continue with these companies').click();
});

// Cypress can get confused about rerendered elements, causing chained commands to fail because the found element has
// already been detached from the DOM and replaced. They are working on fixing that
// (https://github.com/cypress-io/cypress/pull/24203), in the meantime, this is a workaround that waits for the element
// to become "settled". Adapted after: https://github.com/cypress-io/cypress/issues/7306#issuecomment-850621378
// TODO: Remove this once the Cypress issue is fixed.
Cypress.Commands.add('containsSettled', (text, selector = '') => {
    const isAttached = (resolve, count = 0) => {
        const el = Cypress.$(`${selector}:contains(${text}):last`);
        count = Cypress.dom.isAttached(el) ? count + 1 : 0;

        if (count >= 3) return resolve(el);

        setTimeout(() => isAttached(resolve, count), 100);
    };

    return cy.wrap(null).then(() => new Cypress.Promise((res) => isAttached(res, 0)).then((el) => cy.wrap(el)));
});
