module.exports = {
    before: browser => {
        browser
            .url(browser.launchUrl)
            .waitForElementVisible('body')
            .injectScript(browser.launchUrl + '/js/test-interface.gen.js')
            .pause(2500); // TODO: Nightwatch does not wait for the injected script to be loaded (see https://github.com/nightwatchjs/nightwatch/issues/1548). We should either work around that or submit a PR to upstream to do this properly. For now, waiting 2.5s should work.;
    },
    'Show success flash': browser => {
        browser
            .execute(function() {
                window.showFlash('success', "Well, we successfully executed this test, didn't we?", 3000);
            })
            .assert.visible('.flash-message.flash-success', 'Flash message shown after manually triggering one.');
    },
    'Show flash with custom type': browser => {
        browser
            .execute(function() {
                window.showFlash(
                    'thistypedoesnotactuallyexist',
                    'Weird, why is the default styling being applied here even though I set a type?',
                    3000
                );
            })
            .assert.visible(
                '.flash-message.flash-thistypedoesnotactuallyexist',
                'Flash message shown with custom type properly applied.'
            );
    },
    'Flash disappears after five seconds if nothing else is specified': browser => {
        browser
            .execute(function() {
                window.showFlash('info', 'I will stay here for five seconds.');
            })
            .assert.visible('.flash-message.flash-info', 'Flash message shown.')
            .pause(5500)
            .assert.elementNotPresent('.flash-message.flash-info', 'Flash message disappeared after five seconds.');
    },
    'Custom flash duration': browser => {
        browser
            .execute(function() {
                window.showFlash('warning', 'I will disappear after only two seconds.', 2000);
            })
            .assert.visible('.flash-message.flash-warning', 'Flash message shown.')
            .pause(2500)
            .assert.elementNotPresent('.flash-message.flash-warning', 'Flash message disappeared after two seconds.');
    },
    'Flash text content': browser => {
        browser
            .execute(function() {
                window.showFlash('error', 'thisismycustomtextcontent');
            })
            .assert.visible('.flash-message.flash-error', 'Flash message shown.')
            .assert.containsText(
                '.flash-message.flash-error .inner',
                'thisismycustomtextcontent',
                'Flash message shows correct text.'
            );
    },
    'Dismissing flash': browser => {
        browser
            .execute(function() {
                window.showFlash(
                    'success',
                    'Wow, you were so successful with what you just did! To celebrate, I will stay here for a long time!',
                    50000
                );
            })
            .assert.visible('.flash-message.flash-success', 'Flash message shown initially.')
            .click('.flash-message.flash-success button.close-button')
            .pause(500)
            .assert.elementNotPresent('.flash-message.flash-success', 'Flash message disappeared after dismissing.');
    }
};
