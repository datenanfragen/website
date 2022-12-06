import type { ComponentChildren } from 'preact';
import type { IdDataElement } from '../../types/request';
import { useMemo } from 'preact/hooks';
import { DynamicInput } from './DynamicInput';
import { Text, IntlProvider } from 'preact-i18n';
import t from '../../Utility/i18n';
import { adressesEqual, isFieldEmpty, EMTPY_ADDRESS } from '../../Utility/requests';
import { useGeneratorStore } from '../../store/generator';

type DynamicInputContainerProps = {
    id: string;
    fields: IdDataElement[];
    fillFields?: IdDataElement[];
    fieldFilter?: (field: IdDataElement) => boolean;

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
    const props = {
        allowAddingFields: true,
        allowRemovingFields: true,
        allowChangingFieldDescriptions: true,
        ..._props,
    };

    const address_count = useMemo(
        () => props.fields.reduce((total, field) => total + (field.type === 'address' ? 1 : 0), 0),
        [props.fields]
    );

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

        props.onAddField({ ...newField, optional: true });
    };

    // As this is at least the second time I have struggled to remember this: This is the button next to the 'add
    // new field' menu which allows you to add fields you have defined in the 'My saved data' section.
    const fill_fields = props.fillFields
        ?.map((field, idx) => {
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
                    <div className="field-add-group">
                        <label htmlFor={`add-fill-field-${props.id}-${idx}`}>
                            {field.desc}:{' '}
                            <span className="fill-field-value">
                                {field.type === 'address'
                                    ? field.value['street_1']
                                        ? field.value['street_1'] + ' …'
                                        : ''
                                    : field.value}
                            </span>
                        </label>
                        <button
                            id={`add-fill-field-${props.id}-${idx}`}
                            style="float: none;"
                            className="button button-small button-secondary icon-arrow-right"
                            onClick={() => addFillField(field)}
                            title={t('add-input', 'generator')}
                        />
                    </div>
                );
            }
        })
        .filter((elem) => elem);

    return (
        <IntlProvider scope="generator" definition={window.I18N_DEFINITION}>
            <div className="dynamic-input-container">
                {props.title && <h2 className={props.headingClass}>{props.title}</h2>}
                {props.children}
                <div id={'request-dynamic-input-' + props.id}>
                    {props.fields.filter(props.fieldFilter || (() => true)).map((field, i) => {
                        const field_uid = field.type + i; // TODO: This is not ok. It needs to be proper unique id! cf. #880 and #881
                        return (
                            <DynamicInput
                                key={field_uid}
                                id={field_uid}
                                suffix={props.id}
                                optional={field.optional}
                                onChange={(field) => props.onChange(i, field)}
                                onRemove={() => {
                                    if (
                                        isFieldEmpty(props.fields[i]) ||
                                        window.confirm(t('confirm-input-remove', 'generator'))
                                    ) {
                                        props.onRemoveField(i);
                                    }
                                }}
                                hasPrimary={props.hasPrimary && address_count > 1}
                                value={field}
                                allowRemoving={props.allowRemovingFields}
                                allowChangingDescription={props.allowChangingFieldDescriptions}
                            />
                        );
                    })}
                </div>
                <div className="dynamic-input-controls">
                    {props.allowAddingFields && (
                        <div className="dropup-container">
                            <button
                                className="button button-small button-secondary icon icon-fill"
                                id={'add-dynamic-inputs-' + props.id}>
                                <Text id="add-input" />
                            </button>
                            <div className="dropup">
                                <div style="display: table; border-spacing: 5px; width: 100%;">
                                    {(
                                        [
                                            { inputType: 'input', text: 'input-single-line' },
                                            { inputType: 'textarea', text: 'input-multi-line' },
                                            { inputType: 'address', text: 'input-address' },
                                        ] as Array<{ inputType: IdDataElement['type']; text: string }>
                                    ).map((input) => (
                                        <div className="field-add-group">
                                            <label htmlFor={`add-input-${props.id}-${input.inputType}`}>
                                                <Text id={input.text} />
                                            </label>
                                            <button
                                                style="float: none;"
                                                id={`add-input-${props.id}-${input.inputType}`}
                                                className="button button-small button-secondary icon-arrow-right"
                                                onClick={() =>
                                                    props.onAddField(
                                                        input.inputType === 'address'
                                                            ? {
                                                                  desc: t('custom-input-desc', 'id-data-controls'),
                                                                  type: input.inputType,
                                                                  optional: true,
                                                                  value: EMTPY_ADDRESS,
                                                              }
                                                            : {
                                                                  desc: t('custom-input-desc', 'id-data-controls'),
                                                                  type: input.inputType,
                                                                  optional: true,
                                                                  value: '',
                                                              }
                                                    )
                                                }
                                            />
                                        </div>
                                    ))}
                                    {fill_fields && fill_fields.length > 0 && (
                                        <>
                                            <hr />
                                            {fill_fields}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </IntlProvider>
    );
};

export const StatefulDynamicInputContainer = (props: Exclude<Partial<DynamicInputContainerProps>, 'id_data'>) => {
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
