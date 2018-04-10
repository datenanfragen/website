import preact from 'preact';
import DynamicInputContainer from "./DynamicInputContainer";
import SignatureInput from "./SignatureInput";

export default class RequestForm extends preact.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let rectification_container = '';
        if(this.props.request_data['type'] === 'rectification') rectification_container =
            <DynamicInputContainer id="rectification_data" title="Korrekte Daten" fields={this.props.request_data['rectification_data']} onChange={this.props.onChange}>
                Diese Daten sollen korrigiert werden. Du kannst hier auch andere Daten angeben, als für die Identifikation nötig waren.
            </DynamicInputContainer>;

        return (
            <div className="request-form">
                <fieldset>
                    <legend>Anfrageparameter</legend>

                    <div className="request-type-chooser">
                        Was für eine Anfrage möchtest Du stellen?<br />
                        <input type="radio" id="request-type-choice-access" name="request-type" value="access" className="form-element" checked={this.props.request_data['type'] === 'access'}
                               onChange={this.props.onTypeChange} /> <label for="request-type-choice-access">Selbstauskunft</label>
                        <input type="radio" id="request-type-choice-erasure" name="request-type" value="erasure" className="form-element" checked={this.props.request_data['type'] === 'erasure'}
                               onChange={this.props.onTypeChange} /> <label for="request-type-choice-erasure">Löschantrag</label>
                        <input type="radio" id="request-type-choice-rectification" name="request-type" value="rectification" className="form-element" checked={this.props.request_data['type'] === 'rectification'}
                               onChange={this.props.onTypeChange} /> <label for="request-type-choice-rectification">Berichtigungsantrag</label>
                        <input type="radio" id="request-type-choice-custom" name="request-type" value="custom" className="form-element" checked={this.props.request_data['type'] === 'custom'}
                               onChange={this.props.onTypeChange} /> <label for="request-type-choice-custom">Eigener Text</label>
                    </div>

                    <div className="form-group fancy-fg recipient-form" style="margin-top: 17px;">
                        An wen geht Deine Anfrage?<br />
                        <textarea id="request-recipient" className="form-element" placeholder="Empfänger" rows="4" spellcheck="false" onChange={event => {
                            this.props.onChange({'recipient_address': event.target.value});
                        }}>{this.props.request_data['recipient_address']}</textarea>
                        <label className="sr-only" for="request-recipient">Empfänger</label>
                        <input type="hidden" id="request-template" value="default" />
                    </div>

                    {this.renderFlags()}

                </fieldset>

                <DynamicInputContainer id="id_data" onChange={this.props.onChange} fields={this.props.request_data['id_data']} title="Meine Daten">
                    Die Daten, die Du hier eingibst, helfen dem Unternehmen Dich zu identifizieren. Gib ruhig erst einmal zu wenig als zu viel an – im Zweifelsfall wird das Unternehmen schon nachfragen.<br />
                    Wenn wir Erfahrungswerte zu Daten haben, die definitiv angegeben werden müssen, sind diese mit einem * gekennzeichnet.
                </DynamicInputContainer>

                {rectification_container}

                <SignatureInput id="signature" width={400} height={200} onChange={this.props.onChange}/>
            </div>
        );
    }


    renderFlags() {
        let flags = [];
        switch(this.props.request_data['type']) {
            case 'access':
                flags.push(<div className="form-group">
                    <input type="checkbox" id="request-flags-data-portability" className="request-flags form-element" checked={this.props.request_data['data_portability']} onChange={event => {
                        this.props.onChange({'data_portability': event.target.checked});
                    }}/>
                    <label for="request-flags-data-portability">Daten in maschinenlesbaren Format erhalten</label>
                </div>);
                break;
            case 'erasure':
                flags.push(
                    <div className="form-group">
                        <input type="checkbox" id="request-flags-erase-all" className="request-flags form-element" checked={this.props.request_data['erase_all']} onChange={event => {
                            this.props.onChange({'erase_all': event.target.checked});
                        }}/>
                        <label for="request-flags-erase-all">Alle Daten löschen</label>
                    </div>
                );
                if(!this.props.request_data['erase_all']) flags.push(
                    <div className="form-group">
                        <textarea id="request-erasure-data" className="form-element" onChange={event => {
                            this.props.onChange({'erasure_data': event.target.value});
                        }} placeholder="Zu löschende Daten">{this.props.request_data['erasure_data']}</textarea>
                        <label for="request-erasure-data" className="sr-only">Zu löschende Daten</label>
                    </div>
                );
        }
        return flags;
    }

}
