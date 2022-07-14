import localforage from 'localforage';

export class LocalforagePrivacy {
    #localforage_instance?: typeof localforage;
    #localforage_options: LocalForageOptions;
    #condition: () => boolean;

    /**
     * LocalforagePrivacy wraps a localforage instance to only initialize it, if a specific condition is met, to prevent creating unncessary stores in the user's browser.
     * @param condition A function returning `true`, if a localforage instance should be created.
     * @param options The options to pass to `localforage.createInstance()`
     */
    constructor(condition: () => boolean, options: LocalForageOptions) {
        this.#condition = condition;
        this.#localforage_options = options;
    }

    get localforage_instance() {
        if (!this.#condition()) {
            return undefined;
        }

        if (this.#localforage_instance === undefined) {
            this.#localforage_instance = localforage.createInstance(this.#localforage_options);
        }

        return this.#localforage_instance;
    }

    async getItem(name: string): Promise<string | null> {
        return (await this.localforage_instance?.getItem(name)) || null;
    }

    async setItem(name: string, value: string): Promise<void> {
        await this.localforage_instance?.setItem(name, value);
    }

    async removeItem(name: string): Promise<void> {
        await this.localforage_instance?.removeItem(name);
    }

    async clear(): Promise<void> {
        await (this.localforage_instance || localforage.createInstance(this.#localforage_options)).clear();
    }
}
