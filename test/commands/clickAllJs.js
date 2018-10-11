/**
 * Clicks all elements matching the given CSS selector on the current page using injected JS, not the WebDriver methods.
 *
 * ```
 * 	this.demoTest = function(browser) {
 *		browser.clickAllJs('button.button-primary'));
 * 	};
 * ```
 *
 * @method clickAllJs
 * @param {string} selector The CSS selector for the element.
 * @api commands
 */
module.exports.command = function(selector) {
	this.execute(
		function(data) {
			Array.from(document.querySelectorAll(data)).forEach(function(el) {
				el.click();
			});
		},
		[selector]
	);

	return this;
};
