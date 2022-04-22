import type { ComponentChildren } from 'preact';
import { useMemo } from 'preact/hooks';
import { DynamicInput } from './DynamicInput';
import { Text, MarkupText, IntlProvider } from 'preact-i18n';
import t from '../../Utility/i18n';
import { EMTPY_ADDRESS, IdDataElement } from 'request';
import { useState } from 'preact/hooks';
import { isAddress } from '../../Utility/requests';

type DynamicInputContainerProps = {
    id: string;
    title: string;
    headingClass: string;
    fields: IdDataElement[];
    fillFields?: IdDataElement[];

    onAddField: (field: IdDataElement) => void;
    onRemoveField: (id: number) => void;
    onChange: (id: number, field: IdDataElement) => void;

    allowAddingFields?: boolean;
    allowRemovingFields?: boolean;
    allowChangingFieldDescriptions?: boolean;
    hasPrimary?: boolean;

    children: ComponentChildren;
};

export const DynamicInputContainer = (props: DynamicInputContainerProps) => {
    const [inputTypeToAdd, setInputTypeToAdd] = useState<IdDataElement['type']>('input');

    const address_number = useMemo(
        () => props.fields.reduce((total, field) => total + (field.type === 'address' ? 1 : 0), 0),
        [props.fields]
    );
    const input_elements = props.fields.map((field, i) => {
        const field_uid = field.type + i; // TODO: This is not ok. It needs to be proper unique id! cf. #880 and #881
        return (
            <DynamicInput
                key={field_uid}
                id={field_uid}
                suffix={props.id}
                optional={field.optional}
                onChange={(field) => props.onChange(i, field)}
                onRemove={() => {
                    if (isFieldEmpty(props.fields[i]) || window.confirm(t('confirm-input-remove', 'generator'))) {
                        props.onRemoveField(i);
                    }
                }}
                hasPrimary={props.hasPrimary && address_number > 1}
                value={field}
                allowRemoving={props.allowRemovingFields ?? true}
                allowChangingDescription={props.allowChangingFieldDescriptions ?? true}
            />
        );
    });

    const addFillField = (newField: IdDataElement) => {
        props.fields.forEach((field, key) => {
            if (['name', 'birthdate', 'email'].includes(field.type) && field.type === newField.type) {
                newField.desc = field.desc;
                props.onChange(key, newField);
                return;
            }
        });
        props.onAddField(newField);
    };

    // As this is at least the second time I have struggled to remember this: This is the button next to the 'add
    // new field' menu which allows you to add fields you have defined in the 'My saved data' section.
    let fill_fields = props.fillFields
        ?.map((field) => {
            const condition = (addedField: IdDataElement) =>
                field.type === addedField.type && field.desc === addedField.desc;
            const isFieldPresent = props.fields.some(condition);

            if (!isFieldPresent && !!field.value) {
                return (
                    <div className="fill-field">
                        <div style="display: table-cell">
                            {field.desc}:{' '}
                            <span className="fill-field-value">
                                {field.type === 'address'
                                    ? field.value['street_1']
                                        ? field.value['street_1'] + ' …'
                                        : ''
                                    : field.value}
                            </span>
                        </div>
                        <div style="display: table-cell; width: 60px;">
                            <button
                                style="float: none;"
                                className="button button-small button-primary icon-arrow-right"
                                onClick={() => {
                                    addFillField(field);
                                }}
                                title={t('add-input', 'generator')}
                            />
                        </div>
                    </div>
                );
            }

            return null;
        })
        .filter((elem) => elem !== null);

    return (
        <IntlProvider scope="generator" definition={window.I18N_DEFINITION}>
            <div className="dynamic-input-container">
                {props.title && <h2 className={props.headingClass}>{props.title}</h2>}
                {props.children}
                <div id={'request-dynamic-input-' + props.id}>{input_elements}</div>
                {props.allowAddingFields ? (
                    <div className="dynamic-input-controls">
                        <MarkupText id="add-dynamic-input-explanation" />
                        <br />
                        <div className="select-container">
                            <select
                                id={'dynamic-input-type-' + props.id}
                                onBlur={(e) => setInputTypeToAdd(e.currentTarget.value as IdDataElement['type'])}
                                onChange={(e) => setInputTypeToAdd(e.currentTarget.value as IdDataElement['type'])}>
                                <option value="input" selected>
                                    <Text id="input-single-line" />
                                </option>
                                <option value="textarea">
                                    <Text id="input-multi-line" />
                                </option>
                                <option value="address">
                                    <Text id="input-address" />
                                </option>
                            </select>
                            <div className="icon icon-arrow-down" style="top: 10px;" />
                        </div>
                        <button
                            className="button button-secondary"
                            id={'add-dynamic-inputs-' + props.id}
                            onClick={() =>
                                props.onAddField(
                                    inputTypeToAdd === 'address'
                                        ? {
                                              desc: '',
                                              type: inputTypeToAdd,
                                              optional: true,
                                              value: EMTPY_ADDRESS,
                                          }
                                        : {
                                              desc: '',
                                              type: inputTypeToAdd,
                                              optional: true,
                                              value: '',
                                          }
                                )
                            }>
                            <Text id="add-input" />
                        </button>
                        {props.fillFields && fill_fields && fill_fields.length > 0 ? (
                            <div className="dropdown-container">
                                <button className="button button-primary" title={t('add-fill-field', 'generator')}>
                                    <span className="icon icon-fill" />
                                </button>
                                <div className="dropdown">
                                    <div style="display: table; border-spacing: 5px; width: 100%;">{fill_fields}</div>
                                </div>
                            </div>
                        ) : null}
                        <div className="clearfix" />
                    </div>
                ) : (
                    []
                )}
            </div>
        </IntlProvider>
    );
};

// returns boolean whether the field has value based on its type
function isFieldEmpty(field: IdDataElement) {
    if (typeof field.value === 'string' && field.value.trim()) {
        return false;
    } else if (isAddress(field.value)) {
        for (let [key, value] of Object.entries(field.value)) {
            if (key !== 'primary' && value) {
                return false;
            }
        }
    }
    return true;
}
