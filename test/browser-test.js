var assert = require('assert');
var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;
var firefox = require('selenium-webdriver/firefox');
var chrome = require('selenium-webdriver/chrome');
var chai = require('chai'),
	expect = chai.expect;
var chaiWebdriver = require('chai-webdriver');

var browsers = { 'Firefox': new firefox.Options().addArguments('-headless'), 'Chrome': new chrome.Options().addArguments('headless', 'disable-gpu', 'disable-software-rasterizer', 'no-sandbox', 'disable-dev-shm-usage') };

Object.keys(browsers).forEach(function(browser) {
	describe('Browser testing with ' + browser, function() {
		this.timeout(50000);

		var driver = new webdriver.Builder()
		    .withCapabilities(browsers[browser])
		    .build();		
		chai.use(chaiWebdriver(driver));

		describe('Company database', function() {
			beforeEach(async function() {
				await driver.manage().deleteAllCookies();
				await driver.get('http://localhost:8080/en/company');
			});

			it('Should not show the Algolia search bar by default', function() {
				return expect('aa-search-input').dom.to.have.count(0);
			});
		});

		after(function() {
			driver.quit();
		});
	});
});
