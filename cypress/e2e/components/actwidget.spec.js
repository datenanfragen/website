describe('ActWidget component', () => {
    beforeEach(() => {
        cy.visit('/act/honey');
    });

    it('generates mailto link with user data [record from database]', () => {
        // note as this act widget loads the entries from the DB this might break in the future if honey requires other elements
        cy.contains('label', 'Honey Gold balance');
        cy.get('div[id="act-with-account"]').find('input[id="input2-value-id_data"]').type('42');
        cy.get('div[id="act-with-account"]').contains('Send email').click();
        cy.get('div[id="act-with-account"]')
            .contains('Default email software')
            .should('have.attr', 'href')
            .and('match', /^mailto:[\S\s]*?balance[\S\s]*?42[\S\s]*?$/);
        cy.get('div[id="act-with-account"]')
            .contains('Default email software')
            .clickLinkWithoutFollowingHref({ force: true });
    });

    it('generates mailto link with user data [record specified as object]', () => {
        cy.contains('label', 'userId');
        cy.contains('label', 'deviceId');
        cy.get('div[id="act-no-account"]').find('input[id="input2-value-id_data"]').type('132465789ACME');
        cy.get('div[id="act-no-account"]').find('input[id="input3-value-id_data"]').type('987654321ACME');
        cy.get('div[id="act-no-account"]').contains('Send email').click();
        cy.get('div[id="act-no-account"]')
            .contains('Default email software')
            .should('have.attr', 'href')
            .and('match', /^mailto:[\S\s]*?userId[\S\s]*?132465789ACME[\S\s]*?deviceId[\S\s]*?987654321ACME[\S\s]*?$/);
        cy.get('div[id="act-no-account"]')
            .contains('Default email software')
            .clickLinkWithoutFollowingHref({ force: true });
    });
});
