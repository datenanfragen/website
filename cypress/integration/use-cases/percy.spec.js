import { isOn, skipOn } from '@cypress/skip-test';

function snap(url) {
    cy.visit(url);
    cy.percySnapshot(url);
}

describe.skip('Visual diffs using Percy', async () => {
    it('Snapshots', async () => {
        skipOn(isOn('production'));

        // Cypress doesn't clear indexedDB in-between test runs (see https://github.com/cypress-io/cypress/issues/1208).
        // As localforage tends to choose indexedDB as the storage backend, this means that we are persisting state
        // between tests, causing the Percy snapshots to look differently depending on which tests ran first. So, until
        // Cypress fixes that problem, we need to clear indexedDB ourselves.
        indexedDB.deleteDatabase('Datenanfragen.de');

        snap('/');
        snap('/generator');
        snap('/my-requests');
        snap('/id-data-controls');
        snap('/privacy-controls');

        snap('/company/datenanfragen');
        snap('/contribute');
        snap('/sample-letters');

        snap('/verein');
        snap('/donate');
        snap('/verein/transparency');
    });
});
