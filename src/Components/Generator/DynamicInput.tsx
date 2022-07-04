import type { Address, AddressIdData, IdDataElement } from '../../types/request';
import type { JSX } from 'preact';
import { useState, useRef } from 'preact/hooks';
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

    const descInput = useRef<HTMLInputElement>(null);

    return (
        <IntlProvider scope="generator" definition={window.I18N_DEFINITION}>
            <div
                className={`dynamic-input dynamic-input-${props.value.type} form-group form-row ${
                    props.allowRemoving || props.allowChangingDescription ? 'dynamic-input-editable ' : ''
                }${isEditable ? 'dynamic-input-edit-mode ' : ''}`}
                id={`dynamic-input-${props.id}-${props.suffix}`}>
                <div className="col40 col100-mobile">
                    <div className="form-group-label" aria-haspopup={true}>
                        {props.allowRemoving && (
                            <button
                                id={`${props.id}-delete-${props.suffix}`}
                                data-dynamic-input-id={props.id}
                                className="dynamic-input-delete button button-secondary button-small icon-trash"
                                onClick={props.onRemove}
                                title={t('delete-field', 'generator', {
                                    field_name: props.value.desc || t('unnamed-field', 'generator'),
                                })}
                            />
                        )}

                        {/* The click event is only for us measly sighted people. Keyboard/screen reader users can just focus the input directly. */}
                        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */}
                        <label
                            className={`dynamic-input-label${isEditable ? ' sr-only' : ''}`}
                            htmlFor={`${props.id}-${props.value.type === 'address' ? 'container' : 'value'}-${
                                props.suffix
                            }`}
                            onClick={(e) => {
                                if (!props.allowChangingDescription) return;

                                // By default, clicking the label will focus the associated input.
                                e.preventDefault();
                                setIsEditable(true);
                                descInput.current?.focus();
                                descInput.current?.select();
                            }}
                            aria-live="polite">
                            {props.value.desc}
                        </label>
                        <div
                            className={!(props.allowChangingDescription && isEditable) ? 'sr-only' : ''}
                            onFocus={() => setIsEditable(true)}>
                            <label htmlFor={`${props.id}-desc-${props.suffix}`} className="sr-only">
                                <Text id="description" />
                            </label>
                            <input
                                name="desc"
                                type="text"
                                ref={descInput}
                                id={`${props.id}-desc-${props.suffix}`}
                                data-dynamic-input-id={props.id}
                                className="form-element"
                                value={props.value.desc}
                                placeholder={t('description', 'generator')}
                                disabled={!props.allowChangingDescription}
                                onBlur={(e) => {
                                    props.onChange(
                                        produce((id_data: IdDataElement) => {
                                            id_data.desc = e.currentTarget.value;
                                        })(props.value)
                                    );
                                    setIsEditable(false);
                                }}
                            />
                        </div>
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
                <div className="col60 col100-mobile">
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
