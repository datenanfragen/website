import localforage from 'localforage';
import Cookie from 'js-cookie';
import { rethrow } from '../Utility/errors';

// TODO: This should probably also be a (persisted) zustand store but since the generator and privacy controls also use
// this, I can't convert it yet.
export class SavedCompanies {
    localforage_instance: typeof localforage;

    constructor() {
        // TODO: Only create instance after the user changed something.
        this.localforage_instance = localforage.createInstance({
            name: 'Datenanfragen.de',
            storeName: 'wizard-companies',
        });
    }

    length() {
        return this.localforage_instance.length();
    }

    add(slug: string, name: string, by_user = true) {
        if (by_user) this.setUserChanged();
        return this.localforage_instance
            .setItem(slug, name)
            .catch((err) => rethrow(err, 'Could not save company for the wizard', { slug, name }));
    }
    addMultiple(companies: Record<string, string>, by_user = true) {
        if (by_user) this.setUserChanged();
        return Promise.all(Object.keys(companies).map((slug) => this.add(slug, companies[slug], by_user)));
    }

    remove(slug: string, by_user = true) {
        if (by_user) this.setUserChanged();
        if (slug) return this.localforage_instance.removeItem(slug);
    }
    clearAll() {
        this.setUserChanged(false);
        return this.localforage_instance.clear().catch((err) => rethrow(err, 'Could clear saved companies.'));
    }

    getUserChanged() {
        return Cookie.get('changed_saved_companies') === 'true';
    }
    setUserChanged(value = true) {
        if (value)
            Cookie.set('changed_saved_companies', `${value}`, { expires: 365, secure: true, sameSite: 'strict' });
        else Cookie.remove('changed_saved_companies');
    }

    getAll() {
        const companies: Record<string, string> = {};

        return new Promise<Record<string, string>>((resolve, reject) => {
            this.localforage_instance
                .iterate((name: string, slug: string) => {
                    companies[slug] = name;
                })
                .then(() => resolve(companies))
                .catch((err) => {
                    rethrow(err, 'Could not get saved companies for the wizard');
                    reject();
                });
        });
    }
}
