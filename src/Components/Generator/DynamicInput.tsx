import type { Address, AddressIdData, IdDataElement } from '../../types/request';
import type { JSX } from 'preact';
import { useState } from 'preact/hooks';
import { Text, IntlProvider } from 'preact-i18n';
import t from '../../Utility/i18n';
import { ADDRESS_STRING_PROPERTIES } from '../../Utility/requests';
import { produce } from 'immer';

type DynamicInputProps = {
    id: string;
    suffix: string;
    value: IdDataElement;

    optional?: boolean;
    allowRemoving?: boolean;
    allowChangingDescription?: boolean;
    hasPrimary?: boolean;
    initiallyEditable?: boolean;

    onChange: (value: IdDataElement) => void;
    onRemove: () => void;
};

export const DynamicInput = (props: DynamicInputProps) => {
    const inputProps = {
        id: props.id,
        type: props.value.type,
        suffix: props.suffix,
        required: !props.optional || !props.value.optional,
        onChange: (field_value: string | Address) =>
            props.onChange(
                produce((id_data: IdDataElement) => {
                    id_data.value = field_value;
                })(props.value)
            ),
        value: props.value.value,
        // The controls usually automatically add a label if they know their description. If changing
        // the description is not allowed, though, a label is already set simply by the description
        // text. In that case, we obviously don't want to generate a second label.
        suppressLabel: props.allowChangingDescription,
    } as InputControlProps;

    const [isEditable, setIsEditable] = useState(props.initiallyEditable || false);
    const [showControls, setShowControls] = useState(false);

    return (
        <IntlProvider scope="generator" definition={window.I18N_DEFINITION}>
            <div
                className={`dynamic-input dynamic-input-${props.value.type} form-group form-row ${
                    props.allowRemoving || props.allowChangingDescription ? 'dynamic-input-editable ' : ''
                }${isEditable ? 'dynamic-input-edit-mode ' : ''}${showControls ? 'dynamic-input-show-controls ' : ''}`}
                id={`dynamic-input-${props.id}-${props.suffix}`}>
                <div className="col40 col100-mobile">
                    {/* This is just a JavaScript hack because CSS dosn't have a 'clicked-once' pseudo class. Since we hide the buttons only visually anyway, there is no need to also have keyboard interactions. */}
                    {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
                    <div
                        className="form-group-label"
                        aria-haspopup={true}
                        onClick={() => setShowControls(!showControls)}>
                        {(props.allowChangingDescription || props.allowRemoving) && (
                            <button
                                className={`button button-secondary button-small ${
                                    isEditable ? 'icon-close-circle' : 'icon-pencil'
                                }`}
                                onClick={() => setIsEditable(!isEditable)}
                                title={t(isEditable ? 'stop-editing-fields' : 'edit-fields', 'generator')}
                            />
                        )}
                        {props.allowRemoving && (
                            <button
                                id={`${props.id}-delete-${props.suffix}`}
                                data-dynamic-input-id={props.id}
                                className="dynamic-input-delete button button-secondary button-small icon-trash"
                                onClick={props.onRemove}
                                title={t('delete-field', 'generator')}
                            />
                        )}
                        {props.allowChangingDescription && isEditable && (
                            <>
                                <label htmlFor={`${props.id}-desc-${props.suffix}`} className="sr-only">
                                    <Text id="description" />
                                </label>
                                <input
                                    name="desc"
                                    type="text"
                                    id={`${props.id}-desc-${props.suffix}`}
                                    data-dynamic-input-id={props.id}
                                    className="form-element"
                                    value={props.value.desc}
                                    placeholder={t('description', 'generator')}
                                    required={!props.optional || !props.value.optional}
                                    onBlur={(e) =>
                                        props.onChange(
                                            produce((id_data: IdDataElement) => {
                                                id_data.desc = e.currentTarget.value;
                                            })(props.value)
                                        )
                                    }
                                />
                            </>
                        )}
                        <label
                            className={`dynamic-input-label${isEditable ? ' sr-only' : ''}`}
                            htmlFor={`${props.id}-${props.value.type === 'address' ? 'container' : 'value'}-${
                                props.suffix
                            }`}
                            aria-live="polite">
                            {props.value.desc}
                        </label>
                    </div>
                    {props.hasPrimary && props.value.type === 'address' && (
                        <button
                            id={`${props.id}-primaryButton`}
                            data-dynamic-input-id={props.id}
                            className="button button-secondary dynamic-input-primaryButton"
                            data-isprimary={props.value.value.primary}
                            onClick={() => {
                                if (props.value.type === 'address') {
                                    props.onChange(
                                        produce((id_data: AddressIdData) => {
                                            id_data.value.primary = true;
                                        })(props.value)
                                    );
                                }
                            }}>
                            <Text id="primary-address" />
                        </button>
                    )}
                </div>
                <div className="form-group-input col60 col100-mobile">
                    <InputControl {...inputProps} />
                </div>
            </div>
        </IntlProvider>
    );
};

type ControlProps<T> = {
    id: string;
    suffix: string;
    suppressLabel?: boolean;
    desc?: string;
    required?: boolean;
    value: T;
    onChange: (value: T) => void;
};

type InputControlProps =
    | ({ type: 'address' } & ControlProps<Address>)
    | ({ type: Exclude<IdDataElement['type'], 'address'> } & ControlProps<string>);

// TODO: I removed an old bugfix (commit e2bcff7e461c36a256daa9a29a7baedca4468fa3) that seemed more like a workaround to me, suppressing rerenders with shouldComponentUpdate to prevent components from loosing focus. If the bug is introduced again, the root cause should be fixed instead, because preact should keep the elements if it is done correctly.
export const InputControl = (props: InputControlProps) => {
    if (props.type === 'address') {
        const handleChange = (property: keyof Address, field_value: string) =>
            props.onChange(
                produce((value: Address) => {
                    if (property === 'primary') value[property] = field_value === 'true';
                    else value[property] = field_value;
                })(props.value)
            );

        return (
            <div id={`${props.id}-container-${props.suffix}`} className="address-input-container">
                {ADDRESS_STRING_PROPERTIES.map((property) => (
                    <div className="form-group fancy-fg">
                        <input
                            key={property}
                            data-dynamic-input-id={props.id}
                            type="text"
                            id={`${props.id}-${property}-${props.suffix}`}
                            placeholder={t(`address-${property}`, 'generator')}
                            className="form-element"
                            required={props.required}
                            onBlur={(e) => handleChange(property, e.currentTarget.value)}
                            value={props.value[property]}
                        />
                        <label className="fancy-label" htmlFor={`${props.id}-${property}-${props.suffix}`}>
                            <Text id={`address-${property}`} />
                        </label>
                    </div>
                ))}
            </div>
        );
    }

    const componentProps = {
        id: `${props.id}-value-${props.suffix}`,
        'data-dynamic-input-id': props.id,
        className: 'form-element',
        placeholder: t('value', 'generator'),
        required: props.required,
        onBlur: (e: JSX.TargetedEvent<HTMLInputElement | HTMLTextAreaElement>) => props.onChange(e.currentTarget.value),
        value: props.value,
    };

    return props.type === 'textarea' ? (
        <textarea {...componentProps} />
    ) : (
        <input
            type={props.type === 'birthdate' ? 'date' : props.type === 'email' ? 'email' : 'text'}
            {...componentProps}
        />
    );
};
