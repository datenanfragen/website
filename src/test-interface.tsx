// This file is necessary in order to be able to access interal methods from within the browser tests

import { useAppStore } from './store/app';
import { FlashMessage, flash } from './Components/FlashMessage';
import localforage from 'localforage';
import { useProceedingsStore } from './store/proceedings';
import { PrivacyAsyncStorage } from './Utility/PrivacyAsyncStorage';

type ExtendedWindow = typeof window & {
    getAppStore: () => ReturnType<typeof useAppStore.getState>;
    getProceedingsStore: () => ReturnType<typeof useProceedingsStore.getState>;
    showFlash: (type: 'info' | 'error' | 'warning' | 'success', text: string, duration: number) => void;
    accessLocalForageStore: (storeName: string) => typeof localforage;
    accessPrivacyAsyncStorage: (storeName: string) => PrivacyAsyncStorage;
};

(window as ExtendedWindow).getAppStore = () => useAppStore.getState();

(window as ExtendedWindow).getProceedingsStore = () => useProceedingsStore.getState();

(window as ExtendedWindow).showFlash = (type, text, duration) =>
    flash(
        <FlashMessage type={type} duration={duration}>
            {text}
        </FlashMessage>
    );

(window as ExtendedWindow).accessLocalForageStore = (storeName) =>
    localforage.createInstance({ name: 'Datenanfragen.de', storeName });

(window as ExtendedWindow).accessPrivacyAsyncStorage = (storeName) =>
    new PrivacyAsyncStorage(() => true, { name: 'Datenanfragen.de', storeName });
