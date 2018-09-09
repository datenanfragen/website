import localforage from 'localforage';
import {rethrow} from "./errors";

export default class IdData {
    constructor() {
        this.localforage_instance = localforage.createInstance({
            'name': 'Datenanfragen.de',
            'storeName': 'id-data'
        })
    }

    store(data) {
        if(!data['desc']) return;
        let to_store = deepCopyObject(data);
        delete to_store['optional'];
        if(typeof to_store['value'] === 'object') delete to_store['value']['primary'];
        this.localforage_instance.setItem(data['desc'], to_store).catch((error) => {
            rethrow(error, 'Saving id_data failed.', { desc: to_store['desc'] });
        });
    }

    storeArray(array) {
        array.forEach((item) => {
            this.store(item);
        });
    }

    // returns Promise
    getByDesc(desc) {
        return this.localforage_instance.getItem(desc).catch((error) => {
            rethrow(error, 'Could not retrieve id_data.', { desc: desc });
        });
    }

    getAll() {
        let id_data = [];
        return new Promise((resolve, reject) => {
            localforage.iterate((data, desc) => {
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

    clear() {
        this.localforage_instance.clear();
    }

    static mergeFields(fields_to_add_to, fields_to_merge) {
        let new_fields = fields_to_merge.slice();
        let old_fields = fields_to_add_to.slice();
        let merged_fields = [];
        let has_primary_address = 0;
        old_fields.forEach((field, i) => { // TODO: How to keep user added inputs and remove machine added inputs? Or do we even need to?
            let j = new_fields.findIndex(new_field => {
                return new_field['type'] === field['type'] && new_field['desc'] === field['desc']; // Is it a good idea to also check for desc?
            });
            if(typeof j !== 'undefined' && j >= 0) {
                field['optional'] = 'optional' in new_fields[j] ? new_fields[j]['optional'] : false;
                if(field['type'] === 'address') field['value']['primary'] = ++has_primary_address === 1;
                merged_fields.push(field);
                new_fields.splice(j, 1);
            }
        });
        return merged_fields.concat(new_fields.map(field => {
            field['value'] = field['value'] || (field['type'] === 'address' ? {"primary": ++has_primary_address === 1} : '');
            return field;
        }));
    }
}

// This is hideous but the only way to deep copy objects or arrays…
export function deepCopyObject(object) {
    return JSON.parse(JSON.stringify(object));
}
