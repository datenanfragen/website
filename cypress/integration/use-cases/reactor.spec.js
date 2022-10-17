const addProceeding = () =>
    cy.proceedingsStore().then((store) =>
        store.addProceeding({
            reference: '2022-29KVS000',
            status: 'waitingForResponse',
            messages: {
                '2022-29KVS000-00': {
                    id: '2022-29KVS000-00',
                    reference: '2022-29KVS000',
                    date: new Date('2022-01-01'),
                    type: 'access',
                    slug: 'datenanfragen',
                    correspondent_address: 'Datenanfragen.de e. V.\nSchreinerweg 6\n38126 Braunschweig\nDeutschland',
                    correspondent_email: 'datenschutz@datenanfragen.de',
                    transport_medium: 'email',
                    subject: 'Request to access to personal data according to Art. 15 GDPR',
                    content: undefined,
                    sentByMe: true,
                    extra: undefined,
                },
            },
        })
    );

describe('Reacting to request responses', () => {
    beforeEach(() => {
        cy.clearIndexedDb('Datenanfragen.de');
        cy.visit('/my-requests');
        // TODO: Can this be more elegant?
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(100);

        cy.proceedingsStore()
            .then((state) => state._hasHydrated)
            .should('be.equal', true);
    });

    it('Requests can be marked as completed', () => {
        addProceeding();

        cy.contains('Response pending');
        cy.contains('2022-29KVS000').click();
        cy.contains('React').click();

        cy.contains('Has there been a problem with your request?');
        cy.containsSettled('mark request as completed').click();
        cy.contains('Back to').click();

        cy.contains('My requests');
        cy.contains('2022-29KVS000').parent().contains('Done');
        cy.contains('Reactivate').should('exist');
    });

    it('Admonition followed by complaint', () => {
        addProceeding();

        cy.contains('Response pending');
        cy.contains('2022-29KVS000').click();
        cy.contains('React').click();

        cy.contains('Has there been a problem with your request?');

        cy.containsSettled('Company requires additional').click();
        cy.containsSettled('yes', '.radio-label').click();
        cy.containsSettled('no', '.radio-label').click();
        cy.containsSettled('yes', '.radio-label').click();
        cy.get('#add-dynamic-inputs-additional-id-additional-data').click();
        cy.get('#add-input-additional-id-additional-data-input').click();
        cy.contains('Custom field').click();
        cy.get('#input0-desc-additional-id-additional-data').type('{selectall}Social security number').blur();
        cy.contains('Social security number');
        cy.get('#input0-value-additional-id-additional-data').type('{selectall}078-05-1120');
        cy.contains('Next').click();
        cy.contains('Company requires additional').should('not.exist');

        cy.containsSettled('Company requires request to be signed').click();
        cy.containsSettled('no', '.radio-label:not(:contains(I don’t know))').click();
        cy.contains('Company requires request to be signed').should('not.exist');

        cy.containsSettled('Company claims request was sent via the wrong medium').click();
        cy.containsSettled('It was sent to another contact').click();
        cy.containsSettled('none of the above').click();
        cy.containsSettled('Check if there is another problem').click();
        cy.contains('Company claims request was sent via the wrong medium');

        cy.containsSettled('Company requires a copy of an identity document').click();
        cy.containsSettled('The company doesn’t know me by my real-life identity.').click();

        cy.containsSettled('Company answered in a different language').click();
        cy.contains('What language was your request in?');
        cy.get('.form-element').type('{selectall}English').blur();
        cy.containsSettled('Next').click();
        cy.contains('What language was the company’s response in?');
        cy.get('.form-element').type('{selectall}German').blur();
        cy.containsSettled('Next').click();
        cy.containsSettled('no', '.radio-label').click();

        cy.containsSettled('Generate admonition').click();

        cy.contains('Here’s your generated admonition.');
        cy.get('#send-request-modal-body')
            .should('contain.value', 'on January 01, 2022 I sent you a request according to Art. 15 GDPR')
            .should(
                'contain.value',
                'You have refused to answer my request until I provide a copy of an identity document.'
            )
            .should('contain.value', 'My request concerns data that is not linked to my real-life identity.')
            .should('contain.value', 'You have refused to answer my request unless I sign it.')
            .should('contain.value', 'I have never provided you with my signature')
            .should('contain.value', 'You have answered my request in German, even though my request was in English.')
            .should('contain.value', 'I cannot understand your response in German.')
            .should(
                'not.contain.value',
                'You have refused to answer my request claiming that it was sent to the wrong contact.'
            )
            .should('contain.value', 'I am providing the following additional information as requested by you')
            .should('contain.value', '<bold>Social security number:</bold> 078-05-1120');

        cy.contains('Send email').click();
        cy.contains('Default email software')
            .should('have.attr', 'href')
            .and('contain', 'mailto:')
            .and('contain', encodeURIComponent('on January 01, 2022'))
            .and('contain', encodeURIComponent('You have refused to answer my request unless I sign it.'))
            .and('contain', encodeURIComponent('078-05-1120'));
        cy.contains('Default email software').clickLinkWithoutFollowingHref({ force: true });

        cy.visit('/my-requests');
        cy.contains('2022-29KVS000').click();
        cy.contains('2022-29KVS000').parent().parent().contains('Admonition: Request according to Art. 15 GDPR');
        cy.contains('React').click();

        cy.containsSettled('Generate a complaint').click();
        cy.contains('wait until the deadline has passed');
        cy.containsSettled('Continue with the complaint').click();
        cy.containsSettled('Next').click();

        cy.contains(
            'you said that the company refused to answer your request until you provide a copy of an identity document'
        );
        cy.containsSettled('Issue resolved, include in complaint.').click();

        cy.contains('you said that the company refused to answer your request unless you sign it');
        cy.containsSettled('Issue persists, include in complaint.').click();
        cy.containsSettled('Use previous answers.').click();

        cy.contains('you said that the company responded to your request in a different language');
        cy.containsSettled('Ignore issue in complaint.').click();

        cy.contains('Do you want to mention any additional issues in your complaint?');
        cy.containsSettled('Generate complaint').click();

        cy.contains('we need to find the supervisory authority');
        cy.containsSettled('United Kingdom', '.radio-label').scrollIntoView().click();

        cy.contains('How do you want the supervisory authority to contact you?');
        cy.get('#name0-value-base-additional-data').type('{selectall}Kim Mustermensch');
        cy.containsSettled('Next').click();

        cy.contains('Can the supervisory authority share your details with the company?');
        cy.containsSettled('yes', '.radio-label').click();

        cy.contains('Here’s your generated complaint.');
        cy.get('#send-request-modal-body')
            .should('contain.value', 'I am hereby lodging a complaint')
            .should('contain.value', 'Datenanfragen.de e. V.')
            .should('contain.value', 'My complaint concerns a request according to Art. 15 GDPR')
            .should('contain.value', '* January 01, 2022')
            .should(
                'contain.value',
                'The controller had initially refused to answer my request unless I provide a copy of an identity document'
            )
            .should('contain.value', 'This issue has since been resolved.')
            .should('contain.value', 'The controller has refused to answer my request unless I sign it.')
            .should('contain.value', 'I have never provided them with my signature')
            .should('not.contain.value', 'answered my request in in German')
            .should('not.contain.value', 'I cannot understand the controller’s response')
            .should('not.contain.value', 'claiming that it was sent to the wrong contact')
            .should('contain.value', '<bold>Name:</bold> Kim Mustermensch');

        cy.contains('Send email').click();
        cy.contains('Default email software').should('have.attr', 'href').and('contain', 'mailto:');
        cy.contains('Default email software').clickLinkWithoutFollowingHref({ force: true });

        cy.visit('/my-requests');
        cy.contains('2022-29KVS000').click();
        cy.contains('2022-29KVS000')
            .parent()
            .parent()
            .contains('Complaint according to Art. 77 GDPR against Datenanfragen.de e. V.');
    });

    it('Free text response', () => {
        addProceeding();

        cy.contains('Response pending');
        cy.contains('2022-29KVS000').click();
        cy.contains('React').click();

        cy.contains('Has there been a problem with your request?');
        cy.containsSettled('I want to write my own message').click();

        cy.contains('Please enter the message');
        cy.get('.form-element').type('Dear Verein,\nyou violated my rights.');
        cy.containsSettled('Next').click();

        cy.contains('Here’s your generated response.');
        cy.get('#send-request-modal-body').should('contain.value', 'Dear Verein,\nyou violated my rights.');
        cy.contains('Send email').click();
        cy.contains('Default email software')
            .should('have.attr', 'href')
            .and('contain', 'mailto:')
            .and('contain', encodeURIComponent('Dear Verein'));
        cy.contains('Default email software').clickLinkWithoutFollowingHref({ force: true });

        cy.visit('/my-requests');
        cy.contains('2022-29KVS000').click();
        cy.contains('2022-29KVS000')
            .parent()
            .parent()
            .contains('Re: Request to access to personal data according to Art. 15 GDPR');
    });
});
