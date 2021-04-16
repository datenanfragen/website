/*
 * #565 highlighted that we generated inadequate subjects for custom requests.
 */

describe('Proper subject for custom requests', () => {
    for (const type of ['Admonition', 'Complaint']) {
        it(`Reference should appear in subject for ${type.toLowerCase()}s`, () => {
            cy.visit('/generator#!company=datenanfragen');
            cy.get('.company-info').contains('Datenanfragen.de');
            cy.contains('Information block').click();
            cy.get('#reference')
                .invoke('val')
                .then((reference) => {
                    cy.contains('Send email').click();
                    cy.contains('Copy text manually').click({ force: true });
                    cy.contains('Ok').click();

                    cy.visit('/my-requests');

                    cy.contains(reference).parent().contains(type).click();

                    cy.contains('Send email').click();
                    cy.get('.dropdown-container').contains('Copy text manually').should('be.visible');
                    cy.contains('Copy text manually').click({ force: true });

                    cy.get('#mailto-dropdown-copymanually-subject')
                        .should('contain.value', `My reference: ${reference}`)
                        .should(
                            'contain.value',
                            type === 'Complaint'
                                ? 'Complaint according to Art. 77 GDPR against Datenanfragen.de'
                                : 'Admonition: Request according to Art. 15 GDPR'
                        );
                });
        });
    }

    for (const set_custom_subject of [true, false]) {
        it(`Reference in the subject of custom request should ${set_custom_subject ? '' : 'not '}be in parentheses if ${
            set_custom_subject ? '' : 'no '
        }subject is set`, () => {
            cy.visit('/generator');
            cy.contains('Your own text').click();

            const custom_subject = 'Hello world.';
            if (set_custom_subject) cy.get('#custom-subject-input').type(custom_subject);

            cy.contains('Information block').click();
            cy.get('#reference')
                .invoke('val')
                .then((reference) => {
                    cy.contains('Send email').click();
                    cy.get('.dropdown-container').contains('Copy text manually').should('be.visible');
                    cy.contains('Copy text manually').click({ force: true });

                    if (set_custom_subject) {
                        cy.get('#mailto-dropdown-copymanually-subject').should(
                            'contain.value',
                            `${custom_subject} (My reference: ${reference})`
                        );
                    } else {
                        cy.get('#mailto-dropdown-copymanually-subject')
                            .should('contain.value', `My reference: ${reference}`)
                            .should('not.contain.value', '(');
                    }
                });
        });
    }
});
