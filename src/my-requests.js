import preact from 'preact';
import localforage from 'localforage';

class RequestList extends preact.Component {
    constructor(props) {
        super(props);
        this.state = { requests: {} };

        // TODO: Is there a better place for this?
        localforage.config({
            'name': 'Datenanfragen.de',
            'storeName': 'my-requests'
        });
        let requests = {};
        localforage.iterate((data, reference) => { requests[reference] = data; })
            .then(() => { this.setState({ requests: requests }); })
            .catch(() => { console.log('Could not get requests.'); /* TODO: Proper error handling. */ });

        this.clearRequests = this.clearRequests.bind(this);
        this.exportRequests = this.exportRequests.bind(this);
    }
    render() {
        let requests = [];
        Object.keys(this.state.requests).forEach((reference) => {
            let request = this.state.requests[reference];
            if(!request) return;
            requests.push(<tr><td>{request.date}</td><td>{request.recipient}</td><td>{reference}</td><td>{request.type}</td><td>{request.via}</td></tr>);
        });
        return (
            <main>
                <h1>Meine Anfragen</h1>
                <p>Hier findest Du alle Anfragen, die Du mit diesem Browser bereits generiert hast. Das ist z.&nbsp;B. nützlich, um zu überprüfen, ob Unternehmen Dir rechtzeitig antworten.</p>
                <p>Diese Daten sind <em>ausschließlich</em> auf Deinem eigenen Computer gespeichert und werden unter keinen Umständen an uns gesendet. Sie bleiben (auch nach einem Neustart) so lange erhalten, bis Du die Offline-Webseiten-Daten in Deinem Browser leerst oder unten alle Anfragen löscht. Du kannst sämtliche Daten auch <a onClick={this.exportRequests}>als CSV exportieren</a>.</p>
                <table className='table'>
                    <thead><th>Datum</th><th>Empfänger</th><th>Zeichen</th><th>Art</th><th>Anfrage per</th></thead>
                    <tbody>{requests}</tbody>
                </table>
                <button id="clear-button" onClick={this.clearRequests} style="float: right;">Alle Anfragen löschen</button>
                <div className='clearfix' />
            </main>
        );
    }

    exportRequests() {
        // see https://stackoverflow.com/a/14966131
        let csv = 'data:text/csv;charset=utf-8,';
        // TODO: We should set the filename to something sensible.
        csv += 'date;recipient;reference;type;via\r\n';
        Object.keys(this.state.requests).forEach((reference) => {
            let request = this.state.requests[reference];
            csv += [ request.date, request.recipient, reference, request.type, request.via ].join(';') + '\r\n';
        });

        window.open(encodeURI(csv));
    }

    clearRequests() {
        if(window.confirm('Wirklich alle Daten löschen? Das kann *nicht* rückgängig gemacht werden.')) {
            localforage.clear()
                .then(() => { this.setState({ requests: {} }); })
                .catch((err) => { console.log('Could not clear requests: ' + err); /* TODO: Proper error handling. */});
        }
    }
}

preact.render((<RequestList/>), null, document.getElementById('my-requests'));
