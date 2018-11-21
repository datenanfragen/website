/**
 * Checks if an elements CSS property equals the given one.
 *
 * ```
 * 	this.demoTest = function(browser) {
 *		browser.assert.computedCssProperty('#my-element', 'background-color', 'hotpink');
 * 	};
 * ```
 *
 * @method computedCssProperty
 * @param {string} selector The selector (CSS / Xpath) used to locate the element.
 * @param {string} property The CSS property to check.
 * @param {string} expected The expected value of the property to check.
 * @param {string} [msg] Optional log message to display in the output. If missing, one is displayed by default.
 * @api assertions
 */

const util = require('util');

module.exports.assertion = function(selector, property, expected, msg) {
    let DEFAULT_MSG = 'Testing if element <%s> has CSS property "%s" of "%s".';
    let MSG_ELEMENT_NOT_FOUND = `${DEFAULT_MSG} Element could not be located.`;

    this.message = msg || util.format(DEFAULT_MSG, selector, property, expected);

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
            this.elementIdCssProperty(res.value.ELEMENT, property, callback);
        });
    };
};
