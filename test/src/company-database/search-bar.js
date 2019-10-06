module.exports = {
    'Search bar should not be shown iff the `privacy_control-search` cookie is set to `false`': browser => {
        let selector = '#aa-search-input';
        let cookie = 'privacy_control-search';

        browser
            .url(browser.launchUrl + '/company')
            .deleteCookies()

            // No cookie
            .waitForElementVisible('body')
            .pause(1000)
            .assert.elementPresent(selector, 'Search bar shown when cookie is not set')

            // Correct `true` cookie
            .setCookie({
                name: cookie,
                value: 'true'
            })
            .refresh()
            .waitForElementVisible('body')
            .pause(1000)
            .assert.elementPresent(selector, 'Search bar shown when cookie is correctly set to `true`')

            // Correct `false` cookie
            .setCookie({
                name: cookie,
                value: 'false'
            })
            .refresh()
            .waitForElementVisible('body')
            .pause(1000)
            .assert.elementNotPresent(selector, 'Search bar not shown when cookie is correctly set to `false`');
    }
};
