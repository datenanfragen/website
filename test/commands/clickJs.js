/**
 * Clicks the first element matching the given CSS selector on the current page using injected JS, not the WebDriver methods.
 *
 * ```
 * 	this.demoTest = function(browser) {
 *		browser.clickJs('button.button-primary'));
 * 	};
 * ```
 *
 * @method clickJs
 * @param {string} selector The CSS selector for the element.
 * @api commands
 */
module.exports.command = function(selector) {
	this.execute(
		function(data) {
			let el = document.querySelector(data);
			if (el) el.click();
		},
		[selector]
	);

	return this;
};
