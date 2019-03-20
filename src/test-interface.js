// This file is necessary in order to be able to access interal methods from within the browser tests

import FlashMessage, { flash } from 'Components/FlashMessage';
/* eslint-disable no-unused-vars */
import preact from 'preact';
/* eslint-enable no-unused-vars */

window.showFlash = function(type, text, duration) {
    flash(
        <FlashMessage type={type} duration={duration}>
            {text}
        </FlashMessage>
    );
};
