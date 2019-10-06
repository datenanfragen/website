module.exports = {
    'Errors with level <= 3 should show a modal': browser => {
        if (!['chrome', 'edge'].includes(browser.options.desiredCapabilities.browser)) {
            browser
                .url(browser.launchUrl)
                .assert.elementNotPresent('.modal', 'For this test to work, there cannot be a previous modal.')

                // code > 3
                .execute(function(data) {
                    document.location =
                        'javascript:(function(){let error = new Error("Not too bad."); error.code = 4; throw error;})();';
                })
                .assert.elementNotPresent('.modal', 'No error modal for code 4.')

                // code <= 3
                .execute(function(data) {
                    document.location =
                        'javascript:(function(){let error = new Error("Oh dear, this awful. The world might just end right now."); error.code = 0; throw error;})();';
                })
                .assert.elementPresent('.modal', 'Error modal for code 0.');
        } else {
            // TODO: Edge should really work here (and it *does* work interactively) but when run through WebDriver, it throws `Access is denied.` and doesn't trigger the error.
            console.log(
                'Note: Chrome discards all useful information on error events, therefore error modals are never shown. For more details, see the comments in `error-handler.js`.'
            );
        }
    }
};
