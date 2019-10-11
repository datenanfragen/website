const PRIVACY_CONTROLS = require('./privacy-controls.json');

module.exports = {
    'Clear all cookies button': browser => {
        browser.url(browser.launchUrl + '/privacy-controls').waitForElementVisible('body');

        PRIVACY_CONTROLS.forEach(c => {
            browser.setCookie({
                name: c.cookie_name,
                value: Math.random() >= 0.5 ? 'true' : 'false'
            });
        });

        browser.click('#clear-cookies-button').pause(500);

        PRIVACY_CONTROLS.forEach(c => {
            browser.getCookie(c.cookie_name, function(res) {
                this.assert.equal(res, null, 'Cookie "' + c.cookie_name + '" doesn\'t exist.');
            });
        });
    }
};
