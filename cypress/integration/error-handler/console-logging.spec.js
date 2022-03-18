describe('Errors should be logged to the console', () => {
    it('Error is shown in console', () => {
        cy.visit('/');

        // This is not great and we might have to get rid of this test in the future.
        // The problem is that we can't read console logs in Cypress. As a (bad) workaround, we overload the
        // `console.log()` function and check that the error has been printed.
        cy.window().then((win) => {
            win.console.log = function (m) {
                expect(m).to.include('An unexpected error occurred:');
            };
        });

        // I feel like this might need some explaining. Our error handler does not fire for errors caused by code executed in certain ways, like code entered into the console, for example. The same appears to be the case for code executed through webdriver's driver.executeScript(). Now, for some reason, it does however fire for code executed using the `javascript:` 'protocol'. The problem then is that `driver.get(url)` does not support that protocol. Someone however kindly decided that `document.location = 'javascript:somecode'` should indeed execute said code, which seems incredibly odd and wrong to me but I'll gladly take it, of course.
        cy.document().then((doc) => {
            doc.location = 'javascript:(function(){throw new Error("Browsers are awesome!")})();';
        });
    });
});
