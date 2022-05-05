import localforage from 'localforage';
import { RequestType, ResponseType } from 'request';
import { rethrow } from '../Utility/errors';
import Privacy, { PRIVACY_ACTIONS } from '../Utility/Privacy';

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

    storeRequest(db_id: string, item: UserRequest) {
        if (Privacy.isAllowed(PRIVACY_ACTIONS.SAVE_MY_REQUESTS)) {
            this.localforage_instance
                ?.setItem(db_id, item)
                .catch((error) => rethrow(error, 'Saving request failed.', { db_id }));
        }
    }

    getRequest(db_id: string) {
        if (Privacy.isAllowed(PRIVACY_ACTIONS.SAVE_MY_REQUESTS)) {
            return this.localforage_instance?.getItem<UserRequest>(db_id);
        }
    }

    getRequests() {
        if (Privacy.isAllowed(PRIVACY_ACTIONS.SAVE_MY_REQUESTS)) {
            const requests: Record<string, UserRequest> = {};
            return new Promise<Record<string, UserRequest>>((resolve, reject) => {
                this.localforage_instance
                    ?.iterate<UserRequest, void>((data, reference) => {
                        requests[reference] = data;
                    })
                    .then(() => resolve(requests))
                    .catch((error) => {
                        rethrow(error, 'Could not get requests');
                        reject();
                    });
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
