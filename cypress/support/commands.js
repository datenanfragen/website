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
        cy.containsSettled(search, '.company-result-content').click();
    }
    cy.get('#review-n-companies-button').click();
    if (skipReview) cy.containsSettled('Continue with these companies').click();
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
