module.exports = {
	'Ask for confirmation from the user before actually clearing data and give feedback afterwards': browser => {
		browser.url(browser.launchUrl + '/privacy-controls').waitForElementVisible('#privacy-controls-buttons');

		browser.elements(
			'css selector',
			'#privacy-controls-buttons .button, #privacy-controls-buttons button, .privacy-control input[type="checkbox"]',
			function(elements) {
				elements.value.forEach(el => {
					let id = el.ELEMENT;
					browser.elementIdAttribute(id, 'id', res => {
						if (!['clear-cookies-button', 'search-checkbox'].includes(res.value)) {
							browser
								.elementIdClick(id)
								.pause(500)
								.clickAllJs('.flash-message.flash-success a.close-button') // The checkboxes produce a flash—dismiss that. Won't fail if there is no matching element.
								.assert.visible('.modal', 'Modal shown before clearing via "#' + res.value + '".')
								.click('.modal .button-primary')
								.pause(750)
								.verify.visible(
									'.flash-message.flash-success',
									'Flash message shown after clearing via "#' + res.value + '".'
								)
								.clickAllJs('.flash-message.flash-success a.close-button');
						}
					});
				});
			}
		);

		browser.end();
	},
	'Give feedback for cookie changes': browser => {
		browser.url(browser.launchUrl + '/privacy-controls').waitForElementVisible('#privacy-controls-buttons');

		browser.elements('css selector', '.privacy-control input[type="checkbox"]', function(elements) {
			elements.value.forEach(el => {
				let id = el.ELEMENT;
				browser.elementIdAttribute(id, 'id', res => {
					browser
						.elementIdClick(id)
						.pause(500)
						.assert.visible(
							'.flash-message.flash-success',
							'Flash message shown changing privacy control via "#' + res.value + '".'
						)
						.clickAllJs('.flash-message.flash-success a.close-button');

					if (!['search-checkbox'].includes(res.value)) {
						browser
							.pause(500)
							.click('.modal .button-primary')
							.clickAllJs('.flash-message.flash-success a.close-button');
					}
				});
			});
		});

		browser.end();
	}
};
