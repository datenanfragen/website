/**
 * Checks if at least one element given by the selector is present on the page.
 *
 * ```
 * 	this.demoTest = function(browser) {
 *		browser.isPresent('#my-element', res => {
 *			if(res.value) console.log('present');
 *			else console.log('not present');
 *		});
 * 	};
 * ```
 *
 * @method isPresent
 * @param {string} selector The selector for the element.
 * @param {function} callback The callback to call with the result.
 * @api commands
 */
module.exports.command = function(selector, callback) {
	// TODO: Not sure how to access `locateStrategy` here.
	this.element('css selector', selector, function(res) {
		callback.call(this, { value: res.value && res.value.ELEMENT });
	});

	return this;
};
