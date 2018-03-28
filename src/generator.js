import preact from 'preact';
import RequestForm from 'Forms/RequestForm';

class Generator extends preact.Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <main>
                <h2>Anfrage generieren</h2>
                <input id="aa-search-input" className="aa-input-search" placeholder="Unternehmen auswählen…" type="search" />
                    <div id="request-generator" className="grid" style="margin-top: 10px;">
                        <div className="col50">
                            <RequestForm />
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
}

preact.render((<Generator/>), null, document.getElementById('generator'));
