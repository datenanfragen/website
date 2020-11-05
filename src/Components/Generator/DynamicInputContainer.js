import { Component } from 'preact';
import DynamicInput from './DynamicInput';
import { Text, IntlProvider } from 'preact-i18n';
import t from '../../Utility/i18n';
import PropTypes from 'prop-types';

export default class DynamicInputContainer extends Component {
    constructor(props) {
        super(props);
        this.state = DynamicInputContainer.getDerivedStateFromProps(this.props, {});

        this.addDynamicInput = this.addDynamicInput.bind(this);
        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.removeDynamicInput = this.removeDynamicInput.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.addFillField = this.addFillField.bind(this);
    }

    // This is not yet implemented in preact but componentWillReceiveProps is going to be deprecated in React, so we will use this workaround to simulate the future. How exciting O.o
    // Relevant issue: https://github.com/developit/preact/issues/1047
    static getDerivedStateFromProps(nextProps, prevState) {
        let fields_object = {};
        let primary_address = prevState['primary_address'] || '0';
        nextProps.fields.forEach((field, i) => {
            if (field['value']) {
                if (field.type === 'address' && field.value['primary']) primary_address = '' + (i + 1);
            } else field['value'] = field['type'] === 'address' ? {} : '';
            fields_object[i + 1] = field;
        });
        return {
            fields: fields_object,
            fields_counter: nextProps.fields.length || 0,
            'dynamic-input-type': prevState['dynamic-input-type'] || 'input',
            primary_address: primary_address,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this.setState(DynamicInputContainer.getDerivedStateFromProps(nextProps, this.state));
        }
    }

    render() {
        let input_elements = [];
        for (let i in this.state.fields) {
            let field = this.state.fields[i];
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
                    <h2 className={this.props.heading_class}>{this.props.title}</h2>
                    {this.props.children}
                    <div id={'request-dynamic-input-' + this.props.id}>{input_elements}</div>
                    {this.props.allowAddingFields ? (
                        <div className="dynamic-input-controls">
                            <Text id="add-dynamic-input-explanation" />
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
                                    <button className="button button-primary">
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
        let rel = event.target.getAttribute('rel');
        let name = event.target.getAttribute('name');
        this.setState((prev) => {
            switch (name) {
                case 'desc':
                case 'value':
                    prev.fields[rel][name] = event.target.value;
                    break;
                case 'primary_button':
                    prev['primary_address'] = '' + rel;
                    break;
                default:
                    prev.fields[rel].value[name] = event.target.value;
            }
            return prev;
        });
        this.pushStateUp();
    }

    handleTypeChange(event) {
        this.setState((prev) => {
            prev['dynamic-input-type'] = event.target.value;
            return prev;
        });
    }

    addDynamicInput() {
        // TODO: Maybe move the fields completely up and remove these methods…
        let field = {
            desc: '',
            type: this.state['dynamic-input-type'],
            optional: true,
            value: this.state['dynamic-input-type'] === 'address' ? {} : '',
        };
        this.setState((prev) => {
            prev.fields_counter = prev.fields_counter + 1;
            prev.fields[prev.fields_counter] = field;
            return prev;
        });
        this.pushStateUp();
    }

    addFillField(field) {
        for (let key in this.state.fields) {
            if (
                ['name', 'birthdate', 'email'].includes(this.state.fields[key].type) &&
                this.state.fields[key].type === field.type
            ) {
                this.setState((prev) => {
                    prev.fields[key].value = field.value;
                    return prev;
                });
                this.pushStateUp();
                return;
            } // TODO: Also check for desc while I am at it?
        }
        this.setState((prev) => {
            prev.fields_counter = prev.fields_counter + 1;
            prev.fields[prev.fields_counter] = field;
            return prev;
        });
        this.pushStateUp();
    }

    removeDynamicInput(event) {
        // prompt only if respective field has value entered while removing
        const field = event.target.getAttribute('rel');
        const field_value = this.state.fields[field].value;
        if (DynamicInputContainer.isFieldEmpty(field_value) || window.confirm(t('confirm-input-remove', 'generator'))) {
            this.setState((prev) => {
                delete prev.fields[event.target.getAttribute('rel')];
                return prev;
            });
            this.pushStateUp();
        }
    }

    // returns boolean whether the field has value based on its type
    static isFieldEmpty(field_value) {
        if (typeof field_value == 'string' && field_value) {
            return false;
        } else if (typeof field_value == 'object') {
            for (let [key, value] of Object.entries(field_value)) {
                if (key != 'primary' && value) {
                    return false;
                }
            }
        }
        return true;
    }

    getDataArray() {
        let data = [];
        for (let i in this.state.fields) {
            let field = this.state.fields[i];
            if (field['type'] === 'address') field.value['primary'] = this.state.primary_address === '' + i;
            data.push(field);
        }
        return data;
    }

    pushStateUp() {
        let d = {};
        d[this.props.id] = this.getDataArray();
        this.props.onChange(d);
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
        title: PropTypes.string.isRequired,
        heading_class: PropTypes.string,
        fields: PropTypes.array,
        fillFields: PropTypes.array,
        hasPrimary: PropTypes.bool,

        onChange: PropTypes.func.isRequired,
        onAction: PropTypes.func,

        allowAddingFields: PropTypes.bool,
        allowRemovingFields: PropTypes.bool,
        allowChangingFieldDescriptions: PropTypes.bool,

        children: PropTypes.node.isRequired,
    };
}
