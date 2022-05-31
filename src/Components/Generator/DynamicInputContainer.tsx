import type { ComponentChildren } from 'preact';
import type { IdDataElement } from '../../types/request';
import { useMemo, useState } from 'preact/hooks';
import { DynamicInput } from './DynamicInput';
import { Text, MarkupText, IntlProvider } from 'preact-i18n';
import t from '../../Utility/i18n';
import { adressesEqual, isFieldEmpty, EMTPY_ADDRESS } from '../../Utility/requests';
import { useGeneratorStore } from '../../store/generator';

type DynamicInputContainerProps = {
    id: string;
    fields: IdDataElement[];
    fillFields?: IdDataElement[];

    onAddField: (field: IdDataElement) => void;
    onRemoveField: (id: number) => void;
    onChange: (id: number, field: IdDataElement) => void;

    allowAddingFields?: boolean;
    allowRemovingFields?: boolean;
    allowChangingFieldDescriptions?: boolean;
    hasPrimary?: boolean;

    headingClass?: string;
    title?: string;
    children?: ComponentChildren;
};

export const DynamicInputContainer = (_props: DynamicInputContainerProps) => {
    const [inputTypeToAdd, setInputTypeToAdd] = useState<IdDataElement['type']>('input');
    const props = {
        allowAddingFields: true,
        allowRemovingFields: true,
        allowChaningFieldDescriptions: true,
        ..._props,
    };

    const address_count = useMemo(
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
                hasPrimary={props.hasPrimary && address_count > 1}
                value={field}
                allowRemoving={props.allowRemovingFields ?? true}
                allowChangingDescription={props.allowChangingFieldDescriptions ?? true}
            />
        );
    });

    const addFillField = (newField: IdDataElement) => {
        const index = props.fields.findIndex(
            (field) =>
                ['name', 'birthdate', 'email'].includes(field.type) &&
                field.type === newField.type &&
                field.desc === newField.desc
        );
        if (index >= 0 && props.fields[index].value !== newField.value) {
            const oldField = props.fields[index];
            // This is obviously true by the condition above, but not to typescript, so let's check explicitly
            if (oldField.type !== 'address' && newField.type !== 'address')
                props.onChange(index, { ...oldField, value: newField.value });
            return;
        }

        props.onAddField(newField);
    };

    // As this is at least the second time I have struggled to remember this: This is the button next to the 'add
    // new field' menu which allows you to add fields you have defined in the 'My saved data' section.
    const fill_fields = props.fillFields
        ?.map((field) => {
            const isFieldPresent = props.fields.some(
                (existingField: IdDataElement) =>
                    field.type === existingField.type &&
                    field.desc === existingField.desc &&
                    (field.value === existingField.value ||
                        (field.type === 'address' &&
                            existingField.type === 'address' &&
                            adressesEqual(field.value, existingField.value)))
            );

            if (!isFieldPresent && !isFieldEmpty(field)) {
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
                                onClick={() => addFillField(field)}
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
                {props.allowAddingFields && (
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
                        {props.fillFields && fill_fields && fill_fields.length > 0 && (
                            <div className="dropdown-container">
                                <button className="button button-primary" title={t('add-fill-field', 'generator')}>
                                    <span className="icon icon-fill" />
                                </button>
                                <div className="dropdown">
                                    <div style="display: table; border-spacing: 5px; width: 100%;">{fill_fields}</div>
                                </div>
                            </div>
                        )}
                        <div className="clearfix" />
                    </div>
                )}
            </div>
        </IntlProvider>
    );
};

export const StatefulDynamicInputContainer = (props: Partial<DynamicInputContainerProps>) => {
    const id_data = useGeneratorStore((state) => state.request.id_data);
    const setField = useGeneratorStore((state) => state.setField);
    const addField = useGeneratorStore((state) => state.addField);
    const removeField = useGeneratorStore((state) => state.removeField);

    return (
        <DynamicInputContainer
            id="id_data"
            fields={id_data}
            onAddField={(field) => addField(field, 'id_data')}
            onRemoveField={(id) => removeField(id, 'id_data')}
            onChange={(id, field) => setField(id, field, 'id_data')}
            {...props}
        />
    );
};
