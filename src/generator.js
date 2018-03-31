import preact from 'preact';
import RequestForm from 'Forms/RequestForm';

class Generator extends preact.Component {
    constructor(props) {
        super(props);
        this.state = {
            'request_data': {
                type: 'access',
                data: [],
                recipient_address: ''
            }
        };

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
                            <a id="download-button" class="button" href="" download>PDF herunterladen</a>
                            <button id="generate-button">PDF generieren</button>
                            <div className="clearfix" />
                        </div>
                        <iframe id="pdf-viewer">
                        </iframe>
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
        console.log(this.state);
    }
}

preact.render((<Generator/>), null, document.getElementById('generator'));
