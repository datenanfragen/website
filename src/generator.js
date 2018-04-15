import preact from 'preact';
import RequestForm from 'Forms/RequestForm';
import Letter from 'Letter';
import SearchBar from "./SearchBar";

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
            request_data: {
                type: 'access',
                id_data: this.default_fields,
                recipient_address: '',
                signature: {type: 'text', value: ''},
                erase_all: true,
                erasure_data: '',
                data_portability: false,
                recipient_runs: [],
                rectification_data: [],
                custom_data: {
                    content: '',
                    subject: '',
                    sender_address: {},
                    name: ''
                }
            },
            template_text: '',
            suggestion: null,
            download_active: false
        };

        this.template_url = '//' + window.location.host + '/templates/';

        this.letter = new Letter({});

        this.iframe = null;
        this.download_button = null;
        this.renderPdf = this.renderPdf.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleAutocompleteSelected = this.handleAutocompleteSelected.bind(this);
        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.handleLetterChange = this.handleLetterChange.bind(this);

        fetch(this.template_url + 'de-access-default.txt')
            .then(res => res.text()).then(text => {this.setState({template_text: text})});
    }

    render() {
        return (
            <main>
                <h2>Anfrage generieren</h2>
                <SearchBar id="aa-search-input" algolia_appId='M90RBUHW3U' algolia_apiKey='a306a2fc33ccc9aaf8cbe34948cf97ed'
                           index='companies' onAutocompleteSelected={this.handleAutocompleteSelected}
                           placeholder="Unternehmen auswählen…" debug={false}/>
                <div id="request-generator" className="grid" style="margin-top: 10px;">
                    <div className="col50">
                        <RequestForm onChange={this.handleInputChange} onTypeChange={this.handleTypeChange} onLetterChange={this.handleLetterChange} request_data={this.state.request_data}/>
                    </div>
                    <div className="col50">
                        <div id="pdf-controls">
                            <a id="download-button" className={"button" + (this.state.download_active ? '' : ' disabled')} href="" download=""
                               ref={el => this.download_button = el} onClick={e => {if(!this.state.download_active) e.preventDefault();}}>PDF herunterladen</a>
                            <button id="generate-button" onClick={this.renderPdf}>PDF generieren</button>
                            <div className="clearfix" />
                        </div>
                        <iframe id="pdf-viewer" ref={el => this.iframe = el} />
                    </div>
                </div>
                <div className="clearfix" />
            </main>);
    }

    handleAutocompleteSelected(event, suggestion, dataset) {
        let template_file = suggestion['custom-' + this.state.request_data.type + '-template'] || 'de-' + this.state.request_data.type + '-default.txt';
        fetch(this.template_url + template_file)
            .then(res => res.text()).then(text => {this.setState({template_text: text})});

        this.setState(prev => {
            prev.request_data['recipient_address'] = suggestion.name + '\n' + suggestion.address;
            prev.request_data['data'] = suggestion['required-elements-access'] || this.default_fields; // TODO: Be *a lot* gentler here. Compare the two arrays and keep already entered data. Also switch types.
            prev.request_data['recipient_runs'] = suggestion.runs || [];
            prev.suggestion = suggestion;
            return prev;
        });
    }

    handleTypeChange(event) {
        this.handleInputChange({type: event.target.value});
        if(event.target.value === 'custom') {
            this.letter.clearProps();
            this.letter.updateDoc();
            return;
        }
        let template_file = this.state.suggestion ? this.state.suggestion['custom-' + this.state.request_data.type + '-template'] || 'de-' + this.state.request_data.type + '-default.txt' : 'de-' + this.state.request_data.type + '-default.txt';
        fetch(this.template_url + template_file)
            .then(res => res.text()).then(text => {this.setState({template_text: text})});
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

    handleLetterChange(event, address_change = false) {
        if(address_change) {
            this.setState(prev => {
                let att = event.target.getAttribute('name');
                prev.request_data.custom_data['sender_address'][att] = event.target.value;
            });
        } else {
            this.setState(prev => {
                let att = event.target.getAttribute('name');
                if(prev.request_data.custom_data.hasOwnProperty(att)) prev.request_data.custom_data[att] = event.target.value;
            });
        }
    }

    renderPdf() {
        if(this.state.request_data['type'] === 'custom') {
            let signature = this.state.request_data['signature'];
            signature['name'] = this.state.request_data.custom_data['name'];
            this.letter.setProps({
                subject: this.state.request_data.custom_data['subject'],
                content: this.state.request_data.custom_data['content'],
                signature: signature,
                recipient_address: this.state.request_data['recipient_address'],
                sender_oneline: Letter.formatAddress(this.state.request_data.custom_data['sender_address'], ' • ', this.state.request_data.custom_data['name'])
            });
        } else this.letter.setProps(Letter.propsFromRequest(this.state.request_data, this.state.template_text));
        this.setState({download_active: false});
        pdfMake.createPdf(this.letter.toPdfDoc()).getBlob((blob) => {
            var url = URL.createObjectURL(blob);
            this.iframe.src = url;
            this.download_button.setAttribute('href', url);
            this.download_button.setAttribute('download', (this.state.suggestion !== null ? this.state.suggestion['slug'] : 'custom-company')
                + '_' + this.state.request_data['type'] + '_' + this.state.request_data['reference'] + '.pdf'); // TODO: This uses code that is not implemented in this branch, but has been merged into master.
            this.setState({download_active: true});
        });
    }
}

preact.render((<Generator/>), null, document.getElementById('generator'));
