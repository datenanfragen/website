function snap(url) {
    cy.visit(url);
    cy.percySnapshot(url);
}

describe('Visual diffs using Percy', () => {
    it('Snapshots', () => {
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
