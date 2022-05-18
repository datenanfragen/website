import localforage from 'localforage';
import type { RequestType, ResponseType } from '../types/request';
import { rethrow } from '../Utility/errors';
import { Privacy, PRIVACY_ACTIONS } from '../Utility/Privacy';

export type UserRequest = {
    reference: string;
    date: string;
    type: RequestType;
    response_type?: ResponseType;
    slug: string;
    recipient: string;
    email: string;
    via: 'fax' | 'letter' | 'email';
};

const makeLocalforageInstance = () =>
    localforage.createInstance({
        name: 'Datenanfragen.de',
        storeName: 'my-requests',
    });

export class UserRequests {
    #localforage_instance?: typeof localforage;

    get localforage_instance() {
        if (!Privacy.isAllowed(PRIVACY_ACTIONS.SAVE_MY_REQUESTS)) return undefined;

        if (this.#localforage_instance === undefined) this.#localforage_instance = makeLocalforageInstance();

        return this.#localforage_instance;
    }

    async storeRequest(db_id: string, item: UserRequest) {
        if (Privacy.isAllowed(PRIVACY_ACTIONS.SAVE_MY_REQUESTS)) {
            return this.localforage_instance
                ?.setItem(db_id, item)
                .catch((error) => rethrow(error, 'Saving request failed.', { db_id }));
        }
    }

    async getRequest(db_id: string) {
        if (Privacy.isAllowed(PRIVACY_ACTIONS.SAVE_MY_REQUESTS)) {
            return this.localforage_instance?.getItem<UserRequest>(db_id);
        }
    }

    async getRequests(): Promise<Record<string, UserRequest> | void> {
        if (Privacy.isAllowed(PRIVACY_ACTIONS.SAVE_MY_REQUESTS)) {
            const requests: Record<string, UserRequest> = {};
            return this.localforage_instance
                ?.iterate<UserRequest, void>((data, reference) => {
                    requests[reference] = data;
                })
                .then(() => requests)
                .catch((error) => {
                    rethrow(error, 'Could not get requests');
                });
        }
    }

    clearRequests() {
        return (this.localforage_instance || makeLocalforageInstance()).clear();
    }

    removeRequest(db_id: string) {
        if (Privacy.isAllowed(PRIVACY_ACTIONS.SAVE_MY_REQUESTS)) return this.localforage_instance?.removeItem(db_id);
    }
}
