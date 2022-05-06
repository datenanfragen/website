// This file is necessary in order to be able to access interal methods from within the browser tests

import { FlashMessage, flash } from './Components/FlashMessage';
import localforage from 'localforage';

type ExtendedWindow = typeof window & {
    showFlash: (type: 'info' | 'error' | 'warning' | 'success', text: string, duration: number) => void;
    accessLocalForageStore: (store_name: string) => Promise<typeof localforage>;
};

(window as ExtendedWindow).showFlash = (type, text, duration) =>
    flash(
        <FlashMessage type={type} duration={duration}>
            {text}
        </FlashMessage>
    );

// TODO: This looks like an unnecessary promise to me but Cypress is sometimes weird with stuff like that, so it might
// actually be needed.
(window as ExtendedWindow).accessLocalForageStore = (store_name) =>
    new Promise((resolve) => {
        resolve(
            localforage.createInstance({
                name: 'Datenanfragen.de',
                storeName: store_name,
            })
        );
    });
