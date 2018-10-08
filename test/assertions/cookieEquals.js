/**
 * Checks if a given cookie's value equals the given one.
 *
 * ```
 * 	this.demoTest = function(browser) {
 *		browser.assert.cookieEquals('my-cookie-name', 'my-value');
 * 	};
 * ```
 *
 * @method cookieEquals
 * @param {string} cookie The name of the cookie.
 * @param {string} expected The expected value of the cookie.
 * @param {string} [msg] Optional log message to display in the output. If missing, one is displayed by default.
 * @api assertions
 */

const util = require('util');

module.exports.assertion = function(cookie, expected, msg) {
	let DEFAULT_MSG = 'Testing if cookie "%s" has value of "%s".';

	this.message = msg || util.format(DEFAULT_MSG, cookie, expected);

	this.expected = function() {
		return expected;
	};

	this.pass = function(value) {
		return value == expected + '';
	};

	this.value = function(result) {
		return result.value;
	};

	this.command = function(callback) {
		return this.api.getCookie(cookie, callback);
	};
};
