import { DBSchema, IDBPDatabase, openDB } from 'idb';

type BlobDatabaseSchema = DBSchema & {
    [store in StoreNames]: { key: string; value: Blob };
};
type BlobDatabase = IDBPDatabase<BlobDatabaseSchema>;

export type StoreNames = 'proceeding-files';

export class BlobStorage {
    #db?: BlobDatabase;

    constructor() {
        this.#db = undefined;
    }

    async getDB() {
        if (!this.#db) {
            this.#db = await openDB<BlobDatabaseSchema>('Datenanfragen.de-blob-storage', 1, {
                // increase the version here if changes to the database are made.
                upgrade: (db, oldVersion, newVersion) => {
                    if (newVersion === 1) {
                        db.createObjectStore('proceeding-files');
                    }
                },
                blocking: () => {
                    // Another thread changed the database version, so we need to throw away our connection.
                    this.#db?.close();
                    this.#db = undefined;
                },
            });
        }
        return this.#db;
    }

    getBlob = (storeName: StoreNames, key: string) => this.getDB().then((db) => db.get(storeName, key));
    setBlob = (storeName: StoreNames, key: string, blob: Blob) =>
        this.getDB().then((db) => db.put(storeName, blob, key));

    closeConnection = () => {
        if (this.#db) this.#db.close();
    };
}
