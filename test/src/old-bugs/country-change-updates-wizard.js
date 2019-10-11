/*
 * In #103, we noticed that changing the country did not update the suggested companies in the wizard.
 */

// TODO: This will only work for the German site of course.
const COUNTRIES = {
    de: 'Deutschland',
    all: 'alle'
};

function checkNumberOfSuggestedCompanies(browser, for_country, ok_func) {
    browser
        // Scroll to the wizard to make the video and screenshots useful.
        .scrollToJs('#wizard')
        .execute(`globals.country = '${for_country}';`)
        // Sometimes, we are too quick get the old element before it is removed from the DOM. Then, it will complain
        // about the stale element reference. Waiting a little should hopefully avoid that.
        .pause(500)
        .waitForElementVisible('#wizard-user-country')
        .assert.containsText('#wizard-user-country', COUNTRIES[for_country], 'The wizard correctly names the country.')
        .elements('css selector', '.wizard-selected-list .button.icon-trash', els => {
            browser.assert.ok(ok_func(els.value.length), 'Correct number of suggested companies for the country.');
        });
}

module.exports = {
    before: browser => {
        browser
            .url(browser.launchUrl + '/')
            .waitForElementVisible('#wizard')
            // Pretend we didn't change the companies yet to begin with.
            .setCookie({
                name: 'changed_saved_companies',
                value: 'false'
            });
    },
    '"All" should have no suggested companies': browser => {
        checkNumberOfSuggestedCompanies(browser, 'all', num => num == 0);
    },
    '"Germany" should have a few suggested companies': browser => {
        checkNumberOfSuggestedCompanies(browser, 'de', num => num > 2);
    },
    'Changing the country after manually modifying the suggested companies': browser => {
        browser.elements('css selector', '.wizard-selected-list .button.icon-trash', els => {
            browser
                .click('.wizard-selected-list .button.icon-trash')
                .execute(`globals.country = 'all';`)
                .elements('css selector', '.wizard-selected-list .button.icon-trash', els2 => {
                    browser.assert.ok(els.value.length - 1 === els2.value.length, "Selected companies didn't change.");
                });
        });
    }
};
