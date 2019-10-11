const PRIVACY_CONTROLS = require('./privacy-controls.json');

module.exports = {
    beforeEach: browser => {
        browser.deleteCookies().url(browser.launchUrl + '/privacy-controls');
    }
};

PRIVACY_CONTROLS.forEach(c => {
    let selector = '#' + c.checkbox_id;
    module.exports['Toggling privacy control "' + c.description + '"'] = browser => {
        browser
            .waitForElementVisible('body')
            .assert.selected(selector, true, 'Checkbox checked state matches default: ' + c.default_value);

        [!c.default_value, c.default_value].forEach(val => {
            browser
                .click(selector)
                .pause(500)
                .isPresent('.modal', result => {
                    if (result.value) browser.click('.modal .button-secondary'); // TODO: Test if the clearing actually happens.
                })
                .assert.cookieEquals(c.cookie_name, val);
        });
    };
});
