var assert = require('assert');
var expect = require('chai').expect;
var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until,
    Key = webdriver.Key;
var firefox = require('selenium-webdriver/firefox');
var chrome = require('selenium-webdriver/chrome');
var error = require('selenium-webdriver/lib/error');

let logging_prefs = new webdriver.logging.Preferences();
logging_prefs.setLevel(webdriver.logging.Type.BROWSER, webdriver.logging.Level.ALL)
var browsers = { 'Firefox': new firefox.Options(), 'Chrome': new chrome.Options().setLoggingPrefs(logging_prefs) };
if(process.env.DA_NOHEADLESS != 1) {
	browsers['Firefox'].addArguments('-headless');
	browsers['Chrome'].addArguments('headless', 'disable-gpu', 'disable-software-rasterizer', 'no-sandbox', 'disable-dev-shm-usage')
}

Object.keys(browsers).forEach(function(browser) {
	describe('Browser testing with ' + browser, function() {
		this.timeout(0);

		var driver = new webdriver.Builder()
		    .withCapabilities(browsers[browser])
		    .build();		
		var $ = function(selector) { // get the first element matching `selector`
			try { return driver.executeScript('return document.querySelector(arguments[0]);', selector); }
			catch(e) { return undefined; }
		}
		var $$ = function(selector) { // get all elements matching `selector`
			try { return driver.executeScript('return document.querySelectorAll(arguments[0]);', selector); }
			catch(e) { return undefined; }
		}

		var languages = { 'en': 'http://localhost:8080/en', 'de': 'http://localhost:8080' };

		Object.keys(languages).forEach(function(lang) {
			describe('Testing language ' + lang, function() {
				describe('Company database', function() {
					beforeEach(async function() {
						await driver.manage().deleteAllCookies();
						await driver.get(languages[lang] + '/company');
					});

					it('Algolia search bar should be be shown iff the `privacy_control-algolia_search` cookie is set to `true`', async function() {
						// No cookie
						expect(await $('#aa-search-input'), 'Search bar shown when cookie is not set').to.not.be.ok;

						// Invalid cookie
						await driver.manage().addCookie({name: 'privacy_control-algolia_search', value: 'foobar'});
						await driver.navigate().refresh();
						expect(await $('#aa-search-input'), 'Search bar shown when cookie is set incorrectly').to.not.be.ok;

						// Correct cookie
						await driver.manage().addCookie({name: 'privacy_control-algolia_search', value: 'true'});
						await driver.navigate().refresh();
						expect(await $('#aa-search-input'), 'Search bar not shown when cookie is set correctly').to.be.ok;
					});

					it('Search for company by slug and visit company detail page', async function() {
						await driver.manage().addCookie({name: 'privacy_control-algolia_search', value: 'true'});
						await driver.navigate().refresh();
						await (await $('#aa-search-input')).sendKeys('schufa');
						await driver.wait(until.elementLocated(By.css('.aa-suggestions > div')), 10000);
						await (await $$('.aa-suggestions > div'))[0].click();
						expect(await driver.getCurrentUrl(), 'Did not load company detail page').to.equal(languages['de'] + '/company/schufa/');
						expect(await driver.getTitle(), 'Page title did not include company name').to.include('SCHUFA Holding AG');
					});
				});

				describe('Privacy controls', function() {
					beforeEach(async function() {
						try {
							await driver.manage().deleteAllCookies();
							await driver.get(languages[lang] + '/privacy-controls');
						}
						catch(e) {
							// No idea why we need this here but without it, Chrome fails on the UnexpectedAlertOpenError
							if(e instanceof error.UnexpectedAlertOpenError) driver.switchTo().alert().accept().catch(() => {});
							else throw e;
						}
					});

					let privacy_controls = [
						{
							description: 'Company search via Algolia',
							checkbox_id: 'algolia_search-checkbox',
							cookie_name: 'privacy_control-algolia_search',
							default_value: false
						},
						{
							description: '“My requests” feature',
							checkbox_id: 'save_my_requests-checkbox',
							cookie_name: 'privacy_control-save_my_requests',
							default_value: false
						}
					];

					privacy_controls.forEach(c => {
						it(c.description, async function() {
							try {
								let checkbox = await $('#' + c.checkbox_id);
								expect(await checkbox.getAttribute('checked'), 'Checkbox checked state did not expected default: ' + c.default_value).to.be.oneOf(c.default_value ? [ true ] : [ false, null ]);
								await checkbox.click();
								expect((await driver.manage().getCookie(c.cookie_name)).value, 'Cookie was not set to `' + !c.default_value + '` after clicking the checkbox').to.equal(c.default_value ? 'false' : 'true');
								await checkbox.click();
								expect((await driver.manage().getCookie(c.cookie_name)).value, 'Cookie was not set to `' + c.default_value + '` after clicking the checkbox again').to.equal(c.default_value ? 'true' : 'false');
							}
							catch(e) {
								// Disabling the my requests feature asks whether we also want to delete all previous requests, we need to handle that alert
								if(e instanceof error.UnexpectedAlertOpenError) driver.switchTo().alert().accept().catch(() => {});
								else throw e;
							}
						});
					});

					it('Clear all cookies button', async function() {
						privacy_controls.forEach(async c => { await driver.manage().addCookie({name: c.cookie_name, value: Math.random() >= 0.5 ? 'true' : 'false' }); });
						await (await $('#clear-cookies-button')).click();
						privacy_controls.forEach(async c => {
							let cookie_present = true;
							try { if(await driver.manage().getCookie(c.cookie_name) === null) cookie_present = false; }
							catch(e) { if(e instanceof error.NoSuchCookieError) cookie_present = false; }
							expect(cookie_present, 'Cookie `' + c.cookie_name + '` should have been deleted but was present').to.be.false;
						});
					});
				});

				describe('Error handler', function() {
					beforeEach(async function() { await driver.get(languages[lang]); });

					// Reading the console logs is only possible in Chrome as that interface is not in the webdriver spec.
					if(browser == 'Chrome') {
						it('Errors should be logged to the console', async function() {
							// I feel like this might need some explaining. Our error handler does not fire for errors caused by code executed in certain ways, like code entered into the console, for example. The same appears to be the case for code executed through driver.executeScript(). Now, for some reason, it does however fire for code executed using the `javascript:` 'protocol'. The problem then is that `driver.get(url)` does not support that protocol. Someone however kindly decided that `document.location = 'javascript:somecode'` should indeed execute said code, which seems incredibly odd and wrong to me but I'll gladly take it, of course.
							await driver.executeScript('document.location = \'javascript:(function(){throw new Error("Browsers are awesome!")})();\';').catch(() => {});
							expect((await driver.manage().logs().get(webdriver.logging.Type.BROWSER))[0].message).to.include('%cAn unexpected error occurred:');
						});
					}

					// Error modals are only ever shown in Firefox since Chrome discards all useful information on error events. For more details, see the comments in `error-handler.js`.
					if(browser == 'Firefox') {
						it('Errors with level <= 3 should show a modal', async function() {
							expect(await $('.modal'), 'For this test to work, there cannot be a previous modal.').to.not.be.ok;

							// code > 3
							await driver.executeScript('document.location = \'javascript:(function(){let error = new Error("Not too bad."); error.code = 4; throw error;})();\';').catch(() => {});
							expect(await $('.modal'), 'Error modal shown for code 4.').to.not.be.ok;

							// code <= 3
							await driver.executeScript('document.location = \'javascript:(function(){let error = new Error("Oh dear, this is awful."); error.code = 0; throw error;})();\';').catch(() => {});
							expect(await $('.modal'), 'Error modal not shown for code 0.').to.be.ok;
						});
					}
				});
			});
		});

		after(function() {
			if(!process.env.DA_NOHEADLESS) driver.quit();
		});
	});
});
