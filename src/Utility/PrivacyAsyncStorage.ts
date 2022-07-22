import { IDBPDatabase, openDB } from 'idb';
import type { SetOptional } from 'type-fest';
import { rethrow } from './errors';

export type PrivacyAsyncStorageOption = {
    /** Name of the Database */
    name: string;
    /** Name of the objectStore */
    storeName: string;
    /** Version of the database to try and use. If left blank the most current database is used. */
    version?: number;
};

type KeyValueDatabase = IDBPDatabase<{ [key: string]: string }>;

export class PrivacyAsyncStorage {
    #db?: typeof localStorage | KeyValueDatabase;
    #options: PrivacyAsyncStorageOption;
    #condition: () => boolean;
    #storageType: 'idb' | 'localStorage';

    /**
     * Recreates a simple localforage style storage driver that uses IndexdDB per default and switches to localStorage if the database is unavialable or unwriteable.
     * Blocks any connection to the database if the condition is false.
     * @param condition A function returning `true`, if a localforage instance should be created.
     * @param options The options to pass to `localforage.createInstance()`
     */
    constructor(condition: () => boolean, options: SetOptional<PrivacyAsyncStorageOption, 'storeName' | 'name'>) {
        this.#condition = condition;
        this.#options = { storeName: 'keyval', name: 'keyval', ...options };
        this.#storageType = 'idb';
    }

    async getDb(overwriteCondition?: boolean) {
        if (!this.#condition() && !overwriteCondition) return undefined;

        if (this.#db === undefined) {
            if (this.#storageType === 'idb') {
                return openDB<{ [key: string]: string }>(this.#options.name, this.#options.version, {
                    upgrade: (db, oldVersion, newVersion) => {
                        db.createObjectStore(this.#options.storeName);
                        this.#options.version = newVersion || undefined;
                    },
                    blocking: () => {
                        // Another thread changed the database version, so we need to throw away our connection.
                        this.#db?.close();
                        this.#db = undefined;
                    },
                })
                    .catch((e) => {
                        if (e.name === 'InvalidStateError') {
                            // Database is not writeable, we a probably in Firefox' private browsing mode
                            this.#storageType = 'localStorage';
                            this.#db = localStorage;
                            return this.#db;
                        }
                        rethrow(e);
                    })
                    .then((db) => {
                        if (!db?.objectStoreNames.contains(this.#options.storeName)) {
                            // The store is mssing, enforce an update!
                            this.#options.version = db?.version + 1;
                            db?.close();
                            this.#db = undefined;
                        } else this.#db = db;
                        return this.#db;
                    });
            }

            this.#db = localStorage;
        }

        return this.#db;
    }

    isIDB(db: KeyValueDatabase | Storage | undefined): db is KeyValueDatabase {
        return this.#storageType === 'idb' && typeof db !== 'undefined' && 'get' in (db as KeyValueDatabase);
    }

    getLocalStorageItemKey(key: string) {
        return (
            (this.#options.name === 'keyval' ? '' : this.#options.name + '/') +
            (this.#options.storeName === 'keyval' ? '' : this.#options.storeName + '/') +
            key
        );
    }

    async getItem(key: string): Promise<string | null> {
        const db = await this.getDb();
        if (this.isIDB(db)) {
            return (await db?.get(this.#options.storeName, key)) || null;
        }
        return (db as Storage | undefined)?.getItem(this.getLocalStorageItemKey(key)) || null;
    }

    async setItem(key: string, value: string): Promise<void> {
        const db = await this.getDb();
        if (this.isIDB(db)) {
            return db?.put(this.#options.storeName, value, key).then();
        }
        return (db as Storage | undefined)?.setItem(this.getLocalStorageItemKey(key), value);
    }

    async removeItem(key: string): Promise<void> {
        const db = await this.getDb();
        if (this.isIDB(db)) {
            return db?.delete(this.#options.storeName, key);
        }
        return (db as Storage | undefined)?.removeItem(this.getLocalStorageItemKey(key));
    }

    async clear(): Promise<void> {
        if (await PrivacyAsyncStorage.doesStoreExist(this.#options.name, this.#options.storeName)) {
            const db = await this.getDb(true);
            if (this.isIDB(db)) {
                return db?.clear(this.#options.storeName);
            }
            return (
                db &&
                Object.keys(db as Storage)
                    .filter((key) => new RegExp(`^${this.#options.name}/${this.#options.storeName}/`).test(key))
                    ?.forEach((key) => {
                        (db as Storage).removeItem(key);
                    })
            );
        }
    }

    static async doesStoreExist(name: string, storeName: string) {
        const db: IDBPDatabase | void = await openDB(name, undefined, { blocking: () => db?.close() }).catch((e) => {
            if (e.name === 'InvalidStateError') {
                db?.close();
                return;
            }
            rethrow(e);
        });

        if (db) {
            const result = db.objectStoreNames.contains(storeName);
            db.close();
            return result;
        }
        return (
            typeof Object.keys(localStorage).find((key) => new RegExp(`^${name}/${storeName}/`).test(key)) === 'string'
        );
    }
}
