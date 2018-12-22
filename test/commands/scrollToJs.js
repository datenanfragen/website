/**
 * Scrolls to the first match of the given CSS selector using injected JS, not the WebDriver methods.
 *
 * ```
 * 	this.demoTest = function(browser) {
 *		browser.scrollToJs('button.button-primary'));
 * 	};
 * ```
 *
 * @method scrollToJs
 * @param {string} selector The CSS selector for the element to scroll to.
 * @api commands
 */
module.exports.command = function(selector) {
    this.execute(
        function(data) {
            let el = document.querySelector(data);
            if (el) el.scrollIntoView();
        },
        [selector]
    );

    return this;
};
