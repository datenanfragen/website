describe('Using the donate function', () => {
    it('lets users donate via bank transfer', () => {
        cy.visit('/donate');
        cy.contains('10 €').click();
        cy.get('#donation-widget-amount').should('have.value', 10);
        cy.get('#donation-widget-amount-section > div:nth-child(3) > span:nth-child(1)')
            .invoke('text')
            .should('match', /\b10\.00\b/);
        cy.contains('Bank transfer').click();
        cy.contains('To the next step').click();
        cy.contains('Payment information');
        cy.get('#bank-transfer-data-table > tr:nth-child(6) > td:nth-child(2)')
            .invoke('text')
            .should('match', /^10\.00/);
        cy.get('#bank-transfer-data-table > tr:nth-child(2) > td:nth-child(2)').should(
            'have.text',
            'DE42 8306 5408 0104 0851 40'
        );
        cy.get('#bank-transfer-data-table > tr:nth-child(1) > td:nth-child(2)').should(
            'contain.text',
            'Datenanfragen.de e. V.'
        );
        cy.get('#bank-transfer-data-table > tr:nth-child(5) > td:nth-child(2)')
            .invoke('text')
            .then((t) => {
                const donation_table_text = t.split(' ');
                assert(donation_table_text[0] === 'Donation');
                const reference = donation_table_text[1];
                cy.contains('Donation verification').click();
                cy.url().should('match', new RegExp(`/thanks.*${reference}`));
                cy.contains('Request donation')
                    .should('have.attr', 'href')
                    .should(
                        'match',
                        new RegExp(`^mailto:vorstand@datenanfragen\\.de.*${reference}.*donation.*receipt`)
                    );
            });
        cy.contains('Request donation').clickLinkWithoutFollowingHref();
        cy.contains('Download simplified')
            .should('have.attr', 'href')
            .should('match', /\.pdf$/);
        cy.contains('Download simplified').clickLinkWithoutFollowingHref();
    });

    // TODO: check QR codes.
});
