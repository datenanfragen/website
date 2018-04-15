import preact from 'preact';
import RequestForm from 'Forms/RequestForm';
import Letter from 'Letter';
import SearchBar from "./SearchBar";
import { IntlProvider, Text } from 'preact-i18n';
import t from 'i18n';

class Generator extends preact.Component {
    constructor(props) {
        super(props);
        this.default_fields = [{
            "desc": "Name",
            "type": "name",
            "value": ""
        }, {
            "desc": "Geburtsdatum",
            "type": "input",
            "optional": true,
            "value": ""
        }, {
            "desc": "Adresse",
            "type": "address",
            "value": {"primary": true}
        }];

        this.state = {
            'request_data': {
                type: 'access',
                data: this.default_fields,
                recipient_address: '',
                signature: {type: 'text', value: ''}
            }
        };

        this.iframe = null;
        this.download_button = null;
        this.testRender = this.testRender.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleAutocompleteSelected = this.handleAutocompleteSelected.bind(this);
    }

    render() {
        return (
            <main>
                <h2><Text id="generate-request"/></h2>
                <SearchBar id="aa-search-input" algolia_appId='M90RBUHW3U' algolia_apiKey='a306a2fc33ccc9aaf8cbe34948cf97ed'
                           index='companies' onAutocompleteSelected={this.handleAutocompleteSelected}
                           placeholder={t('select-company', 'generator')} debug={false}/>
                <div id="request-generator" className="grid" style="margin-top: 10px;">
                    <div className="col50">
                        <RequestForm onChange={this.handleInputChange} request_data={this.state.request_data}/>
                    </div>
                    <div className="col50">
                        <div id="pdf-controls">
                            <a id="download-button" class="button" href="" download ref={el => this.download_button = el}><Text id="download-pdf"/></a>
                            <button id="generate-button" onClick={this.testRender}><Text id="generate-pdf"/></button>
                            <div className="clearfix" />
                        </div>
                        <iframe id="pdf-viewer" ref={el => this.iframe = el} />
                    </div>
                </div>
                <div className="clearfix" />
            </main>);
    }

    handleAutocompleteSelected(event, suggestion, dataset) {
        // TODO: Request template at this point
        console.log(suggestion);
        this.setState(prev => {
            prev.request_data['recipient_address'] = suggestion.name + '\n' + suggestion.address;
            prev.request_data['data'] = suggestion['required-elements-access'] || this.default_fields; // TODO: Be *a lot* gentler here. Compare the two arrays and keep already entered data. Also switch types.
            return prev;
        });
        console.log(this.state);
    }

    handleInputChange(changed_data) {
        this.setState(prev => {
            for(let key in changed_data) {
                prev['request_data'][key] = changed_data[key];
            }
            return prev;
        });
        // TODO: trigger a render sometimes (See #8)
    }

    testRender() {

                let letter = Letter.fromRequest(this.state.request_data, 'Guten Tag,\n' +
                    '\n' +
                    'ich bitte hiermit um Auskunft gemäß Art. 15 DSGVO. Bitte bestätigen Sie mir, ob Sie mich betreffende personenbezogene Daten verarbeiten (vgl. Art. 4 Nr. 1 und 2 DSGVO).\n' +
                    '\n' +
                    'In diesem Fall bitte ich Sie im Sinne des Art. 15 Abs. 1 DSGVO um Auskunft über\n' +
                    '1. <italic>sämtliche</italic> personenbezogenen Daten, die Sie zu meiner Person gespeichert haben;\n' +
                    '2. die Verarbeitungszwecke;\n' +
                    '3. die Kategorien personenbezogener Daten, die verarbeitet werden;\n' +
                    '4. die Empfänger oder Kategorien von Empfängern, gegenüber denen die personenbezogenen Daten offengelegt worden sind oder noch offengelegt werden;\n' +
                    '5. falls möglich die geplante Dauer, für die die personenbezogenen Daten gespeichert werden, oder, falls dies nicht möglich ist, die Kriterien für die Festlegung dieser Dauer;\n' +
                    '6. wenn die personenbezogenen Daten nicht bei mir erhoben wurden, alle verfügbaren Informationen über die Herkunft der Daten;\n' +
                    'falls zutreffend, das Bestehen einer automatisierten Entscheidungsfindung einschließlich Profiling gemäß Art. 22 Abs. 1 und 4 DSGVO und – sofern gegeben – aussagekräftige Informationen über die involvierte Logik sowie die Tragweite und die angestrebten Auswirkungen einer derartigen Verarbeitung meine Person.\n' +
                    '\n' +
                    'Sofern Sie meine personenbezogenen Daten an ein Drittland oder an eine internationale Organisation übermitteln, bitte ich über die geeigneten Garantien gemäß Art. 46 DSGVO im Zusammenhang mit der Übermittlung unterrichtet zu werden.\n' +
                    '[data_portability>\n' +
                    'Ich bitte Sie, mir die betreffenden personenbezogenen Daten, die ich Ihnen zur Verfügung gestellt habe, im Sinne des Art. 20 Abs. 1 DSGVO in einem strukturierten, gängigen und maschinenlesbaren Format zu übermitteln.]\n' +
                    'Meine Anfrage schließt explizit auch [runs>die folgenden sowie] sämtliche weiteren Angebote und Unternehmen ein, für die Sie Verantwortlicher im Sinne des Art. 4 Nr. 7 DSGVO sind[runs>: {runs_list}].\n' +
                    '\n' +
                    'Die Auskunft ist nach Art. 12 Abs. 3 DSGVO unverzüglich, in jedem Fall aber innerhalb eines Monats nach Eingang der Anfrage zu erteilen. Sie hat nach Art. 15 Abs. 3 DSGVO kostenlos zu erfolgen.\n' +
                    '\n' +
                    'Zur Identifikation meiner Person habe ich folgende Daten beigefügt:\n' +
                    '{id_data}\n' +
                    '\n' +
                    'Sollten Sie meiner Anfrage nicht innerhalb der genannten Frist nachkommen, behalte ich mir vor rechtliche Schritte gegen Sie einzuleiten und Beschwerde bei der zuständigen Datenschutzaufsichtsbehörde einzureichen.\n' +
                    '\n' +
                    'Mit freundlichen Grüßen');
                pdfMake.createPdf(letter.toPdfDoc()).getBlob((blob) => { // TODO: setBusyState
                    var url = URL.createObjectURL(blob);
                    this.iframe.src = url;
                    this.download_button.setAttribute('href', url);
                });
    }
}

preact.render((<IntlProvider scope="generator" definition={i18n_definition}><Generator/></IntlProvider>), null, document.getElementById('generator'));
