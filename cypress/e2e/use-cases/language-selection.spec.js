const germanOrigin = Cypress.expose('baseUrl_DE') || Cypress.config().baseUrl.replace('1314', '1313');

describe('switching languages', () => {
    it('shows a warning', () => {
        cy.visit('/');
        cy.contains('English /');
        cy.get('footer').scrollIntoView();
        cy.get('.i18n-button').click();
        cy.get('footer .i18n-widget-language select').select('German (Deutsch)').blur();
        cy.contains('Wenn Du die Sprache wechelst, wirst Du zu einer anderen Domain weitergeleitet.');
        cy.contains('Trotzdem wechseln').should('have.attr', 'href').and('eq', `${germanOrigin}/`);
    });
});

describe('language suggestion modal', () => {
    it('should appear if no country is set and visiting as DE', () => {
        cy.visit('/', {
            onBeforeLoad(win) {
                Object.defineProperty(win.navigator, 'language', { value: ['de-DE'] });
            },
        });
        cy.get('#flash-messages').should('contain', 'Diese Seite ist auch in Deiner Sprache verfügbar!');
    });
    it('should not appear if country is set and visiting as DE', () => {
        // Sets the country.
        cy.visit('/');

        cy.visit('/', {
            onBeforeLoad(win) {
                Object.defineProperty(win.navigator, 'language', { value: ['de-DE'] });
            },
        });
        cy.get('#flash-messages').should('not.contain', 'Diese Seite ist auch in Deiner Sprache verfügbar!');
    });
    it('should not appear if browser reports english', () => {
        cy.visit('/', {
            onBeforeLoad(win) {
                Object.defineProperty(win.navigator, 'language', { value: ['en-GB'] });
            },
        });
        cy.get('#flash-messages').should('not.contain', 'Diese Seite ist auch in Deiner Sprache verfügbar!');
    });

    it('should appear if DE content is available in current language', () => {
        cy.origin(germanOrigin, () => {
            cy.visit('/', {
                onBeforeLoad(win) {
                    Object.defineProperty(win.navigator, 'language', { value: ['en-GB'] });
                },
            });
            cy.get('#flash-messages').should('contain', 'This site is also available in your language!');
        });
    });

    it('should not appear if the content is not available in current language', () => {
        cy.origin(germanOrigin, () => {
            cy.visit('/blog/e-mail-werbung-einwilligung-beschwerde/', {
                onBeforeLoad(win) {
                    Object.defineProperty(win.navigator, 'language', { value: ['en-GB'] });
                },
            });
            cy.get('#flash-messages').should('not.contain', 'This site is also available in your language!');
        });
    });
});
