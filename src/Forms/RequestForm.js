import preact from 'preact';
import DynamicInputContainer from "./DynamicInputContainer";
import SignatureInput from "./SignatureInput";
import { Text } from 'preact-i18n';
import t from 'i18n';

export default class RequestForm extends preact.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let body = [];
        switch(this.props.request_data['type']) {
            case 'rectification':
                body.push( // TODO: Also internationalize new features
                    <DynamicInputContainer key="rectification_data" id="rectification_data" title="Korrekte Daten" fields={this.props.request_data['rectification_data']} hasPrimary={false} onChange={this.props.onChange}>
                        Diese Daten sollen korrigiert werden. Du kannst hier auch andere Daten angeben, als für die Identifikation nötig waren.
                    </DynamicInputContainer>
                );
            case 'erasure':
            case 'access':
                body.push(
                    <DynamicInputContainer key="id_data" id="id_data" onChange={this.props.onChange} fields={this.props.request_data['id_data']} title="Meine Daten" hasPrimary={true}>
                        Die Daten, die Du hier eingibst, helfen dem Unternehmen Dich zu identifizieren. Gib ruhig erst einmal zu wenig als zu viel an – im Zweifelsfall wird das Unternehmen schon nachfragen.<br />
                        Wenn wir Erfahrungswerte zu Daten haben, die definitiv angegeben werden müssen, sind diese mit einem * gekennzeichnet.
                    </DynamicInputContainer>
                );
                break;
            case 'custom':
                body.push(
                    <fieldset>
                        <legend>Eigener Text</legend>
                        <div className="form-group">
                            <label for="custom-subject-input" className="sr-only">Betreff</label>
                            <input type="text" id="custom-subject-input" name="subject" className="form-element" placeholder="Betreff" onChange={this.props.onLetterChange} value={this.props.request_data.custom_data['subject']}/>
                        </div>
                        <div className="form-group">
                            <label for="custom-subject-input" className="sr-only">Betreff</label>
                            <textarea type="text" id="custom-subject-input" name="content" className="form-element" placeholder="Inhalt" onChange={this.props.onLetterChange} style="height: 200px;" >{this.props.request_data.custom_data['content']}</textarea>
                            <div id="tagxplanation">Im Text können die Tags <code>&lt;italic&gt;&lt;/italic&gt;</code> sowie <code>&lt;bold&gt;&lt;/bold&gt;</code> verwendet werden. Geschachtelte Tags werden nicht unterstützt.</div>
                        </div>
                    </fieldset>,
                    <fieldset>
                        <legend>Absenderadresse</legend>
                        <div className="form-group fancy-fg">
                            <input type="text" id="custom-sender-name" name="name" placeholder="Name" className="form-element" onChange={this.props.onLetterChange} value={this.props.request_data.custom_data['name']} />
                            <label className="fancy-label" for="custom-sender-name">Name</label>
                        </div>
                        <div className="form-group fancy-fg">
                            <input type="text" id="custom-sender-street_1" name="street_1" placeholder="Adresszeile 1" className="form-element" onChange={event => this.props.onLetterChange(event, true)} value={this.props.request_data.custom_data['sender_address']['street_1']} />
                            <label className="fancy-label" for="custom-sender-street_1">Adresszeile 1</label>
                        </div>
                        <div className="form-group fancy-fg">
                            <input type="text" id="custom-sender-street_2" name="street_2" placeholder="Adresszeile 2" className="form-element" onChange={event => this.props.onLetterChange(event, true)} value={this.props.request_data.custom_data['sender_address']['street_2']} />
                            <label className="fancy-label" for="custom-sender-street_2">Adresszeile 2</label>
                        </div>
                        <div className="form-group fancy-fg">
                            <input type="text" id="custom-sender-place" name="place" placeholder="Ort" className="form-element" onChange={event => this.props.onLetterChange(event, true)} value={this.props.request_data.custom_data['sender_address']['place']} />
                            <label className="fancy-label" for="custom-sender-place">Ort</label>
                        </div>
                        <div className="form-group fancy-fg">
                            <input type="text" id="custom-sender-country" name="country" placeholder="Land" className="form-element" onChange={event => this.props.onLetterChange(event, true)} value={this.props.request_data.custom_data['sender_address']['country']} />
                            <label className="fancy-label" for="custom-sender-country">Land</label>
                        </div>
                    </fieldset>
                ); // Todo: Cleanup: do this with the Controls classes, when they support name attributes (see #30)
                break;
        }

        return (
            <div className="request-form">
                <fieldset>
                    <legend><Text id="request-parameters"/></legend>

                    <div className="request-type-chooser">
                        <Text id="request-type" /><br />
                        <input type="radio" id="request-type-choice-access" name="request-type" value="access" className="form-element" checked={this.props.request_data['type'] === 'access'}
                               onChange={this.props.onTypeChange} /> <label for="request-type-choice-access"><Text id="access-request"/></label>
                        <input type="radio" id="request-type-choice-erasure" name="request-type" value="erasure" className="form-element" checked={this.props.request_data['type'] === 'erasure'}
                               onChange={this.props.onTypeChange} /> <label for="request-type-choice-erasure"><Text id="erasure-request"/></label>
                        <input type="radio" id="request-type-choice-rectification" name="request-type" value="rectification" className="form-element" checked={this.props.request_data['type'] === 'rectification'}
                               onChange={this.props.onTypeChange} /> <label for="request-type-choice-rectification"><Text id="rectification-request"/></label>
                        <input type="radio" id="request-type-choice-custom" name="request-type" value="custom" className="form-element" checked={this.props.request_data['type'] === 'custom'}
                               onChange={this.props.onTypeChange} /> <label for="request-type-choice-custom"><Text id="own-request"/></label>
                    </div>

                    <div className="form-group fancy-fg recipient-form" style="margin-top: 17px;">
                        <Text id="recipient-explanation"/><br />
                        <textarea id="request-recipient" className="form-element" placeholder={t('recipient', 'generator')} rows="4" spellcheck="false" onChange={event => {
                            this.props.onChange({'recipient_address': event.target.value});
                        }}>{this.props.request_data['recipient_address']}</textarea>
                        <label className="sr-only" for="request-recipient"><Text id="recipient"/></label>
                        <input type="hidden" id="request-template" value="default" />
                    </div>

                    {this.renderFlags()}

                </fieldset>

                {body}

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
