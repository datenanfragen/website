import preact from 'preact';
import DynamicInput from "./DynamicInput";

export default class DynamicInputContainer extends preact.Component {
    constructor(props) {
        super(props);
        this.state = {
            fields: props.fields || [ // default fields
                {
                    "desc": "Name",
                    "type": "name"
                }, {
                    "desc": "Geburtsdatum",
                    "type": "input",
                    "optional": true
                }, {
                    "desc": "Adresse",
                    "type": "address"
                }],
            'dynamic-input-type': 'input'
        };

        this.addDynamicInput = this.addDynamicInput.bind(this);
        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.removeDynamicInput = this.removeDynamicInput.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    render() {
        let input_elements = [];
        this.state.fields.forEach((field, id) => {
            input_elements.push(<DynamicInput id={id} type={field.type} desc={field.desc} optional={field.optional} removeHandler={this.removeDynamicInput} onChange={this.handleInputChange}/>)
        });
        return (
            <fieldset>
                <legend>Meine Daten</legend>
                Die Daten, die Du hier eingibst, helfen dem Unternehmen Dich zu identifizieren. Gib ruhig erst einmal zu wenig als zu viel an – im Zweifelsfall wird das Unternehmen schon nachfragen.<br />
                Wenn wir Erfahrungswerte zu Daten haben, die definitiv angegeben werden müssen, sind diese mit einem * gekennzeichnet.
                <div id="request-dynamic-input">
                    {input_elements}
                </div>
                <div className="dynamic-input-controls">
                    Du möchtest weitere Daten ergänzen? Kein Problem: Wähle einfach den passenden Feldtyp.<br />
                    <select id="dynamic-input-type" onChange={this.handleTypeChange}>
                        <option value="input" selected>Freitext (einzeilig)</option>
                        <option value="textarea">Freitext (mehrzeilig)</option>
                        <option value="address">Adresse</option>
                    </select>
                    <button id="add-dynamic-inputs" onClick={this.addDynamicInput}>Feld hinzufügen</button>
                </div>
            </fieldset>
        );
    }

    handleInputChange(event) {
        let id = event.target.getAttribute('id').split('-');
        this.setState(prev => {
            switch(id[1]) {
                case 'value':
                    prev.fields[id[0]].value = event.target.value;
                    break;
                case 'desc':
                    prev.fields[id[0]].desc = event.target.value;
                    break;
                default:
                    prev.fields[id[0]].value = prev.fields[id[0]].value || {};
                    prev.fields[id[0]].value[id[1]] = event.target.value;
            }
            return prev;
        });
        console.log(this.state);
    }

    handleTypeChange(event) {
        this.setState(prev => {
            prev['dynamic-input-type'] = event.target.value;
            return prev;
        });
    }

    addDynamicInput() {
        let field = {
            desc: '',
            type: this.state['dynamic-input-type'],
            required: false
        };
        this.setState(prev => {
            prev.fields.push(field);
            return prev;
        });
    }

    removeDynamicInput(event) {
        this.setState(prev => {
            prev.fields.splice(parseInt(event.target.getAttribute('rel')), 1);
            return prev;
        })
    }
}
