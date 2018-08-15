var assert = require('assert');
var expect = require('chai').expect;
var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until,
    Key = webdriver.Key;
var firefox = require('selenium-webdriver/firefox');
var chrome = require('selenium-webdriver/chrome');
var error = require('selenium-webdriver/lib/error');

var browsers = { 'Firefox': new firefox.Options().addArguments('-headless'), 'Chrome': new chrome.Options().addArguments('headless', 'disable-gpu', 'disable-software-rasterizer', 'no-sandbox', 'disable-dev-shm-usage') };
if(process.env.DA_NOHEADLESS == 1) var browsers = { 'Firefox': new firefox.Options(), 'Chrome': new chrome.Options() };

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

		describe('Company database', function() {
			beforeEach(async function() {
				await driver.manage().deleteAllCookies();
				await driver.get('http://localhost:8080/en/company');
			});

			it('Algolia search bar should be only be shown if the `privacy_control-algolia_search` cookie is set to `true`', async function() {
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
				expect(await driver.getCurrentUrl(), 'Did not load company detail page').to.equal('http://localhost:8080/company/schufa/');
				expect(await driver.getTitle(), 'Page title did not include company name').to.include('SCHUFA Holding AG');
			});
		});

		describe('Privacy controls', function() {
			beforeEach(async function() {
				try {
					await driver.manage().deleteAllCookies();
					await driver.get('http://localhost:8080/en/privacy-controls');
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

		after(function() {
			if(!process.env.DA_NOHEADLESS) driver.quit();
		});
	});
});
