const reference = '2022-KKD2YF1';
const todayString = new Date().toISOString().substring(0, 10);
const today = new Date(todayString);

const accessRequest = {
    reference,
    date: todayString,
    type: 'access',
    slug: 'datenanfragen',
    recipient: 'Datenanfragen.de e. V.\nSchreinerweg 6\n38126 Braunschweig\nDeutschland',
    email: 'datenschutz@datenanfragen.de',
    via: 'email',
};

const admonition = {
    reference,
    date: todayString,
    type: 'custom',
    response_type: 'admonition',
    slug: 'datenanfragen',
    recipient: 'Datenanfragen.de e. V.\nSchreinerweg 6\n38126 Braunschweig\nDeutschland',
    email: 'datenschutz@datenanfragen.de',
    via: 'email',
};

const complaint = {
    reference,
    date: todayString,
    type: 'custom',
    response_type: 'complaint',
    slug: 'dendslfd',
    recipient: 'Die Landesbeauftragte für den Datenschutz Niedersachsen\nPostfach 221\n30002 Hannover\nDeutschland',
    email: 'poststelle@lfd.niedersachsen.de',
    via: 'email',
};

describe('Saved requests in the legacy database should be correctly migrated', () => {
    beforeEach(() => {
        // Set IndexedDB to the state localforage creates
        cy.clearIndexedDb('Datenanfragen.de');
        cy.openIndexedDb('Datenanfragen.de').as('dadeDB').createObjectStore('id-data');
        cy.getIndexedDb('@dadeDB').createObjectStore('local-forage-detect-blob-support');
        cy.getIndexedDb('@dadeDB').createObjectStore('wizard-companies');
        cy.getIndexedDb('@dadeDB').createObjectStore('my-requests').as('myRequestsStore');
    });

    it('Migrates a normal proceeding', () => {
        // Add test data
        cy.getStore('@myRequestsStore')
            .createItem(`${reference}-custom-admonition`, admonition)
            .createItem(`${reference}-access`, accessRequest)
            .createItem(`${reference}-custom-complaint`, complaint);

        // Load to start migration
        cy.visit('/');

        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(500);
        cy.proceedingsStore()
            .then((state) => state._migratedLegacyRequests)
            .should('be.equal', true);
        cy.proceedingsStore()
            .then((state) => state.proceedings)
            .should('haveOwnProperty', reference)
            .then((proceedings) => proceedings[reference])
            .should('deep.equal', {
                reference: '2022-KKD2YF1',
                messages: {
                    '2022-KKD2YF1-00': {
                        id: '2022-KKD2YF1-00',
                        reference: '2022-KKD2YF1',
                        date: today,
                        type: 'access',
                        slug: 'datenanfragen',
                        correspondent_address:
                            'Datenanfragen.de e. V.\nSchreinerweg 6\n38126 Braunschweig\nDeutschland',
                        correspondent_email: 'datenschutz@datenanfragen.de',
                        transport_medium: 'email',
                        subject: undefined,
                        content: undefined,
                        sentByMe: true,
                        extra: undefined,
                    },
                    '2022-KKD2YF1-01': {
                        reference: '2022-KKD2YF1',
                        correspondent_address:
                            'Datenanfragen.de e. V.\nSchreinerweg 6\n38126 Braunschweig\nDeutschland',
                        transport_medium: 'email',
                        type: 'admonition',
                        date: today,
                        correspondent_email: 'datenschutz@datenanfragen.de',
                        id: '2022-KKD2YF1-01',
                        sentByMe: true,
                    },
                    '2022-KKD2YF1-02': {
                        reference: '2022-KKD2YF1',
                        correspondent_address:
                            'Die Landesbeauftragte für den Datenschutz Niedersachsen\nPostfach 221\n30002 Hannover\nDeutschland',
                        transport_medium: 'email',
                        type: 'complaint',
                        date: today,
                        correspondent_email: 'poststelle@lfd.niedersachsen.de',
                        id: '2022-KKD2YF1-02',
                        sentByMe: true,
                    },
                },
                status: 'waitingForResponse',
            });
    });

    it('Migrates a single admoinition', () => {
        // Add test data
        cy.getStore('@myRequestsStore').createItem(`${reference}-custom-admonition`, admonition);

        // Load to start migration
        cy.visit('/');

        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(500);
        cy.proceedingsStore()
            .then((state) => state._migratedLegacyRequests)
            .should('be.equal', true);
        cy.proceedingsStore()
            .then((state) => state.proceedings)
            .should('haveOwnProperty', reference)
            .then((proceedings) => proceedings[reference])
            .should('deep.equal', {
                reference: '2022-KKD2YF1',
                messages: {
                    '2022-KKD2YF1-00': {
                        reference: '2022-KKD2YF1',
                        correspondent_address:
                            'Datenanfragen.de e. V.\nSchreinerweg 6\n38126 Braunschweig\nDeutschland',
                        transport_medium: 'email',
                        type: 'admonition',
                        date: today,
                        correspondent_email: 'datenschutz@datenanfragen.de',
                        id: '2022-KKD2YF1-00',
                        sentByMe: true,
                    },
                },
                status: 'done',
            });
    });

    it('Does not migrate already migrated requests', () => {
        // Add test data
        cy.getStore('@myRequestsStore')
            .createItem(`${reference}-custom-admonition`, { ...admonition, migrated: true })
            .createItem(`${reference}-access`, accessRequest)
            .createItem(`${reference}-custom-complaint`, complaint);

        // Load to start migration
        cy.visit('/');

        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(500);
        cy.proceedingsStore()
            .then((state) => state._migratedLegacyRequests)
            .should('be.equal', true);
        cy.proceedingsStore()
            .then((state) => state.proceedings)
            .should('haveOwnProperty', reference)
            .then((proceedings) => proceedings[reference])
            .should('deep.equal', {
                reference: '2022-KKD2YF1',
                messages: {
                    '2022-KKD2YF1-00': {
                        id: '2022-KKD2YF1-00',
                        reference: '2022-KKD2YF1',
                        date: today,
                        type: 'access',
                        slug: 'datenanfragen',
                        correspondent_address:
                            'Datenanfragen.de e. V.\nSchreinerweg 6\n38126 Braunschweig\nDeutschland',
                        correspondent_email: 'datenschutz@datenanfragen.de',
                        transport_medium: 'email',
                        subject: undefined,
                        content: undefined,
                        sentByMe: true,
                        extra: undefined,
                    },
                    '2022-KKD2YF1-01': {
                        reference: '2022-KKD2YF1',
                        correspondent_address:
                            'Die Landesbeauftragte für den Datenschutz Niedersachsen\nPostfach 221\n30002 Hannover\nDeutschland',
                        transport_medium: 'email',
                        type: 'complaint',
                        date: today,
                        correspondent_email: 'poststelle@lfd.niedersachsen.de',
                        id: '2022-KKD2YF1-01',
                        sentByMe: true,
                    },
                },
                status: 'waitingForResponse',
            });
    });
});
