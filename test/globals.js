module.exports = {
	waitForConditionTimeout: 10000,

	// This will be run before each test suite is started
	beforeEach: function(browser, done) {
		browser.session(function(result) {
			let session_id = result.sessionId;

			if (session_id) console.log('Running in session ' + session_id + '.');
			else console.log('Session ID unknown.'); // TODO: No idea why that happens.

			// Ugly workaround: `browser.currentEnv` is only properly set when tests are run in parallel (see https://github.com/nightwatchjs/nightwatch/issues/365#issuecomment-75098708). As our env names never include a `/`, as opposed to the value set when not in parallel mode, this works.
			if (browser.currentEnv && !browser.currentEnv.includes('/')) {
				browser.options.desiredCapabilities.name += ' : ' + browser.currentEnv;
			}

			// Remember the session ID: When a session fails, the session ID is discarded but we need that to manually set the test as failed in BrowserStack.
			browser.globals._session_id = session_id;

			done();
		});
	},

	// This will be run after each test suite is finished
	afterEach: function(browser, done) {
		if (browser.currentTest.results.failed + browser.currentTest.results.errors > 0) {
			require('request')({
				uri:
					'https://' +
					process.env.BROWSERSTACK_USER +
					':' +
					process.env.BROWSERSTACK_ACCESS_KEY +
					'@api.browserstack.com/automate/sessions/' +
					browser.globals._session_id +
					'.json',
				method: 'PUT',
				form: { status: 'failed', reason: 'Nightwatch reported errors.' }
			});
			console.log('Reported error to BrowserStack.');
		}

		done();
	}
};
