import preact from 'preact';
import { IntlProvider, Text, MarkupText } from 'preact-i18n';
import t from 'Utility/i18n';
import localforage from 'localforage';
import Privacy, {PRIVACY_ACTIONS} from "Utility/Privacy";
import {rethrow} from "./Utility/errors";

export default class UserRequests {
    constructor() {
        // TODO: Is there a better place for this?
        this.localforage_instance = localforage.createInstance({
            'name': 'Datenanfragen.de', // TODO: Use the actual domain here?
            'storeName': 'my-requests'
        });
    }

    getRequests() {
        let requests = {};
        return new Promise((resolve, reject) => {
            this.localforage_instance.iterate((data, reference) => {
                requests[reference] = data;
            })
                .then(() => {
                    resolve(requests);
                })
                .catch((error) => {
                    rethrow(error, 'Could not get requests');
                    reject();
                });
        });
    }

    clearRequests() {
        return this.localforage_instance.clear();
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
                let recipient = request.recipient.split('\n', 1)[0]; // TODO: Proper authority pages and links
                request_rows.push(<tr><td data-label={t('date', 'my-requests')}>{request.date}</td><td data-label={t('recipient', 'my-requests')}>{request.slug ? <a href={BASE_URL + (request.response_type === 'complaint' ? 'supervisory-authority/' : 'company/') + request.slug}>{recipient}</a> : recipient}</td><td data-label={t('reference', 'my-requests')}>{request.reference}</td><td data-label={t('type', 'my-requests')}>{request.type === 'custom' && request.response_type ? t(request.response_type, 'generator') : t(request.type, 'my-requests')}</td><td data-label={t('via', 'my-requests')}>{t(request.via, 'my-requests')}</td>
                    <td>{!request.response_type ? [<a href={BASE_URL + 'generator/?response_type=admonition&response_to=' + reference} className="button button-small button-secondary" style="margin-right: 10px;">{t('admonition', 'generator')}</a>, <a href={BASE_URL + 'generator/?response_type=complaint&response_to=' + reference} className="button button-small button-secondary">{t('complaint', 'generator')}</a>] : []}</td></tr>);
            });

            let download_filename = (new URL(BASE_URL)).hostname.replace('www.', '') + '_export_' + (new Date()).toISOString().substring(0, 10) + '.csv';

            let table;
            if(Object.values(this.state.requests).length === 0) table = <div className="box box-info"><Text id="no-requests" /></div>
            else {
                table = [<table id="my-requests-table" className='table'>
                    <thead><th><Text id="date" /></th><th><Text id="recipient" /></th><th><Text id="reference" /></th><th><Text id="type" /></th><th><Text id="via" /></th><th></th></thead>
                    <tbody>{request_rows}</tbody>
                </table>,
                <div id="my-requests-buttons">
                    <a id="download-button" className="button button-secondary" href={URL.createObjectURL(this.buildCsv())} download={download_filename} style="margin-right: 10px;"><Text id="export-btn" /></a>
                    <button id="clear-button" className="button-secondary" onClick={this.clearRequests}><Text id="delete-all-btn" /></button>
                </div>];
            }

            content = <div><p><MarkupText id="explanation" /></p>
                <p><MarkupText id="explanation-saving" /></p>
                {table}
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
        if(window.confirm(t('modal-clear-requests', 'privacy-controls'))) {
            this.user_requests.clearRequests()
                .then(() => {
                    this.setState({requests: []})
                })
                .catch((error) => {
                    rethrow(error, 'Could not clear requests.');
                });
        }
    }
}

preact.render((<RequestList/>), null, document.getElementById('my-requests'));
