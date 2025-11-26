import { isOn, skipOn } from '@cypress/skip-test';

const messageTemplate = (reference, date = undefined) => ({
    reference,
    date: date || new Date(),
    type: 'access',
    slug: 'datenanfragen',
    correspondent_address: 'Datenanfragen.de e. V.\nSchreinerweg 6\n38126 Braunschweig\nDeutschland',
    correspondent_email: 'datenschutz@datenanfragen.de',
    transport_medium: 'email',
    subject: undefined,
    content: undefined,
    sentByMe: true,
    extra: undefined,
});

const makeProceeding = (reference) => ({
    reference,
    status: 'waitingForResponse',
    messages: {
        [`${reference}-00`]: {
            id: `${reference}-00`,
            ...messageTemplate(reference),
        },
    },
});

describe('Proceedings page', () => {
    beforeEach(() => {
        skipOn(isOn('production'));

        cy.clearIndexedDb('Datenanfragen.de');
        cy.visit('/my-requests');
        // Wait for proceedingsStore hydration TODO: Can this be more elegant? This seems bound to be undeterministic
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(100);

        cy.proceedingsStore()
            .then((state) => state._hasHydrated)
            .should('be.equal', true);
    });

    it('shows regular proceeding', () => {
        cy.proceedingsStore().then((store) => store.addProceeding(makeProceeding('2022-KKD2YF1')));
        cy.get('.proceeding-rows')
            .should('contain.text', '2022-KKD2YF1')
            .should('contain.text', 'Datenanfragen.de e. V.');
    });

    it('assigns correct state', () => {
        cy.proceedingsStore().then((store) => {
            store.addProceeding({
                reference: '2022-KKD2YF1',
                messages: {},
            });
            store.addMessage({
                ...messageTemplate('2022-KKD2YF1'),
                date: new Date('2022-01-14T00:00:00.000Z'),
            });
        });
        cy.get('.proceeding-rows').should('contain.text', 'Overdue').should('contain.text', 'January 14, 2022');

        cy.proceedingsStore().then((store) => {
            store.addMessage({
                ...messageTemplate('2022-KKD2YF1'),
                type: 'response',
                sentByMe: false,
            });
        });

        cy.get('.proceeding-rows').should('contain.text', 'Action needed');

        cy.proceedingsStore().then((store) => {
            store.addMessage({
                ...messageTemplate('2022-KKD2YF1'),
                type: 'admonition',
                sentByMe: true,
            });
        });

        cy.get('.proceeding-rows').should('contain.text', 'Response pending');
    });

    it('can delete selected proceedings', () => {
        const references = ['2022-KKD2YF1', '2025-1ISPYF6I', '2025-1INGZ5L6', '2025-P1TJ3BC'];
        cy.proceedingsStore().then((store) =>
            Promise.all(references.map((ref) => store.addProceeding(makeProceeding(ref))))
        );
        const assertAllProceedingsExist = () => {
            for (const ref of references) cy.get('.proceeding-rows').should('contain.text', ref);
        };
        assertAllProceedingsExist();

        const selectProceedings = () => {
            cy.contains('Select').click();
            cy.get('.proceeding-row-list-item input[type="checkbox"][data-reference="2022-KKD2YF1"]').check();
            cy.get('.proceeding-row-list-item input[type="checkbox"][data-reference="2025-P1TJ3BC"]').check();
        };

        let step = 0;
        cy.on('window:confirm', (text) => {
            // This is ugly but how you're supposed to do it
            // (https://docs.cypress.io/api/cypress-api/catalog-of-events#Window-Confirm). I haven't found a way to
            // remove the event handler. And due to Cypress' weird pseudo-promises, we can't reassign the variable
            // outside of it either.
            step++;
            expect(text).to.contains('This will delete the selected proceedings');
            return step === 2;
        });

        // Initially, we'll cancel deletion.
        selectProceedings();
        cy.get('button.icon-ellipsis').click();
        cy.contains('Delete selected proceedings').click();

        cy.reload();
        assertAllProceedingsExist();

        // This time, we'll go through with it.
        selectProceedings();
        cy.get('button.icon-ellipsis').click();
        cy.contains('Delete selected proceedings').click();

        const assertDeletionWorked = () => {
            cy.get('.proceeding-rows').should('contain.text', '2025-1ISPYF6I');
            cy.get('.proceeding-rows').should('contain.text', '2025-1INGZ5L6');
            cy.get('.proceeding-rows').should('not.contain.text', '2022-KKD2YF1');
            cy.get('.proceeding-rows').should('not.contain.text', '2025-P1TJ3BC');
        };

        cy.contains('Delete selected proceedings').should('not.exist');
        assertDeletionWorked();

        cy.reload();
        assertDeletionWorked();
    });
});
