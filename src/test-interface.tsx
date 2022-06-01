// This file is necessary in order to be able to access interal methods from within the browser tests

import localforage from 'localforage';
import { flash, FlashMessage } from './Components/FlashMessage';
import { useAppStore } from './store/app';

type ExtendedWindow = typeof window & {
    getAppStore: () => ReturnType<typeof useAppStore.getState>;
    showFlash: (type: 'info' | 'error' | 'warning' | 'success', text: string, duration: number) => void;
    accessLocalForageStore: (store_name: string) => typeof localforage;
};

(window as ExtendedWindow).getAppStore = () => useAppStore.getState();

(window as ExtendedWindow).showFlash = (type, text, duration) =>
    flash(
        <FlashMessage type={type} duration={duration}>
            {text}
        </FlashMessage>
    );

(window as ExtendedWindow).accessLocalForageStore = (store_name) =>
    localforage.createInstance({ name: 'Datenanfragen.de', storeName: store_name });
