module.exports = {
    waitForConditionTimeout: 10000,

    // This will be run before each test suite is started
    beforeEach: function(browser, done) {
        const session_id = browser.sessionId;
        if (session_id) console.log('Running in session: ' + session_id);
        else console.log('Session ID unknown.'); // This shouldn't happen anymore?

        // Ugly workaround: `browser.currentEnv` is only properly set when tests are run in parallel (see https://github.com/nightwatchjs/nightwatch/issues/365#issuecomment-75098708). As our env names never include a `/`, as opposed to the value set when not in parallel mode, this works.
        if (browser.currentEnv && !browser.currentEnv.includes('/')) {
            browser.options.desiredCapabilities.name += ' : ' + browser.currentEnv;
        }

        done();
    },

    // This will be run after each test suite is finished
    afterEach: function(browser, done) {
        if (browser.currentTest.results.failed + browser.currentTest.results.errors > 0) {
            require('request')({
                uri: `https://${process.env.BROWSERSTACK_USER}:${process.env.BROWSERSTACK_ACCESS_KEY}@api.browserstack.com/automate/sessions/${browser.sessionId}.json`,
                method: 'PUT',
                form: { status: 'failed', reason: 'Nightwatch reported errors.' }
            });
            console.log('Reported error to BrowserStack.');
        }

        browser.end(function() {
            done();
        });
    }
};
