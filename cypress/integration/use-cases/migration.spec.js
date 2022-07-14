const reference = '2022-KKD2YF1';

const accessRequest = {
    reference,
    date: '2022-07-14',
    type: 'access',
    slug: 'datenanfragen',
    recipient: 'Datenanfragen.de e. V.\nSchreinerweg 6\n38126 Braunschweig\nDeutschland',
    email: 'datenschutz@datenanfragen.de',
    via: 'email',
};

const admonition = {
    reference,
    date: '2022-07-14',
    type: 'custom',
    response_type: 'admonition',
    slug: 'datenanfragen',
    recipient: 'Datenanfragen.de e. V.\nSchreinerweg 6\n38126 Braunschweig\nDeutschland',
    email: 'datenschutz@datenanfragen.de',
    via: 'email',
};

const complaint = {
    reference,
    date: '2022-07-14',
    type: 'custom',
    response_type: 'complaint',
    slug: 'dendslfd',
    recipient: 'Die Landesbeauftragte für den Datenschutz Niedersachsen\nPostfach 221\n30002 Hannover\nDeutschland',
    email: 'poststelle@lfd.niedersachsen.de',
    via: 'email',
};

describe('Saved requests in the legacy database should be correctly migrated', () => {
    beforeEach(() => {
        cy.visit('/');
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(500);
        // Clear the persisted data so that migration will start again
        cy.window().then((win) => win.accessLocalForageStore('proceedings').clear());
    });

    it('Migrate a normal proceeding', () => {
        // Add test data
        cy.window().then((win) =>
            win
                .accessLocalForageStore('my-requests')
                .setItem(`${reference}-access`, accessRequest)
                .then(() =>
                    win.accessLocalForageStore('my-requests').setItem(`${reference}-custom-admonition`, admonition)
                )
                .then(() =>
                    win.accessLocalForageStore('my-requests').setItem(`${reference}-custom-complaint`, complaint)
                )
        );

        // Reload to start migration
        cy.visit('/');

        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(500);
        cy.window()
            .then((win) => win.getProceedingsStore()._migratedLegacyRequests)
            .should('be.equal', true);
        cy.window()
            .then((win) => win.getProceedingsStore().proceedings)
            .should('haveOwnProperty', reference)
            .then((proceedings) => proceedings[reference])
            .should('deep.equal', {
                reference: '2022-KKD2YF1',
                messages: {
                    '2022-KKD2YF1-00': {
                        id: '2022-KKD2YF1-00',
                        reference: '2022-KKD2YF1',
                        date: new Date('2022-07-14T00:00:00.000Z'),
                        type: 'access',
                        slug: 'datenanfragen',
                        recipient: 'Datenanfragen.de e. V.\nSchreinerweg 6\n38126 Braunschweig\nDeutschland',
                        email: 'datenschutz@datenanfragen.de',
                        transport_medium: 'email',
                        subject: undefined,
                        content: undefined,
                    },
                    '2022-KKD2YF1-01': {
                        reference: '2022-KKD2YF1',
                        recipient: 'Datenanfragen.de e. V.\nSchreinerweg 6\n38126 Braunschweig\nDeutschland',
                        transport_medium: 'email',
                        type: 'admonition',
                        date: new Date('2022-07-14T00:00:00.000Z'),
                        email: 'datenschutz@datenanfragen.de',
                        id: '2022-KKD2YF1-01',
                    },
                    '2022-KKD2YF1-02': {
                        reference: '2022-KKD2YF1',
                        recipient:
                            'Die Landesbeauftragte für den Datenschutz Niedersachsen\nPostfach 221\n30002 Hannover\nDeutschland',
                        transport_medium: 'email',
                        type: 'complaint',
                        date: new Date('2022-07-14T00:00:00.000Z'),
                        email: 'poststelle@lfd.niedersachsen.de',
                        id: '2022-KKD2YF1-02',
                    },
                },
                status: 'waitingForResponse',
            });
    });
});
