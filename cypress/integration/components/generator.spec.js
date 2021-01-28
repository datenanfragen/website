import { isOn, skipOn } from '@cypress/skip-test';

describe('Generator component', () => {
    beforeEach(() => {
        cy.visit('/generator');
    });

    it('has generated a blob URL', () => {
        cy.get('.request-transport-medium-chooser').contains('Fax').click();

        // Now that the PDF worker is only loaded on demand, the default timeout of 4 seconds is cutting it fairly
        // close.
        cy.contains('Download PDF', { timeout: 10000 })
            .should('not.have.class', 'disabled')
            .should('have.attr', 'href')
            .and('match', /^blob:https?:\/\/[\S]+?\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    });

    it('did not load pdfworker for email', () => {
        skipOn(isOn('production'));

        cy.window().then((win) => {
            expect(win.pdfWorker).to.be.undefined;
        });
    });

    it('did load pdfworker for fax', () => {
        skipOn(isOn('production'));

        cy.get('.request-transport-medium-chooser').contains('Fax').click();

        cy.window().then((win) => {
            expect(win.pdfWorker).not.to.be.undefined;
            // somehow it does not work with this: expect(win.pdfWorker).to.satisfy((o) => o instanceof Worker);
            // "console.log(win.pdfWorker instanceof Worker)" logs false...
            // time to 🦆 type...
            expect(win.pdfWorker).respondTo('postMessage');
            expect(win.pdfWorker).respondTo('terminate');
            expect(win.pdfWorker).respondTo('onmessage');
            expect(win.pdfWorker).respondTo('onerror');
        });
    });

    it("reflects 'Get data in a machine-readable format' checkbox in the generated request [false]", () => {
        cy.get('#request-flags-data-portability').uncheck();
        cy.contains('Send email').click();
        cy.contains('Default email software')
            .should('have.attr', 'href')
            .and('not.match', /^.*?machine-readable.*$/);
    });

    it("reflects 'Get data in a machine-readable format' checkbox in the generated request [true]", () => {
        cy.get('#request-flags-data-portability').check();
        cy.contains('Send email').click();
        cy.contains('Default email software')
            .should('have.attr', 'href')
            .and('match', /^.*?machine-readable.*$/);
    });

    it('loads company from slug', () => {
        cy.visit('/generator/#!company=facebook');
        cy.reload();
        cy.contains('Facebook Ireland Ltd.');
    });

    it('loads companies from slug', () => {
        cy.visit('/generator/#!companies=facebook,google');
        cy.reload();
        cy.contains('Facebook Ireland Ltd.');
        cy.contains('Next request').click();
        cy.contains('New request').click();
        cy.contains('Google LLC');
    });

    it("reflects the 'Information block' values in the generated request", () => {
        cy.contains('Information block').click();
        cy.contains('Request date');
        cy.get('#request-date').type('2222-02-22');
        cy.get('textarea#information-block').type('MAGICSTRING{enter}SECONDMAGICSTRING');

        cy.contains('Send email').click();
        cy.contains('Default email software')
            .should('have.attr', 'href')
            .and('contains', 'Date%3A%202222-02-22%0AMAGICSTRING%0ASECONDMAGICSTRING');
    });

    it('shows and hides the signature field according to the transport medium', () => {
        cy.contains('Signature').should('not.exist');
        cy.contains('Reset signature').should('not.exist');
        cy.get('#signature').should('not.exist');

        cy.contains('Fax').click();

        cy.contains('Signature');
        cy.contains('Reset signature');
        cy.get('#signature');

        cy.contains('Email').click();

        // check if its hidden again
        cy.contains('Signature').should('not.exist');
        cy.contains('Reset signature').should('not.exist');
        cy.get('#signature').should('not.exist');

        cy.contains('Letter').click();

        cy.contains('Signature');
        cy.contains('Reset signature');
        cy.get('#signature');

        cy.contains('Email').click();

        // check if its hidden again
        cy.contains('Signature').should('not.exist');
        cy.contains('Reset signature').should('not.exist');
        cy.get('#signature').should('not.exist');
    });
});
