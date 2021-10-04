// This file is necessary in order to be able to access interal methods from within the browser tests

import FlashMessage, { flash } from 'Components/FlashMessage';
import localforage from 'localforage';
import { CriticalException } from './Utility/errors';

window.showFlash = function (type, text, duration) {
    flash(
        <FlashMessage type={type} duration={duration}>
            {text}
        </FlashMessage>
    );
};

window.accessLocalForageStore = function (store_name) {
    return new Promise((resolve) => {
        resolve(
            localforage.createInstance({
                name: 'Datenanfragen.de',
                storeName: store_name,
            })
        );
    });
};

window.throwError = function () {
    return new CriticalException();
};
