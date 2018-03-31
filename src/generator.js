import preact from 'preact';
import RequestForm from 'Forms/RequestForm';
import Letter from 'Letter';

class Generator extends preact.Component {
    constructor(props) {
        super(props);
        this.state = {
            'request_data': {
                type: 'access',
                data: [],
                recipient_address: '',
                signature: {type: 'text', value: ''}
            }
        };

        this.iframe = null;
        this.download_button = null;
        this.testRender = this.testRender.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    render() {
        return (
            <main>
                <h2>Anfrage generieren</h2>
                <input id="aa-search-input" className="aa-input-search" placeholder="Unternehmen auswählen…" type="search" />
                <div id="request-generator" className="grid" style="margin-top: 10px;">
                    <div className="col50">
                        <RequestForm onChange={this.handleInputChange} type={this.state['request_data']['type']}/>
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

    handleInputChange(changed_data) {
        this.setState(prev => {
            for(let key in changed_data) {
                prev['request_data'][key] = changed_data[key];
            }
            return prev;
        });
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
