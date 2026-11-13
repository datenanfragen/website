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

// `@cypress/skip-test` has been archived and still uses `Cypress.env()`, which clashes with `allowCypressEnv: false`,
// so we have to build our own.
Cypress.Commands.add('skipOn', (envToSkip) => {
    // Skipping inspired by (and simplified based on looking at `cy.state()`):
    // https://github.com/cypress-io/cypress-skip-test/blob/1f9bb3ee95dcbc3884c4cc2c8d1692509ba0ab44/index.js#L72-L76
    if (Cypress.expose('ENVIRONMENT') === envToSkip) cy.state('ctx').skip();
});
Cypress.Commands.add('onlyOn', (envToAllow) => {
    if (Cypress.expose('ENVIRONMENT') !== envToAllow) cy.state('ctx').skip();
});
