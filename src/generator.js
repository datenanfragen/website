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
                <h2>Anfrage generieren</h2>
                <SearchBar id="aa-search-input" algolia_appId='M90RBUHW3U' algolia_apiKey='a306a2fc33ccc9aaf8cbe34948cf97ed' index='companies' onAutocompleteSelected={this.handleAutocompleteSelected} />
                <div id="request-generator" className="grid" style="margin-top: 10px;">
                    <div className="col50">
                        <RequestForm onChange={this.handleInputChange} request_data={this.state.request_data}/>
                    </div>
                    <div className="col50">
                        <div id="pdf-controls">
                            <a id="download-button" class="button" href="" download ref={el => this.download_button = el}>PDF herunterladen</a>
                            <button id="generate-button" onClick={this.testRender}>PDF generieren</button>
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
        let url = 'https://raw.githubusercontent.com/datenanfragen/companies/master/templates/';
        fetch(url + 'de-' + this.state.request_data.type + '-default.txt')
            .then(res => res.text())
            .then(template => {
                let letter = Letter.fromRequest(this.state.request_data, template);
                pdfMake.createPdf(letter.toPdfDoc()).getBlob((blob) => { // TODO: setBusyState
                    var url = URL.createObjectURL(blob);
                    this.iframe.src = url;
                    this.download_button.setAttribute('href', url);
                });
            })
            .catch(err => { console.error('Template download failed with error: ' + err); }); // TODO: Better error handling!
    }
}

preact.render((<Generator/>), null, document.getElementById('generator'));
