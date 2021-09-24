import { Component } from 'preact';
import DynamicInput from './DynamicInput';
import { Text, MarkupText, IntlProvider } from 'preact-i18n';
import t from '../../Utility/i18n';
import PropTypes from 'prop-types';

export default class DynamicInputContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dynamicInputType: 'input',
        };

        this.addDynamicInput = this.addDynamicInput.bind(this);
        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.removeDynamicInput = this.removeDynamicInput.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.addFillField = this.addFillField.bind(this);
    }

    render() {
        let input_elements = [];
        for (let i in this.props.fields) {
            let field = this.props.fields[i];
            input_elements.push(
                <DynamicInput
                    key={i}
                    id={i}
                    suffix={this.props.id}
                    type={field.type}
                    desc={field.desc}
                    optional={field.optional}
                    removeHandler={this.removeDynamicInput}
                    onChange={this.handleInputChange}
                    hasPrimary={this.props.hasPrimary}
                    onPrimaryChange={this.handleInputChange}
                    value={field.value}
                    onAction={this.props.onAction}
                    allowRemoving={this.props.allowRemovingFields}
                    allowChangingDescription={this.props.allowChangingFieldDescriptions}
                />
            );
        }
        // As this is at least the second time I have struggled to remember this: This is the button next to the 'add
        // new field' menu which allows you to add fields you have defined in the 'My saved data' section.
        let fill_fields = [];
        if (this.props.fillFields)
            this.props.fillFields.forEach((field) => {
                fill_fields.push(
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
                                    this.addFillField(field);
                                }}
                                title={t('add-input', 'generator')}
                            />
                        </div>
                    </div>
                );
            });
        return (
            <IntlProvider scope="generator" definition={I18N_DEFINITION}>
                <div className="dynamic-input-container">
                    {this.props.title && <h2 className={this.props.heading_class}>{this.props.title}</h2>}
                    {this.props.children}
                    <div id={'request-dynamic-input-' + this.props.id}>{input_elements}</div>
                    {this.props.allowAddingFields ? (
                        <div className="dynamic-input-controls">
                            <MarkupText id="add-dynamic-input-explanation" />
                            <br />
                            <div className="select-container">
                                <select
                                    id={'dynamic-input-type-' + this.props.id}
                                    onBlur={this.handleTypeChange}
                                    onChange={this.handleTypeChange}>
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
                                id={'add-dynamic-inputs-' + this.props.id}
                                onClick={this.addDynamicInput}>
                                <Text id="add-input" />
                            </button>
                            {this.props.fillFields && fill_fields.length > 0 ? (
                                <div className="dropdown-container">
                                    <button className="button button-primary" title={t('add-fill-field', 'generator')}>
                                        <span className="icon icon-fill" />
                                    </button>
                                    <div className="dropdown">
                                        <div style="display: table; border-spacing: 5px; width: 100%;">
                                            {fill_fields}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                []
                            )}
                            <div className="clearfix" />
                        </div>
                    ) : (
                        []
                    )}
                </div>
            </IntlProvider>
        );
    }

    handleInputChange(event) {
        let field = parseInt(event.target.getAttribute('rel'), 10);
        let prop = event.target.getAttribute('name');
        let value = event.target.value;
        switch (prop) {
            case 'primary_button':
                this.props.onSetPrimaryAddress(this.props.id, field);
                break;
            default:
                this.props.onChange(this.props.id, field, prop, value);
        }
    }

    handleTypeChange(event) {
        this.setState({
            dynamicInputType: event.target.value,
        });
    }

    addDynamicInput() {
        this.props.onAddField(this.props.id, {
            desc: '',
            type: this.state.dynamicInputType,
            optional: true,
            value: this.state.dynamicInputType === 'address' ? {} : '',
        });
    }

    addFillField(newField) {
        for (let key in this.props.fields) {
            let field = this.props.fields[key];
            if (['name', 'birthdate', 'email'].includes(field.type) && field.type === newField.type) {
                this.props.onChange(this.props.id, key, 'value', newField.value);
                return;
            } // TODO: Also check for desc while I am at it?
        }
        this.props.onAddField(this.props.id, newField);
    }

    removeDynamicInput(event) {
        // prompt only if respective field has value entered while removing
        const field = parseInt(event.target.getAttribute('rel'), 10);
        const field_value = this.props.fields[field].value;
        if (DynamicInputContainer.isFieldEmpty(field_value) || window.confirm(t('confirm-input-remove', 'generator'))) {
            this.props.onRemoveField(this.props.id, field);
        }
    }

    // returns boolean whether the field has value based on its type
    static isFieldEmpty(field_value) {
        if (typeof field_value == 'string' && field_value.trim()) {
            return false;
        } else if (typeof field_value == 'object') {
            for (let [key, value] of Object.entries(field_value)) {
                if (key !== 'primary' && value) {
                    return false;
                }
            }
        }
        return true;
    }

    componentDidUpdate() {
        DynamicInputContainer.togglePrimaryAddressButton();
    }
    componentDidMount() {
        DynamicInputContainer.togglePrimaryAddressButton();
    }

    static togglePrimaryAddressButton() {
        let buttons = document.querySelectorAll('.dynamic-input-address .dynamic-input-primaryButton');
        if (buttons.length === 1) buttons[0].style.display = 'none';
        else if (buttons.length) buttons[0].style.display = 'initial';
    }

    static get defaultProps() {
        return {
            allowAddingFields: true,
            allowRemovingFields: true,
            allowChangingFieldDescriptions: true,
        };
    }

    static propTypes = {
        id: PropTypes.string.isRequired,
        title: PropTypes.string,
        heading_class: PropTypes.string,
        fields: PropTypes.array,
        fillFields: PropTypes.array,
        hasPrimary: PropTypes.bool,

        onAddField: PropTypes.func.isRequired,
        onRemoveField: PropTypes.func.isRequired,
        onSetPrimaryAddress: PropTypes.func.isRequired,
        onChange: PropTypes.func.isRequired,
        onAction: PropTypes.func,

        allowAddingFields: PropTypes.bool,
        allowRemovingFields: PropTypes.bool,
        allowChangingFieldDescriptions: PropTypes.bool,

        children: PropTypes.node,
    };
}
