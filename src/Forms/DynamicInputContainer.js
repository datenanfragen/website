import preact from 'preact';
import DynamicInput from "./DynamicInput";
import { Text, MarkupText } from 'preact-i18n';

export default class DynamicInputContainer extends preact.Component {
    constructor(props) {
        super(props);
        this.state = DynamicInputContainer.getDerivedStateFromProps(this.props, {});

        this.addDynamicInput = this.addDynamicInput.bind(this);
        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.removeDynamicInput = this.removeDynamicInput.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    // This is not yet implemented in preact but componentWillReceiveProps is going to be deprecated in React, so we will use this workaround to simulate the future. How exciting O.o
    // Relevant issue: https://github.com/developit/preact/issues/1047
    static getDerivedStateFromProps(nextProps, prevState) {
        let fields_object = {};
        let primary_address = prevState['primary_address'] || "0";
        nextProps.fields.forEach((field, i) => {
            if(field['value']) {
                if(field.type === 'address' && field.value['primary']) primary_address = "" + (i + 1);
            } else field['value'] = field['type'] === 'address' ? {} : '';
            fields_object[i + 1] = field;
        });
        return {
            fields: fields_object,
            fields_counter: nextProps.fields.length || 0,
            'dynamic-input-type': prevState['dynamic-input-type'] || 'input',
            primary_address: primary_address
        };
    }

    componentWillReceiveProps(nextProps) {
        if(this.props !== nextProps) {
            this.setState(DynamicInputContainer.getDerivedStateFromProps(nextProps, this.state));
        }
    }

    render() {
        let input_elements = [];
        for(let i in this.state.fields) {
            let field = this.state.fields[i];
            input_elements.push(<DynamicInput key={i} id={i} suffix={this.props.id} type={field.type} desc={field.desc} optional={field.optional}
                                              removeHandler={this.removeDynamicInput} onChange={this.handleInputChange}
                                              hasPrimary={this.props.hasPrimary} onPrimaryChange={this.handleInputChange} value={field.value}/>);
        }
        return (
            <fieldset>
                <legend>{this.props.title}</legend>
                {this.props.children}
                <div id={"request-dynamic-input-" + this.props.id}>
                    {input_elements}
                </div>
                <div className="dynamic-input-controls">
                    <Text id="add-dynamic-input-explanation" /><br />
                    <select id={"dynamic-input-type-" + this.props.id} onChange={this.handleTypeChange}>
                        <option value="input" selected><Text id="input-single-line" /></option>
                        <option value="textarea"><Text id="input-multi-line" /></option>
                        <option value="address"><Text id="input-address" /></option>
                    </select>
                    <button id={"add-dynamic-inputs-" + this.props.id} onClick={this.addDynamicInput}><Text id="add-input" /></button>
                </div>
            </fieldset>
        );
    }

    handleInputChange(event) {
        let rel = event.target.getAttribute('rel');
        let name = event.target.getAttribute('name');
        this.setState(prev => {
            switch(name) {
                case 'desc':
                case 'value':
                    prev.fields[rel][name] = event.target.value;
                    break;
                case 'primary_button':
                    prev['primary_address'] = "" + rel;
                    break;
                default:
                    prev.fields[rel].value[name] = event.target.value;
            }
            return prev;
        });
        this.pushStateUp();
    }

    handleTypeChange(event) {
        this.setState(prev => {
            prev['dynamic-input-type'] = event.target.value;
            return prev;
        });
    }

    addDynamicInput() { // TODO: Maybe move the fields completely up and remove these methods…
        let field = {
            desc: '',
            type: this.state['dynamic-input-type'],
            optional: true,
            value: this.state['dynamic-input-type'] === 'address' ? {} : ''
        };
        this.setState(prev => {
            prev.fields_counter = prev.fields_counter + 1;
            prev.fields[prev.fields_counter] = field;
            return prev;
        });
        this.pushStateUp();
    }

    removeDynamicInput(event) {
        this.setState(prev => {
            delete prev.fields[event.target.getAttribute('rel')];
            return prev;
        });
        this.pushStateUp();
    }

    getDataArray() {
        let data = [];
        for(let i in this.state.fields) {
            let field = this.state.fields[i];
            if(field['type'] === 'address') field.value['primary'] = (this.state.primary_address === ("" + i));
            data.push(field);
        }
        return data;
    }

    pushStateUp() {
        let d = {};
        d[this.props.id] = this.getDataArray();
        this.props.onChange(d);
    }
}
