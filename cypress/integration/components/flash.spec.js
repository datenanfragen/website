import { isOn, skipOn } from '@cypress/skip-test';

describe('Test the `Flash` component', () => {
    beforeEach(() => {
        cy.setCookie('country', 'en'); // to make sure that the language suggestion message doesn't interfere
        cy.visit('/');
    });

    it('Different flash types', () => {
        skipOn(isOn('production'));

        cy.window().then((win) => {
            win.showFlash('success', "Well, we successfully executed this test, didn't we?", 3000);
            cy.get('.flash-message.flash-success');

            win.showFlash(
                'thistypedoesnotactuallyexist',
                'Weird, why is the default styling being applied here even though I set a type?',
                3000
            );
            cy.get('.flash-message.flash-thistypedoesnotactuallyexist');
        });
    });

    it('Flash durations', () => {
        skipOn(isOn('production'));

        cy.window().then((win) => {
            win.showFlash('info', 'I will stay here for five seconds.');
            cy.get('.flash-message.flash-info');
            // eslint-disable-next-line cypress/no-unnecessary-waiting
            cy.wait(5100);
            cy.get('.flash-message.flash-info').should('not.exist');
        });

        cy.window().then((win) => {
            win.showFlash('warning', 'I will disappear after only one second.', 1000);
            cy.get('.flash-message.flash-warning');
            // eslint-disable-next-line cypress/no-unnecessary-waiting
            cy.wait(1100);
            cy.get('.flash-message.flash-warning').should('not.exist');
        });
    });

    it('Flash text content', () => {
        skipOn(isOn('production'));

        cy.window().then((win) => {
            win.showFlash('error', 'thisismycustomtextcontent');
            cy.get('.flash-message.flash-error .inner').contains('thisismycustomtextcontent');
        });
    });

    it('Dismissing flashes', () => {
        skipOn(isOn('production'));

        cy.window().then((win) => {
            win.showFlash(
                'success',
                'Wow, you were so successful with what you just did! To celebrate, I will stay here for a long time!',
                50000
            );
            cy.get('.flash-message.flash-success').get('button.close-button').click();
            cy.get('.flash-message.flash-success').should('not.exist');
        });
    });
});
