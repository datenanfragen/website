/*
 * We previously used `:read-only` and `:moz-read-only` to match readonly elements in CSS. As it turned out, that doesn't really work.
 * Firefox needs annoying special cases and Firefox and Safari match way too much (see #125).
 *
 * Therefore, we have decided to manually apply a `readonly` class to readonly elements.
 */

module.exports = {
    before: browser => {
        browser.url(browser.launchUrl + '/generator').waitForElementVisible('body');
    },
    'Regular checkbox should not have readonly styling': browser => {
        browser
            .waitForElementVisible('#request-flags-data-portability')
            // I am using the cursor property here since I expect that to be the least likely one to change (while the colors might).
            .assert.computedCssProperty('#request-flags-data-portability', 'cursor', 'auto');
    },
    'Read-only checkbox should have appropriate styling': browser => {
        browser
            .scrollToJs('.accordion', 0, 0)
            .clickJs('.accordion > .accordion-title-link')
            .waitForElementPresent('#reference')
            .assert.computedCssProperty('#reference', 'cursor', 'not-allowed');
    }
};
