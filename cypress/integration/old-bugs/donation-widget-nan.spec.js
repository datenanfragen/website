/*
 * In #300, we noticed leaving the amount in the donation widget empty caused `this.state.amount === NaN`, which lead to
   invalid responses from the payment gateways.
 */

describe('Donation widget amount', () => {
    beforeEach(() => {
        cy.setCookie('country', 'en'); // to make sure that the language suggestion message doesn't interfere
        cy.visit('/donate');
    });

    it('Empty amount should be changed to 0', () => {
        cy.get('#donation-widget-amount').clear();
        cy.contains('You will be billed').contains('0.00');
    });

    it('Amounts less than 1€ should only be allowed for bank transfers', () => {
        cy.get('#donation-widget-amount').type('{selectall}0{uparrow}{uparrow}{uparrow}{uparrow}').trigger('input');
        cy.contains('Bank transfer').click();
        cy.contains('To the next step').click();
        cy.get('#bank-transfer-data-table').contains('Amount').siblings().last().contains('0.04');

        cy.get('#donation-widget-back-button').click();

        const testMethod = (method) => {
            cy.contains(method).click();
            cy.contains('To the next step').click();
            cy.get('.flash-message.flash-error').contains('less than').parent().get('button.close-button').click();
            // Make sure the flash has actually been closed before proceeding.
            cy.get('.flash-message.flash-error').should('not.exist');
        };
        // testMethod('Credit card');
        testMethod('Crypto currency');
        testMethod('PayPal');
        testMethod('Other payments');
    });

    it('Donation of negative values via bank transfer should not be allowed', () => {
        cy.get('#donation-widget-amount').type('{selectall}5{leftarrow}-').trigger('input');

        const testMethod = (method) => {
            cy.contains(method).click();
            cy.contains('To the next step').click();
            cy.get('.flash-message.flash-error').contains('valid amount').parent().get('button.close-button').click();
            // Make sure the flash has actually been closed before proceeding.
            cy.get('.flash-message.flash-error').should('not.exist');
        };
        testMethod('Bank transfer');
    });
});
