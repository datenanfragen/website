import type { JSX } from 'preact';
import { useMemo } from 'preact/hooks';
import { Text, IntlProvider } from 'preact-i18n';
import t from '../../Utility/i18n';
import { Address, AddressIdData, ADDRESS_STRING_PROPERTIES, IdDataElement } from 'request';
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
    const ControlComponent = useMemo(() => {
        // TODO: test if the memoization only runs for type changes and not all changes of prop.value
        switch (props.value.type) {
            case 'address':
                return AddressControl;
            case 'textarea':
                return TextareaControl;
            case 'birthdate':
                return DateControl;
            case 'name':
            case 'input':
            default:
                return InputControl;
        }
    }, [props.value.type]) as (props: ControlComponentProps<string | Address>) => JSX.Element; // This is not the proper way but I honestly do not know how else to make typescript happy. I know my types depend on each other and therefore this is fine, but how do I tell typescript?

    return (
        <IntlProvider scope="generator" definition={window.I18N_DEFINITION}>
            <div
                className={`dynamic-input dynamic-input-${props.value.type}`}
                id={`dynamic-input-${props.id}-${props.suffix}`}>
                <div className="col40 form-group">
                    {props.allowRemoving ? (
                        <div style="display: table-cell; width: 27px;">
                            <button
                                id={`${props.id}-delete-${props.suffix}`}
                                rel={props.id}
                                className="dynamic-input-delete button button-secondary button-small icon-trash"
                                onClick={props.onRemove}
                                title={t('delete-field', 'generator')}
                            />
                        </div>
                    ) : null}
                    <div style="display: table-cell;">
                        {props.allowChangingDescription ? (
                            [
                                <label htmlFor={`${props.id}-desc-${props.suffix}`} className="sr-only">
                                    <Text id="description" />
                                </label>,
                                <input
                                    key={props.id + props.suffix}
                                    name="desc"
                                    type="text"
                                    id={`${props.id}-desc-${props.suffix}`}
                                    rel={props.id}
                                    className="form-element"
                                    value={props.value.desc}
                                    placeholder={t('description', 'generator')}
                                    style="margin-left: 5px;"
                                    required={!props.optional || !props.value.optional}
                                    onChange={(e) => props.onChange}
                                />,
                            ]
                        ) : (
                            <label htmlFor={`${props.id}-value-${props.suffix}`}>{props.value.desc}</label>
                        )}
                    </div>
                    {props.hasPrimary && props.value.type === 'address' ? (
                        <div className="col50">
                            <button
                                id={`${props.id}-primaryButton`}
                                name="primary_button"
                                rel={props.id}
                                className="button button-secondary dynamic-input-primaryButton"
                                data-isprimary={props.value.value.primary}
                                onClick={() => {
                                    if (props.value.type === 'address') {
                                        props.onChange(
                                            produce((id_data: AddressIdData) => {
                                                id_data.value.primary = !id_data.value.primary;
                                            })(props.value)
                                        );
                                    }
                                }}>
                                <Text id="primary-address" />
                            </button>
                        </div>
                    ) : null}
                </div>
                <div className="col60">
                    <div style="padding-left: 10px;" className={'form-group'}>
                        <ControlComponent
                            key={props.id + props.suffix}
                            id={props.id}
                            suffix={props.suffix}
                            required={!props.optional || !props.value.optional}
                            onChange={(field_value) =>
                                props.onChange(
                                    produce((id_data: IdDataElement) => {
                                        id_data.value = field_value;
                                    })(props.value)
                                )
                            }
                            value={props.value.value}
                            // The controls usually automatically add a label if they know their description. If changing
                            // the description is not allowed, though, a label is already set simply by the description
                            // text. In that case, we obviously don't want to generate a second label.
                            suppressLabel={props.allowChangingDescription}
                        />
                    </div>
                </div>
                <div className="clearfix" />
            </div>
        </IntlProvider>
    );
};

type ControlComponentProps<T> = {
    id: string;
    suffix: string;
    suppressLabel?: boolean;
    desc?: string;
    required?: boolean;
    value: T;
    onChange: (value: T) => void;
};

// TODO: I removed an old bugfix (commit e2bcff7e461c36a256daa9a29a7baedca4468fa3) that seemd more like a workaround to me, suppressing rerenders with shouldComponentUpdate to prevent Components from loosing focus. If the bug is intriduced again, the root cause should be fixed instead, because preact should keep the elements if it is done correctly.
export const TextareaControl = (props: ControlComponentProps<string>) => {
    return (
        <div className="form-group">
            {!props.suppressLabel && props.desc ? (
                <label for={`${props.id}-value-${props.suffix}`} className="sr-only">
                    {props.desc}
                </label>
            ) : (
                ''
            )}

            <textarea
                key={props.id + props.suffix}
                name="value"
                id={props.id + props.suffix}
                rel={props.id}
                className="form-element"
                placeholder={t('value', 'generator')}
                required={props.required}
                onChange={(e) => props.onChange(e.currentTarget.value)}
                value={props.value}
            />
        </div>
    );
};

export const InputControl = (props: ControlComponentProps<string>) => {
    return (
        <div className="form-group">
            {props.suppressLabel && props.desc ? (
                <label htmlFor={`${props.id}-value-${props.suffix}`} className="sr-only">
                    {props.desc}
                </label>
            ) : (
                ''
            )}
            <input
                key={props.id + props.suffix}
                name="value"
                type="text"
                id={`${props.id}-value-${props.suffix}`}
                rel={props.id}
                className="form-element"
                placeholder={t('value', 'generator')}
                required={props.required}
                onChange={(e) => props.onChange(e.currentTarget.value)}
                value={props.value}
            />
        </div>
    );
};

export const DateControl = (props: ControlComponentProps<string>) => {
    return (
        <div className="form-group">
            {!props.suppressLabel && props.desc ? (
                <label htmlFor={`${props.id}-value-${props.suffix}`} className="sr-only">
                    {props.desc}
                </label>
            ) : (
                []
            )}
            <input
                key={props.id + props.suffix}
                name="value"
                type="date"
                id={`${props.id}-value-${props.suffix}`}
                rel={props.id}
                className="form-element"
                placeholder={t('value', 'generator')}
                required={props.required}
                onChange={(e) => props.onChange(e.currentTarget.value)} // TODO: Validate the date here!
                value={props.value}
            />
        </div>
    );
};

export const AddressControl = (props: ControlComponentProps<Address>) => {
    const handleChange = (property: typeof ADDRESS_STRING_PROPERTIES[number] | 'primary', field_value: string) =>
        props.onChange(
            produce((value: Address) => {
                if (property === 'primary') {
                    value[property] = field_value === 'true';
                } else {
                    value[property] = field_value;
                }
            })(props.value)
        );

    return (
        <div id={`${props.id}-container-${props.suffix}`}>
            {ADDRESS_STRING_PROPERTIES.map((property) => (
                <div className="form-group fancy-fg">
                    <input
                        key={`${props.id}-${property}-${props.suffix}`}
                        name="property"
                        rel={props.id}
                        type="text"
                        id={`${props.id}-${property}-${props.suffix}`}
                        placeholder={t(`address-${property}`, 'generator')}
                        className="form-element"
                        required={props.required}
                        onChange={(e) => handleChange(property, e.currentTarget.value)}
                        value={props.value[property]}
                    />
                    <label className="fancy-label" htmlFor={`${props.id}-${property}-${props.suffix}`}>
                        <Text id={`address-${property}`} />
                    </label>
                </div>
            ))}
            <input
                key={`${props.id}-primary-${props.suffix}`}
                name="primary"
                rel={props.id}
                type="hidden"
                id={`${props.id}-primary-${props.suffix}`}
                className="dynamic-input-primary form-element"
                value={props.value ? 'true' : 'false'}
                onChange={(e) => handleChange('primary', e.currentTarget.value)}
            />
        </div>
    );
};
