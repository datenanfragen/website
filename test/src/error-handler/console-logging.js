module.exports = {
    'Errors should be logged to the console': browser => {
        if (browser.options.desiredCapabilities.browser == 'chrome') {
            browser
                .url(browser.launchUrl)
                // I feel like this might need some explaining. Our error handler does not fire for errors caused by code executed in certain ways, like code entered into the console, for example. The same appears to be the case for code executed through webdriver's driver.executeScript(). Now, for some reason, it does however fire for code executed using the `javascript:` 'protocol'. The problem then is that `driver.get(url)` does not support that protocol. Someone however kindly decided that `document.location = 'javascript:somecode'` should indeed execute said code, which seems incredibly odd and wrong to me but I'll gladly take it, of course.
                .execute(function(data) {
                    document.location = 'javascript:(function(){throw new Error("Browsers are awesome!")})();';
                })
                .getLog('browser', function(entries) {
                    let found = false;

                    entries.forEach(function(entry) {
                        if (entry.message.includes('Browsers are awesome')) found = true;
                    });

                    this.assert.equal(found, true, 'Log message found.');
                });
        } else
            console.log(
                'Note: Reading the console logs is only supported in Chrome as that interface is not in the webdriver spec.'
            );
    }
};
