describe('Using the generator', () => {
    beforeEach(() => {
        cy.visit('/generator', {
            onBeforeLoad(win) {
                Object.defineProperty(win.navigator, 'language', { value: ['de-DE'] });
            },
        });
    });

    it('Simple access requests to companies in "add-all" company pack', () => {
        cy.containsSettled('Get access');
        cy.get('.request-type-help-button').first().click();
        cy.contains('Through an access request, you can find out');
        cy.contains('Ok').click();

        cy.containsSettled('Get access').click();
        cy.contains('Start selecting companies!').should('be.disabled');
        cy.containsSettled('Add companies to your requests').first().click();

        cy.get('.modal input[type="checkbox"]')
            .its('length')
            .then((numCompanies) => {
                cy.get('.modal input[type="checkbox"]').first().click();
                cy.containsSettled(`Add ${numCompanies - 1} companies`).click();

                cy.containsSettled(`Request ${numCompanies - 1} companies`).click();
                cy.get('li.company-result')
                    .its('length')
                    .should('eq', numCompanies - 1);
                cy.get('.company-remove').first().click();
                cy.get('li.company-result')
                    .its('length')
                    .should('eq', numCompanies - 2);
            });

        cy.containsSettled('Continue with these companies').click();

        cy.contains('Fill in request to');
        cy.containsSettled('', '#name0-value-id_data').type('{selectall}Kim Mustermensch').blur();

        cy.containsSettled('Send request').click();

        cy.get('.modal').contains('Here’s your generated request.');
        // Depending on which company loads first, we may get one with `request-language == de` or one without a
        // `request-language`. And we don't have an `add-all` company pack for an English-speaking country. :(
        cy.get('#send-request-modal-subject')
            .invoke('val')
            .should(
                'satisfy',
                (subject) =>
                    subject === 'Request to access to personal data according to Art. 15 GDPR' ||
                    subject === 'Anfrage bzgl. Auskunft gemäß Art. 15 DSGVO'
            );
        cy.get('#send-request-modal-recipient').invoke('val').should('not.be.empty');

        cy.get('#send-request-modal-body')
            .invoke('val')
            .should(
                'satisfy',
                (body) =>
                    body.includes('I am hereby requesting access') || body.includes('ich bitte hiermit um Auskunft')
            );
        cy.get('#send-request-modal-body').should('contain.value', 'Kim Mustermensch');

        cy.contains('Skip request');
        cy.contains('Next request').should('not.exist');
        cy.contains('Send email').click();
        cy.contains('Default email software').clickLinkWithoutFollowingHref({ force: true });
        cy.contains('Skip request').should('not.exist');
        cy.containsSettled('Next request').click();

        cy.get('#name0-value-id_data').should('have.value', 'Kim Mustermensch');
    });

    it('Two erasure requests with various features, followed by an access request', () => {
        cy.containsSettled('Delete (parts of)').click();

        cy.get('.ais-SearchBox-input').type('{selectall}soundcloud');
        cy.containsSettled('SoundCloud Limited').click();
        cy.get('.ais-SearchBox-input').type('{selectall}spiegel.de');
        cy.containsSettled('DER SPIEGEL GmbH & Co. KG').click();

        cy.contains('Request 2 companies').click();

        cy.contains('Companies you selected');
        cy.contains('DER SPIEGEL');
        cy.containsSettled('SoundCloud Limited').click();
        cy.containsSettled('SoundCloud Go+').click();

        cy.containsSettled('Continue with these companies').click();

        cy.contains('Erase all data');
        cy.get('#request-objection-reason').should('not.exist');
        cy.contains('Additionally include an objection').click();
        cy.get('#request-objection-reason').type('{selectall}[my objection reason here]');

        cy.containsSettled('Send request').click();

        cy.get('.modal').contains('Here’s your generated request.');
        cy.get('#send-request-modal-subject').should(
            'have.value',
            'Request for erasure of personal data according to Art. 17 GDPR'
        );
        cy.get('#send-request-modal-recipient').invoke('val').should('not.be.empty');
        cy.get('#send-request-modal-body')
            .should('contain.value', 'I am hereby requesting immediate erasure')
            .should('contain.value', '[my objection reason here]')
            .should('contain.value', 'SoundCloud Limited')
            .should('contain.value', 'SoundCloud Inc.') // the `runs` entry we didn't deselect
            .should('not.contain.value', 'SoundCloud Go+')
            .should('not.contain.value', 'Please delete the following personal data')
            .should('contain.value', 'Please erase all personal data');

        cy.containsSettled('Skip request').click();

        cy.contains('Erase all data').click().click().click();
        cy.get('#request-erasure-data').type('{selectall}All tracking data concerning me.');

        cy.containsSettled('Send request').click();

        cy.get('#send-request-modal-body')
            .should('contain.value', 'I am hereby requesting immediate erasure')
            .should('contain.value', 'DER SPIEGEL')
            .should('contain.value', 'Please delete the following personal data')
            .should('not.contain.value', 'Please erase all personal data')
            .should('contain.value', 'All tracking data concerning me.');

        cy.containsSettled('Skip request').click();

        cy.contains('What’s next?');
        cy.containsSettled('Send more requests').click();

        cy.containsSettled('Get access').click();
        cy.contains('Start selecting companies!').should('be.disabled');
        cy.get('.ais-SearchBox-input').type('{selectall}amazon.de');
        cy.containsSettled('Amazon Europe Core SARL').click();
        cy.containsSettled('Request 1 company').click();
        cy.containsSettled('Continue with these companies').click();

        cy.contains('Erase all data').should('not.exist');
        cy.contains('Additionally include an objection').should('not.exist');

        cy.containsSettled('Send request').click();
        cy.get('#send-request-modal-subject').should(
            'have.value',
            'Request to access to personal data according to Art. 15 GDPR'
        );
        cy.get('#send-request-modal-body').should('contain.value', 'I am hereby requesting access');
    });

    it('Rectification request to custom company, appears in “My requests”', () => {
        cy.containsSettled('Correct data').click();

        cy.containsSettled('Add a custom company').click();

        cy.get('.modal').contains('Fill in the company’s details here.');
        cy.get('#custom-company-input-name').type('Darkenanfragen AG');
        cy.get('#custom-company-input-email').type('privacy@darkenanfragen.tld');

        cy.contains('Letter').click();
        cy.get('#custom-company-input-email').should('not.exist');
        cy.get('#custom-company-input-address').type('Musterstraße 1{enter}12345 Musterstadt');

        cy.contains('Fax').click();
        cy.get('#custom-company-input-fax');
        cy.get('#custom-company-input-address').should('contain.value', 'Musterstadt');

        cy.contains('Email').click();
        cy.get('#custom-company-input-email').should('have.value', 'privacy@darkenanfragen.tld');
        cy.get('#custom-company-input-address').should('not.exist');
        cy.get('#custom-company-input-fax').should('not.exist');

        cy.contains('Add company').click();
        cy.contains('Request 1 company');

        cy.contains('Add a custom company').click();
        cy.get('#custom-company-input-name').type('ACME Inc.');
        cy.contains('Cancel').click();

        cy.contains('Request 1 company').click();
        cy.contains('Companies you selected');
        cy.contains('Darkenanfragen AG');
        cy.contains('ACME Inc.').should('not.exist');

        cy.containsSettled('Continue with these companies').click();

        cy.contains('Fill in request to “Darkenanfragen AG”');

        cy.get('#add-dynamic-inputs-id_data').click();
        cy.get('#add-input-id_data-input').click().blur();
        cy.contains('Custom field').click();
        cy.get('#input3-desc-id_data').type('{selectall}Social security number').blur();
        cy.contains('Social security number');
        cy.get('#input3-value-id_data').type('{selectall}078-05-1120');

        cy.contains('Correct data');
        cy.get('#add-dynamic-inputs-rectification_data').click();
        cy.get('#add-input-rectification_data-address').click().blur();
        cy.contains('Custom field').click();
        cy.get('#address0-desc-rectification_data').type('{selectall}New address').blur();
        cy.contains('New address');
        cy.get('#address0-street_1-rectification_data').type('{selectall}123 New Lane');

        cy.containsSettled('Send request').click();
        cy.get('.modal').contains('Here’s your generated request.');
        cy.get('#send-request-modal-subject').should(
            'have.value',
            'Request for rectification of personal data according to Art. 16 GDPR'
        );
        cy.get('#send-request-modal-recipient').should('have.value', 'privacy@darkenanfragen.tld');
        cy.get('#send-request-modal-body')
            .should('contain.value', 'Darkenanfragen AG')
            .should('not.contain.value', 'Musterstraße 1')
            .should('contain.value', 'I am hereby requesting rectification')
            .should('contain.value', 'Please make the following changes')
            .should('contain.value', 'New address: \n123 New Lane')
            .should('contain.value', 'Social security number: 078-05-1120');

        cy.contains('Send email').click();
        cy.contains('Default email software').clickLinkWithoutFollowingHref({ force: true });
        cy.containsSettled('Next request').click();

        cy.contains('What’s next?');
        cy.contains('Send more requests');
        cy.containsSettled('View your requests').click();

        cy.contains('My requests');
        cy.contains('Darkenanfragen AG');
    });

    it('Direct marketing objection as PDF, after initially selecting erasure', () => {
        cy.containsSettled('Delete (parts of)').click();

        cy.get('.ais-SearchBox-input').type('{selectall}skype');
        cy.containsSettled('Microsoft Ireland Operations').click();
        cy.get('.ais-SearchBox-input').type('{selectall}joyn');
        cy.contains('Joyn GmbH').click();
        cy.contains('Request 2 companies').click();

        cy.contains('Companies you selected');
        cy.get('.wizard-header .app-back-button').click();
        cy.contains('Who do you want to address your request to?');
        cy.get('.wizard-header .app-back-button').click();
        cy.contains('What do you want to do?');

        cy.containsSettled('Stop receiving direct marketing.').click();

        cy.contains('Request 2 companies').click();
        cy.contains('Microsoft Ireland Operations');
        cy.contains('Joyn GmbH');

        cy.containsSettled('Continue with these companies').click();

        cy.contains('Erase all data').should('not.exist');
        cy.contains('Additionally include an objection').should('not.exist');
        cy.contains('Signature');

        cy.containsSettled('Send request').click();

        cy.get('.modal').contains('Here’s your generated request. Download the PDF');
        cy.get('#send-request-modal-subject').should(
            'have.value',
            'Objection against direct marketing according to Art. 21(2) GDPR'
        );
        cy.get('#send-request-modal-recipient').should('contain.value', 'One Microsoft Place');
        cy.get('#send-request-modal-body')
            .should('contain.value', 'I am hereby objecting')
            .should('not.contain.value', 'Please delete the following personal data')
            .should('not.contain.value', '[object Object]');

        cy.contains('Download PDF', { timeout: 10000 })
            .should('not.have.class', 'disabled')
            .should('have.attr', 'href')
            // eslint-disable-next-line optimize-regex/optimize-regex
            .and('match', /^blob:https?:\/\/[\S]+?\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    });

    it('Requests get stored correctly', () => {
        cy.containsSettled('Get access').click();
        cy.searchAndRequestCompanies(['Commerzbank', 'Allianz SE', 'Oracle Corporation', 'CRIF GmbH', 'bonprix']);

        const check = (action, shouldBeStored) => {
            cy.containsSettled('Send request').click();
            cy.generatorStore()
                .then((state) => state.request.reference)
                .then((reference) =>
                    cy
                        .proceedingsStore()
                        .then((state) => state.proceedings)
                        .should('not.haveOwnProperty', reference)
                );
            // The button gets rerendered before Cypress can click it. I haven't found a reliable way to wait for the
            // rerender.
            // eslint-disable-next-line cypress/no-unnecessary-waiting
            cy.wait(500);
            action();
            cy.generatorStore()
                .then((state) => state.request.reference)
                .then((reference) =>
                    cy
                        .proceedingsStore()
                        .then((state) => state.proceedings)
                        .should(shouldBeStored ? 'haveOwnProperty' : 'not.haveOwnProperty', reference)
                );
            cy.containsSettled(shouldBeStored ? 'Next request' : 'Skip request').click();
        };

        // mailto
        check(() => {
            cy.contains('Send email').click();
            cy.containsSettled('Default email software').clickLinkWithoutFollowingHref({ force: true });
        }, true);

        // webmailer
        check(() => {
            cy.contains('Send email').click();
            cy.containsSettled('Google Mail').clickLinkWithoutFollowingHref({ force: true });
        }, true);

        // PDF
        check(() => {
            cy.contains('Download PDF').should('not.have.class', 'disabled');
            cy.containsSettled('Download PDF').clickLinkWithoutFollowingHref({ force: true });
        }, true);

        // copy text
        check(() => {
            cy.get('#send-request-modal-body').trigger('copy');
        }, true);

        // nothing
        check(() => {}, false);
    });
});
