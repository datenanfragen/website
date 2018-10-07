module.exports = {
	'Search for company by slug and visit company detail page': browser => {
		browser
			.url(browser.launchUrl + '/company')
			.waitForElementVisible('#aa-search-input')
			.setValue('#aa-search-input', 'facebook')
			.waitForElementVisible('#algolia-autocomplete-listbox-0 .aa-suggestions > div')
			.click('#algolia-autocomplete-listbox-0 .aa-suggestions > div')
			.pause(1000)
			// .assert.titleContains('Facebook Ireland Ltd.') // TODO: This is implemented on Nightwatch's master but not yet shipped
			.assert.urlContains('facebook')
			.end();
	}
};
