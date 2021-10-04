describe('Errors should be logged to the console', () => {
    it('Error is shown in console', () => {
        cy.on('uncaught:exception', (err, runnable) => {
            return false;
        });

        cy.visit('/');

        // throw custom error to show Error Modal
        cy.window().then((win) => win.throwError());

        // I feel like this might need some explaining. Our error handler does not fire for errors caused by code executed in certain ways, like code entered into the console, for example. The same appears to be the case for code executed through webdriver's driver.executeScript(). Now, for some reason, it does however fire for code executed using the `javascript:` 'protocol'. The problem then is that `driver.get(url)` does not support that protocol. Someone however kindly decided that `document.location = 'javascript:somecode'` should indeed execute said code, which seems incredibly odd and wrong to me but I'll gladly take it, of course.
        cy.document().then((doc) => {
            doc.location = 'javascript:(function(){throw new Error()})();';
        });

        cy.get('#error-modal').contains(
            'Unfortunately, an unexpected error just occurred. We would really appreciate if you took the time to send us an error report via GitHub or email, so we can diagnose the problem. Huge thanks in advance!'
        );
        cy.get('#error-modal').contains(
            'For details on how what data error reports contain and how we process said data, please refer to our '
        );

        cy.get('#error-modal-github-link')
            .contains('Report on GitHub')
            .should('have.attr', 'href')
            .should('match', new RegExp(`^https://github.com/datenanfragen/website/issues/new.*$`));

        cy.get('#error-modal-email-link')
            .contains('Report via email')
            .should('have.attr', 'href')
            .should('match', new RegExp(`^mailto:dev@datenanfragen.de.*$`));
    });
});
