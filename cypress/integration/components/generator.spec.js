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

    it("shows and hides the 'Correct data' field according to the type of request", () => {
        cy.contains('Correct data').should('not.exist');
        cy.get('#dynamic-input-type-rectification_data').should('not.exist');

        cy.contains('Rectification request').click();

        // shows up only when 'Rectification request' is selected
        cy.contains('Correct data');
        cy.get('#dynamic-input-type-rectification_data');

        cy.contains('Erasure request').click();

        // check if its hidden again
        cy.contains('Correct data').should('not.exist');
        cy.get('#dynamic-input-type-rectification_data').should('not.exist');
    });

    it("shows a different form when 'Your own text' is selected", () => {
        cy.get('#custom-template-select').should('not.exist');
        cy.get('#custom-subject-input').should('not.exist');
        cy.get('#custom-content-input').should('not.exist');
        cy.get('#custom-sender-name').should('not.exist');
        cy.get('#0-container-custom-request').should('not.exist');

        cy.contains('Your own text').click();

        cy.get('#custom-template-select');
        cy.get('#custom-subject-input');
        cy.get('#custom-content-input');
        cy.get('#custom-sender-name');
        cy.get('#0-container-custom-request');

        cy.contains('Erasure request').click();

        // check if it is hidden again
        cy.get('#custom-template-select').should('not.exist');
        cy.get('#custom-subject-input').should('not.exist');
        cy.get('#custom-content-input').should('not.exist');
        cy.get('#custom-sender-name').should('not.exist');
        cy.get('#0-container-custom-request').should('not.exist');
    });

    it("changes the text when selecting a template for 'Your own text'", () => {
        cy.contains('Your own text').click();

        // is empty when no template selected
        cy.get('#custom-content-input').should('be.empty');

        cy.get('#custom-template-select').select('Admonition');
        cy.get('#custom-content-input')
            .should('contain.value', 'To Whom It May Concern:')
            .should('contain.value', 'admonition');

        cy.get('#custom-template-select').select('Complaint');
        cy.get('#custom-content-input')
            .should('contain.value', 'To Whom It May Concern:')
            .should('contain.value', 'complaint');
    });

    it("reflects the text and subject entered for 'Your own text' in the generated request", () => {
        cy.contains('Your own text').click();

        const custom_subject = 'My custom subject';
        const custom_content = 'My custom content';
        cy.get('#custom-subject-input').type(custom_subject);
        cy.get('#custom-content-input').type(custom_content);

        cy.contains('Send email').click();
        cy.contains('Copy text manually').click({ force: true });

        cy.get('#mailto-dropdown-copymanually-subject').should('contain.value', `${custom_subject}`);
        cy.get('#mailto-dropdown-copymanually-body').should('contain.value', `${custom_content}`);
    });

    it("changes the text based on the 'Erase all data' checkbox and the 'Data to erase' field when 'Erasure request' is selected", () => {
        cy.contains('Erasure request').click();
        cy.get('#request-flags-erase-all').should('be.checked');
        cy.get('#request-erasure-data').should('not.exist');

        cy.contains('Send email').click();
        cy.contains('Copy text manually').click({ force: true });
        // TODO: The modal get rerendered a few times and Cypress loses the reference before clicking. I'm not sure but
        // I don't think the problem lies with `Modal` or `MailtoDropdown`. I think the problem is that the generator
        // rerenders the `MailtoDropdown` seven times after "Copy text manually" is clicked. If I insert a
        // `MailtoDropdown` somewhere else, it seems to behave normally.
        // Since @zner0L is working on the generator right now, it doesn't make sense to try and fix that.
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(1000);

        // when the 'Erase all data' checkbox is selected
        cy.get('#mailto-dropdown-copymanually-body').should('contain.value', 'all personal data');
        cy.get('.modal button.icon-close').click();

        cy.contains('New request').click();
        cy.contains('Erasure request').click();

        const custom_data_to_erase = 'Custom Data';
        cy.get('#request-flags-erase-all').uncheck();
        cy.get('#request-erasure-data').type(custom_data_to_erase);

        cy.contains('Send email').click();
        cy.contains('Copy text manually').click({ force: true });

        // when 'Erase all data' is unchecked
        cy.get('#mailto-dropdown-copymanually-body').should('contain.value', `${custom_data_to_erase}`);
        cy.get('#mailto-dropdown-copymanually-body').should('not.contain.value', 'all personal data');
    });
});
