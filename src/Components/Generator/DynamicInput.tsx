import type { JSX } from 'preact';
import type { Address, AddressIdData, IdDataElement } from '../../types/request';
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

    return (
        <IntlProvider scope="generator" definition={window.I18N_DEFINITION}>
            <div
                className={`dynamic-input dynamic-input-${props.value.type}`}
                id={`dynamic-input-${props.id}-${props.suffix}`}>
                <div className="col40 form-group">
                    {props.allowRemoving && (
                        <div style="display: table-cell; width: 27px;">
                            <button
                                id={`${props.id}-delete-${props.suffix}`}
                                data-dynamic-input-id={props.id}
                                className="dynamic-input-delete button button-secondary button-small icon-trash"
                                onClick={props.onRemove}
                                title={t('delete-field', 'generator')}
                            />
                        </div>
                    )}
                    <div style="display: table-cell;">
                        {props.allowChangingDescription ? (
                            [
                                <label htmlFor={`${props.id}-desc-${props.suffix}`} className="sr-only">
                                    <Text id="description" />
                                </label>,
                                <input
                                    name="desc"
                                    type="text"
                                    id={`${props.id}-desc-${props.suffix}`}
                                    data-dynamic-input-id={props.id}
                                    className="form-element"
                                    value={props.value.desc}
                                    placeholder={t('description', 'generator')}
                                    style="margin-left: 5px;"
                                    required={!props.optional || !props.value.optional}
                                    onBlur={(e) =>
                                        props.onChange(
                                            produce((id_data: IdDataElement) => {
                                                id_data.desc = e.currentTarget.value;
                                            })(props.value)
                                        )
                                    }
                                />,
                            ]
                        ) : (
                            <label htmlFor={`${props.id}-value-${props.suffix}`}>{props.value.desc}</label>
                        )}
                    </div>
                    {props.hasPrimary && props.value.type === 'address' && (
                        <div className="col50">
                            <button
                                id={`${props.id}-primaryButton`}
                                name="primary_button"
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
                        </div>
                    )}
                </div>
                <div className="col60">
                    <div style="padding-left: 10px;" className="form-group">
                        <InputControl {...inputProps} />
                    </div>
                </div>
                <div className="clearfix" />
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
            <div id={`${props.id}-container-${props.suffix}`}>
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
                <input
                    data-dynamic-input-id={props.id}
                    type="hidden"
                    id={`${props.id}-primary-${props.suffix}`}
                    className="dynamic-input-primary form-element"
                    value={props.value ? 'true' : 'false'}
                    onChange={(e) => handleChange('primary', e.currentTarget.value)}
                />
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

    return (
        <div className="form-group">
            {!props.suppressLabel && props.desc && (
                <label for={`${props.id}-value-${props.suffix}`} className="sr-only">
                    {props.desc}
                </label>
            )}

            {props.type === 'textarea' ? (
                <textarea {...componentProps} />
            ) : (
                <input
                    type={props.type === 'birthdate' ? 'date' : props.type === 'email' ? 'email' : 'text'}
                    {...componentProps}
                />
            )}
        </div>
    );
};
