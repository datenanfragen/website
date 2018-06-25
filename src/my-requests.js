import preact from 'preact';
import { IntlProvider, Text, MarkupText } from 'preact-i18n';
import t from 'Utility/i18n';
import localforage from 'localforage';
import Privacy, {PRIVACY_ACTIONS} from "Utility/Privacy";

export default class UserRequests {
    constructor() {
        // TODO: Is there a better place for this?
        localforage.config({
            'name': 'Datenanfragen.de', // TODO: Use the actual domain here?
            'storeName': 'my-requests'
        });
    }

    getRequests() {
        let requests = {};
        return new Promise((resolve, reject) => {
            localforage.iterate((data, reference) => {
                requests[reference] = data;
            })
                .then(() => {
                    resolve(requests);
                })
                .catch(() => {
                    console.log('Could not get requests.');
                    /* TODO: Proper error handling. */
                    reject();
                });
        });
    }

    clearRequests() {
        return localforage.clear();
    }
}

class RequestList extends preact.Component {
    constructor(props) {
        super(props);

        this.state = {
            requests: []
        };

        this.user_requests = new UserRequests();
        this.user_requests.getRequests()
            .then(requests => {
                this.setState({
                    requests: requests
                });
            });

        this.clearRequests = this.clearRequests.bind(this);
        this.buildCsv = this.buildCsv.bind(this);
    }

    render() {
        let content;

        if(Privacy.isAllowed(PRIVACY_ACTIONS.SAVE_MY_REQUESTS)) {
            let request_rows = [];
            Object.keys(this.state.requests).forEach((reference) => {
                let request = this.state.requests[reference];
                if(!request) return;
                let recipient = request.recipient.split('\n', 1)[0];
                request_rows.push(<tr><td>{request.date}</td><td>{request.slug ? <a href={BASE_URL + 'company/' + request.slug}>{recipient}</a> : recipient}</td><td>{reference}</td><td>{t(request.type, 'my-requests')}</td><td>{t(request.via, 'my-requests')}</td></tr>);
            });

            let download_filename = (new URL(BASE_URL)).hostname.replace('www.', '') + '_export_' + (new Date()).toISOString().substring(0, 10) + '.csv';

            content = <div><p><MarkupText id="explanation" /></p>
                <p><MarkupText id="explanation-saving" /></p>
                <table className='table'>
                    <thead><th><Text id="date" /></th><th><Text id="recipient" /></th><th><Text id="reference" /></th><th><Text id="type" /></th><th><Text id="via" /></th></thead>
                    <tbody>{request_rows}</tbody>
                </table>
                { /* TODO: Style differently once we have a design. */ }
                <div style="float: right;">
                    <a id="download-button" className="button button-secondary" href={URL.createObjectURL(this.buildCsv())} download={download_filename} style="margin-right: 10px;"><Text id="export-btn" /></a>
                    <button id="clear-button" className="button-secondary" onClick={this.clearRequests}><Text id="delete-all-btn" /></button>
                </div>
                <div className='clearfix' /></div>;
        }
        else {
            content = <main><MarkupText id="feature-disabled"/></main>;
        }

        return (
            <IntlProvider scope="my-requests" definition={I18N_DEFINITION}>
                <main>
                    {content}
                </main>
            </IntlProvider>
        );
    }

    buildCsv() {
        let csv = 'date;slug;recipient;reference;type;via\r\n';
        Object.keys(this.state.requests).forEach((reference) => {
            let request = this.state.requests[reference];
            csv += [ request.date, request.slug, request.recipient.replace(/[\r\n]+/g, ', '), reference, request.type, request.via ].join(';') + '\r\n';
        });

        return new Blob([csv], { type: 'text/csv;charset=utf-8' });
    }

    clearRequests() {
        if(window.confirm(t('delete-all-confirm', 'my-requests'))) {
            this.user_requests.clearRequests()
                .then(() => {
                    this.setState({requests: []})
                })
                .catch((err) => {
                    console.log('Could not clear requests: ' + err);
                    /* TODO: Proper error handling. */
                });
        }
    }
}

preact.render((<RequestList/>), null, document.getElementById('my-requests'));
