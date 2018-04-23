import preact from 'preact';
import { IntlProvider, Text, MarkupText } from 'preact-i18n';
import t from 'i18n';
import localforage from 'localforage';

class RequestList extends preact.Component {
    constructor(props) {
        super(props);
        this.state = { requests: {} };

        // TODO: Is there a better place for this?
        localforage.config({
            'name': 'Datenanfragen.de', // TODO: Use the actual domain here?
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
        let request_rows = [];
        Object.keys(this.state.requests).forEach((reference) => {
            let request = this.state.requests[reference];
            if(!request) return;
            let recipient = request.recipient.split('\n', 1)[0];
            request_rows.push(<tr><td>{request.date}</td><td>{request.slug ? <a href={BASE_URL + 'company/' + request.slug}>{recipient}</a> : recipient}</td><td>{reference}</td><td>{t(request.type, 'my-requests')}</td><td>{t(request.via, 'my-requests')}</td></tr>);
        });
        return (
            <IntlProvider scope="my-requests" definition={I18N_DEFINITION}>
                <main>
                    <h1><Text id="title" /></h1>
                    <p><MarkupText id="explanation" /></p>
                    {/* TODO: This is extremely ugly (and will not work for some languages) but I don't see a better way that still allows us to set the onClick handler. */}
                    <p><MarkupText id="explanation-saving" /> <a onClick={this.exportRequests} href="#"><Text id="explanation-saving-link"/></a>.</p>
                    <table className='table'>
                        <thead><th><Text id="date" /></th><th><Text id="recipient" /></th><th><Text id="reference" /></th><th><Text id="type" /></th><th><Text id="via" /></th></thead>
                        <tbody>{request_rows}</tbody>
                    </table>
                    <button id="clear-button" onClick={this.clearRequests} style="float: right;"><Text id="delete-all" /></button>
                    <div className='clearfix' />
                </main>
            </IntlProvider>
        );
    }

    exportRequests(e) {
        e.preventDefault();
        // see https://stackoverflow.com/a/14966131
        let csv = 'data:text/csv;charset=utf-8,';
        // TODO: We should set the filename to something sensible. See
        csv += 'date;slug;recipient;reference;type;via\r\n';
        Object.keys(this.state.requests).forEach((reference) => {
            let request = this.state.requests[reference];
            csv += [ request.date, request.slug, request.recipient.replace(/[\r\n]+/g, ', '), reference, request.type, request.via ].join(';') + '\r\n';
        });

        window.open(encodeURI(csv));
    }

    clearRequests() {
        if(window.confirm(t('delete-all-confirm', 'my-requests'))) {
            localforage.clear()
                .then(() => { this.setState({ requests: {} }); })
                .catch((err) => { console.log('Could not clear requests: ' + err); /* TODO: Proper error handling. */});
        }
    }
}

preact.render((<RequestList/>), null, document.getElementById('my-requests'));
