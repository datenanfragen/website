/**
 * Checks if a given element is selected/checked.
 *
 * ```
 * 	this.demoTest = function(browser) {
 *		browser.assert.selected('#my-checkbox', true);
 * 	};
 * ```
 *
 * @method selected
 * @param {string} selector The selector (CSS / Xpath) used to locate the element.
 * @param {string} expected The expected value of the selected state to check.
 * @param {string} [msg] Optional log message to display in the output. If missing, one is displayed by default.
 * @api assertions
 */

const util = require('util');

module.exports.assertion = function(selector, expected, msg) {
	let DEFAULT_MSG = 'Testing if element <%s> has checked state of %s.';
	let MSG_ELEMENT_NOT_FOUND = `${DEFAULT_MSG} Element could not be located.`;
	let MSG_ATTR_NOT_FOUND = `${DEFAULT_MSG} Element does not have a checked attribute.`;

	this.message = msg || util.format(DEFAULT_MSG, selector, expected);

	this.expected = function() {
		return expected;
	};

	this.pass = function(value) {
		return value === expected;
	};

	this.value = function(result) {
		return result.value;
	};

	this.command = function(callback) {
		return this.api.element(this.client.locateStrategy, selector, function(res) {
			this.elementIdSelected(res.value.ELEMENT, callback);
		});
	};
};
