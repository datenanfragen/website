module.exports = {
    'Search for company by slug and visit company detail page': browser => {
        browser
            .url(browser.launchUrl + '/company')
            .waitForElementVisible('#aa-search-input')
            .setValue('#aa-search-input', 'facebook')
            .waitForElementVisible('#algolia-autocomplete-listbox-0 .aa-suggestions > div')
            // TODO: Ugly workaround because for some reason autocomplete.js likes to draw multiple instances of the same result on top of each other and `browser.click()` fails if we happen to catch the wrong one. This problem will potentially disappear with #24.
            .execute(function() {
                document.querySelector('.aa-suggestions > div').click();
            })
            .pause(1000)
            .assert.titleContains('Facebook Ireland Ltd.')
            .assert.urlContains('facebook');
    }
};
