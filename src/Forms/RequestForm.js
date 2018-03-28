import preact from 'preact';
import DynamicInputContainer from "./DynamicInputContainer";

export default class RequestForm extends preact.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="request-form">
                <fieldset>
                    <legend>Anfrageparameter</legend>

                    <div className="request-type-chooser">
                        Was für eine Anfrage möchtest Du stellen?<br />
                        <input type="radio" id="request-type-choice-access" name="request-type" value="access" className="form-element" checked /> <label for="request-type-choice-access">Selbstauskunft</label>
                        <input type="radio" id="request-type-choice-erasure" name="request-type" value="erasure" className="form-element" /> <label for="request-type-choice-erasure">Löschantrag</label>
                        <input type="radio" id="request-type-choice-rectification" name="request-type" value="rectification" className="form-element" /> <label for="request-type-choice-rectification">Berichtigungsantrag</label>
                        <input type="radio" id="request-type-choice-custom" name="request-type" value="custom" className="form-element" /> <label for="request-type-choice-custom">Eigener Text</label>
                    </div>

                    <div className="form-group fancy-fg recipient-form" style="margin-top: 17px;">
                        An wen geht Deine Anfrage?<br />
                        <textarea id="request-recipient" className="form-element" placeholder="Empfänger" rows="4" spellcheck="false" />
                        <label className="sr-only" for="request-recipient">Empfänger</label>
                        <input type="hidden" id="request-template" value="default" />
                    </div>
                </fieldset>

                <DynamicInputContainer/>

                <fieldset>
                    <legend>Unterschrift</legend>
                    Wenn Du möchtest, kannst Du Deine Anfrage hier unterschreiben. Zeichne dafür einfach mit gedrückter Maustaste in das Feld.
                    <div id="signature-container" />
                    <button id="signature-clear-button">Neu erstellen</button>
                </fieldset>
            </div>
        );
    }
}
