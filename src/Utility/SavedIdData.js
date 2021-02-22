import { rethrow, WarningException } from './errors';
import Cookie from 'js-cookie';
import localforage from 'localforage';
import { deepCopyObject } from './common';

export const ID_DATA_CHANGE_EVENT = 'saved_data-change';
export const ID_DATA_CLEAR_EVENT = 'saved_data-clear';

export default class SavedIdData {
    constructor() {
        this.localforage_instance = localforage.createInstance({
            name: 'Datenanfragen.de',
            storeName: 'id-data',
        });
    }

    store(data) {
        if (data['desc'] === '') return;
        let to_store = deepCopyObject(data);
        delete to_store['optional'];
        if (typeof to_store['value'] === 'object') delete to_store['value']['primary'];
        this.localforage_instance
            .setItem(data['desc'].replace('/::/g', '__'), to_store)
            .catch((error) => {
                // '::' is a special character and disallowed in the database for user inputs. The user will not encounter that as the description will be saved in the original state with the data object.
                rethrow(error, 'Saving id_data failed.', { desc: to_store['desc'] });
            })
            .then(() => {
                window.dispatchEvent(new CustomEvent(ID_DATA_CHANGE_EVENT, { detail: data }));
            });
    }

    storeFixed(data) {
        let to_store = deepCopyObject(data);
        switch (data.type) {
            case 'name':
            case 'birthdate':
            case 'email':
                break;
            case 'address':
                to_store['value']['primary'] = true;
                break;
            default:
                throw new WarningException('storeFixed only stores special data types.', this);
        }
        this.localforage_instance
            .setItem(data.type + '::fixed', to_store)
            .catch((error) => {
                rethrow(error, 'Saving id_data failed.', { desc: to_store['desc'] });
            })
            .then(() => {
                window.dispatchEvent(new CustomEvent(ID_DATA_CHANGE_EVENT, { detail: data }));
            });
    }

    storeArray(array, fixed_only = true) {
        array.forEach((item) => {
            if (['name', 'birthdate', 'email'].includes(item.type) || (item.type === 'address' && item.value.primary)) {
                this.storeFixed(item);
            } else if (!fixed_only) {
                this.store(item);
            }
        });
    }

    // objects that behave like arrays
    storeArrayLike(array_like, fixed_only = true) {
        for (let key in array_like) {
            let item = array_like[key];
            if (['name', 'birthdate', 'email'].includes(item.type) || (item.type === 'address' && item.value.primary))
                this.storeFixed(item);
            else if (!fixed_only) this.store(item);
        }
    }

    storeSignature(signature) {
        this.localforage_instance
            .setItem('::signature', signature)
            .catch((error) => {
                rethrow(error, 'Saving signature failed.', { signature: signature });
            })
            .then(() => {
                window.dispatchEvent(new CustomEvent(ID_DATA_CHANGE_EVENT));
            });
    }

    // returns Promise
    getByDesc(desc) {
        return this.localforage_instance.getItem(desc.replace('/::/g', '__')).catch((error) => {
            rethrow(error, 'Could not retrieve id_data.', { desc: desc });
        });
    }

    // returns Promise
    getFixed(type) {
        return this.localforage_instance.getItem(type + '::fixed').catch((error) => {
            rethrow(error, 'Could not retrieve fixed id_data.', { type: type });
        });
    }

    // returns Promise
    getSignature() {
        return this.localforage_instance
            .getItem('::signature')
            .then((s) => s || { type: 'text', value: '' })
            .catch((error) => {
                rethrow(error, 'Could not retrieve signature.');
            });
    }

    getAllFixed() {
        let id_data = [];
        return new Promise((resolve, reject) => {
            this.localforage_instance
                .iterate((data, desc) => {
                    if (desc.match(/.*?::fixed$/)) id_data.push(data);
                })
                .then(() => {
                    resolve(id_data);
                })
                .catch((error) => {
                    rethrow(error, 'Could not retrieve all fixed id_data');
                    reject();
                });
        });
    }

    getAll(exclude_fixed = true) {
        let id_data = [];
        return new Promise((resolve, reject) => {
            this.localforage_instance
                .iterate((data, desc) => {
                    if ((!desc.match(/.*?::fixed$/) || !exclude_fixed) && !desc.match(/.*?::signature$/))
                        id_data.push(data);
                })
                .then(() => {
                    resolve(id_data);
                })
                .catch((error) => {
                    rethrow(error, 'Could not retrieve all id_data');
                    reject();
                });
        });
    }

    clear(silent = true) {
        return this.localforage_instance.clear().then(() => {
            if (!silent) window.dispatchEvent(new CustomEvent(ID_DATA_CLEAR_EVENT));
        });
    }

    static mergeFields(
        fields_to_add_to,
        fields_to_merge,
        keep = false,
        override_values = false,
        protect_desc = false,
        preserve_optional = false,
        add_new_fields = true
    ) {
        let new_fields = fields_to_merge.slice();
        let old_fields = fields_to_add_to.slice();
        let merged_fields = [];
        let has_primary_address = 0;
        old_fields.forEach((field, i) => {
            // TODO: How to keep user added inputs and remove machine added inputs? Or do we even need to?
            let j = new_fields.findIndex((new_field) => {
                return (
                    (new_field['type'] === field['type'] &&
                        // type and descriptions are equal
                        (new_field['desc'] === field['desc'] ||
                            // type is equal and field is of fixed type
                            ['name', 'birthdate', 'email'].includes(field['type']))) ||
                    // both fields are primary addresses
                    (field['type'] === 'address' &&
                        !!new_field['value'] &&
                        !!field['value'] &&
                        new_field['value']['primary'] &&
                        field['value']['primary'])
                );
            });
            if (typeof j !== 'undefined' && j >= 0) {
                if (!protect_desc) field['desc'] = new_fields[j]['desc']; // should only matter for fixed types
                if (!preserve_optional)
                    field['optional'] = 'optional' in new_fields[j] ? new_fields[j]['optional'] : false;
                if (field['type'] === 'address') field['value']['primary'] = ++has_primary_address === 1;
                if (override_values) field['value'] = new_fields[j]['value'];
                merged_fields.push(field);
                new_fields.splice(j, 1);
            } else if (keep) {
                if (field['type'] === 'address') field['value']['primary'] = ++has_primary_address === 1;
                merged_fields.push(field);
            }
        });

        if (add_new_fields) {
            merged_fields = merged_fields.concat(
                new_fields.map((field) => {
                    if (!!field['value'] && field['type'] === 'address')
                        field['value']['primary'] = ++has_primary_address === 1;
                    field['value'] =
                        field['value'] || (field['type'] === 'address' ? { primary: ++has_primary_address === 1 } : '');
                    return field;
                })
            );
        }

        return merged_fields;
    }

    static setAlwaysFill(value) {
        Cookie.set('general-always_fill_in', value, { expires: 365 });
    }

    static shouldAlwaysFill() {
        let value = Cookie.get('general-always_fill_in');
        return value === undefined || value === 'true';
    }
}
