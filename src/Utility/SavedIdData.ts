import { rethrow, WarningException } from './errors';
import Cookie from 'js-cookie';
import LocalForage from 'localforage';
import { EMTPY_ADDRESS, IdDataElement, Signature } from 'request';
import { produce } from 'immer';

export default class SavedIdData {
    localforage_instance: LocalForage;

    constructor() {
        this.localforage_instance = LocalForage.createInstance({
            name: 'Datenanfragen.de',
            storeName: 'id-data',
        });
    }

    store(data: IdDataElement) {
        if (data.desc === '') return;

        const to_store = produce((d: IdDataElement) => {
            d.optional = undefined;
            if (d.type === 'address') d.value.primary = undefined;
        })(data);

        return this.localforage_instance.setItem(data.desc.replace('/::/g', '__'), to_store).catch((error) => {
            // '::' is a special character and disallowed in the database for user inputs. The user will not encounter that as the description will be saved in the original state with the data object.
            rethrow(error, 'Saving id_data failed.', { desc: to_store['desc'] });
        });
    }

    storeFixed(data: IdDataElement) {
        const to_store = produce((d: IdDataElement) => {
            switch (d.type) {
                case 'name':
                case 'birthdate':
                case 'email':
                    break;
                case 'address':
                    d.value.primary = true;
                    break;
                default:
                    throw new WarningException('storeFixed only stores special data types.', d);
            }
        })(data);

        this.localforage_instance.setItem(data.type + '::fixed', to_store).catch((error) => {
            rethrow(error, 'Saving id_data failed.', { desc: to_store['desc'] });
        });
    }

    storeArray(array: IdDataElement[], fixed_only = true) {
        if (fixed_only) array = array.filter(fixed_condition);
        return Promise.all(
            array.map((item) => {
                if (fixed_condition(item)) {
                    return this.storeFixed(item);
                } else if (!fixed_only) {
                    return this.store(item);
                }
            })
        );
    }

    storeSignature(signature: Signature) {
        return this.localforage_instance.setItem('::signature', signature).catch((error) => {
            rethrow(error, 'Saving signature failed.', { signature });
        });
    }

    getByDesc(desc: string) {
        return this.localforage_instance.getItem(desc.replace('/::/g', '__')).catch((error) => {
            rethrow(error, 'Could not retrieve id_data.', { desc });
        });
    }

    getFixed(type: 'name' | 'birthdate' | 'email' | 'address') {
        return this.localforage_instance.getItem(type + '::fixed').catch((error) => {
            rethrow(error, 'Could not retrieve fixed id_data.', { type });
        });
    }

    getSignature(): Promise<Signature | null | void> {
        return this.localforage_instance.getItem<Signature>('::signature').catch((error) => {
            rethrow(error, 'Could not retrieve signature.');
        });
    }

    getAllFixed() {
        const id_data: IdDataElement[] = [];
        return this.localforage_instance
            .iterate((data: IdDataElement, desc) => {
                if (desc.match(/.*?::fixed$/)) id_data.push(data);
            })
            .then(() => {
                return id_data;
            })
            .catch((error) => {
                rethrow(error, 'Could not retrieve all fixed id_data');
            });
    }

    getAll(exclude_fixed = true) {
        const id_data: IdDataElement[] = [];
        return this.localforage_instance
            .iterate((data: IdDataElement, desc) => {
                if ((!desc.match(/.*?::fixed$/) || !exclude_fixed) && !desc.match(/.*?::signature$/))
                    id_data.push(data);
            })
            .then(() => {
                return id_data;
            })
            .catch((error) => {
                rethrow(error, 'Could not retrieve all id_data');
            });
    }

    clear() {
        return this.localforage_instance.clear();
    }

    /**
     * Merges `fields_to_merge` into `fields_to_add_to` to create a new array of `IdDataElements` which contains the data of the `fields_to_merge`. Fields are merged, either if their type and description match, if the type matches and is also a "fixed" type (i.e. non-generic type like 'email'), or if they both contain an address marked as `primary` (also cf. `mergeCondition`).
     * @param fields_to_add_to Fields in which the data should be merged.
     * @param fields_to_merge Data which is supposed to be merged into the fields.
     * @param keep If this flag is true, fields which have no corresponding merging candidate in `fields_to_merge` are still kept. Otherwise they are dropped.
     * @param override_values Whether to override the values in `fields_to_add_to` with values from `fields_to_merge`.
     * @param protect_desc Whether to override the description of `fields_to_add_to` with descriptions of `fields_to_merge`.
     * @param preserve_optional Whether to override the optional property of `fields_to_add_to` with the property value in `fields_to_merge`.
     * @param add_new_fields If this is true, fields `fields_to_merge` which were not merged into existing fields are still added to the result.
     */
    static mergeFields(
        fields_to_add_to: Readonly<IdDataElement[]>,
        fields_to_merge: IdDataElement[],
        keep = false,
        override_values = false,
        protect_desc = false,
        preserve_optional = false,
        add_new_fields = true
    ) {
        const new_fields = fields_to_merge.slice();

        let has_primary_address = 0;
        const merged_fields = fields_to_add_to.reduce((merged_fields: IdDataElement[], old_field) => {
            const field = produce((old_field: IdDataElement) => {
                // TODO: How to keep user added inputs and remove machine added inputs? Or do we even need to?
                const candidate_index = new_fields.findIndex((new_field) => mergeCondition(new_field, old_field));

                if (candidate_index && candidate_index >= 0) {
                    const candidate = new_fields[candidate_index];
                    if (!protect_desc) old_field.desc = candidate.desc; // should only matter for fixed types
                    if (!preserve_optional) old_field.optional = candidate?.optional;
                    if (override_values) old_field.value = candidate.value;
                    if (old_field.type === 'address') old_field.value.primary = ++has_primary_address === 1;
                    new_fields.splice(candidate_index, 1);
                } else if (keep) {
                    if (old_field.type === 'address') old_field.value.primary = ++has_primary_address === 1;
                }
                return undefined;
            })(old_field);
            return field ? [...merged_fields, field] : merged_fields;
        }, []);

        if (add_new_fields) {
            return merged_fields.concat(
                new_fields.map(
                    produce((field) => {
                        if (field.value && field.type === 'address') field.value.primary = ++has_primary_address === 1;
                        field.value =
                            field.value ||
                            (field.type === 'address'
                                ? { ...EMTPY_ADDRESS, primary: ++has_primary_address === 1 }
                                : '');
                        return field;
                    })
                )
            );
        }

        return merged_fields;
    }

    static setAlwaysFill(always_fill: boolean | string) {
        Cookie.set('general-always_fill_in', always_fill.toString(), {
            expires: 365,
            secure: true,
            sameSite: 'strict',
        });
    }

    static shouldAlwaysFill() {
        return (Cookie.get('general-always_fill_in') ?? 'true') === 'true';
    }
}

const fixed_condition = (item: IdDataElement) =>
    ['name', 'birthdate', 'email'].includes(item.type) || (item.type === 'address' && item.value.primary);

const mergeCondition = (new_field: IdDataElement, old_field: IdDataElement) =>
    (new_field.type === old_field.type &&
        // type and descriptions are equal
        (new_field.desc === old_field.desc ||
            // OR type is equal and field is of fixed type
            ['name', 'birthdate', 'email'].includes(old_field.type))) ||
    (old_field.type === 'address' &&
        new_field.type === 'address' &&
        new_field.value &&
        old_field.value &&
        old_field.value.primary &&
        new_field.value.primary);
// OR both fields are primary addresses
