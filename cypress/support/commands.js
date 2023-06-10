import 'cypress-wait-until';
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

Cypress.Commands.add('generatorStore', (id) =>
    cy.window().then((win) => {
        // The generator store is set through a `useEffect` hook, so we need to wait for it to be set (cf.
        // https://github.com/datenanfragen/website/pull/947#issuecomment-1303275763).
        return cy
            .waitUntil(() => win.generatorStoreApi?.[id || 'default']?.getState, { timeout: 20000 })
            .then(() => win.generatorStoreApi[id || 'default'].getState());
    })
);
Cypress.Commands.add('proceedingsStore', () => cy.window().then((win) => win.getProceedingsStore()));
Cypress.Commands.add('searchAndRequestCompanies', (searchTerms, skipReview = true) => {
    for (const search of searchTerms) {
        cy.get('.ais-SearchBox-input').clear().type(search);
        cy.get('.company-result-content').contains(search).click();
    }
    cy.get('#review-n-companies-button').click();
    if (skipReview) cy.contains('Continue with these companies').click();
});
