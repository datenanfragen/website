import { render, Component } from 'preact';
import { IntlProvider, Text, MarkupText } from 'preact-i18n';
import t from 'Utility/i18n';
import localforage from 'localforage';
import Privacy, { PRIVACY_ACTIONS } from 'Utility/Privacy';
import { rethrow } from './Utility/errors';
import { hash } from './Utility/common';
import FeatureDisabledWidget from 'Components/FeatureDisabledWidget';

export default class UserRequests {
    constructor() {
        // TODO: Is there a better place for this?
        this.localforage_instance = localforage.createInstance({
            name: 'Datenanfragen.de',
            storeName: 'my-requests',
        });
    }

    storeRequest(db_id, item) {
        if (Privacy.isAllowed(PRIVACY_ACTIONS.SAVE_MY_REQUESTS)) {
            this.localforage_instance.setItem(db_id, item).catch((error) => {
                rethrow(error, 'Saving request failed.', { db_id: db_id });
            });
        }
    }

    getRequest(db_id) {
        return this.localforage_instance.getItem(db_id);
    }

    getRequests() {
        let requests = {};
        return new Promise((resolve, reject) => {
            this.localforage_instance
                .iterate((data, reference) => {
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

    removeRequest(db_id) {
        return this.localforage_instance.removeItem(db_id);
    }
}

class RequestList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            requests: [],
            sorted_request_ids: [],
            selected_requests: [],
        };

        this.user_requests = new UserRequests();
        this.user_requests.getRequests().then((requests) => {
            this.setState((prev) => {
                prev.requests = requests;
                let sorted_request_ids = Object.keys(requests).sort((a, b) => {
                    a = requests[a];
                    b = requests[b];

                    // Someone *please* tell me there is a less ugly way to do this.
                    if (a.date < b.date) return -1;
                    else if (a.date == b.date) {
                        if (a.slug < b.slug) return -1;
                        else if (a.slug == b.slug) {
                            if (a.reference < b.reference) return -1;
                            else if (a.reference == b.reference) return 0;
                            return 1;
                        }
                        return 1;
                    }
                    return 1;
                });

                prev.sorted_request_ids = sorted_request_ids;
                prev.selected_requests = sorted_request_ids.slice();

                return prev;
            });
        });

        this.clearRequests = this.clearRequests.bind(this);
        this.removeRequest = this.removeRequest.bind(this);
        this.buildCsv = this.buildCsv.bind(this);
        this.buildIcs = this.buildIcs.bind(this);
        this.onCheckboxChange = this.onCheckboxChange.bind(this);
    }

    onCheckboxChange(e) {
        this.setState((prev) => {
            if (e.target.checked) prev.selected_requests.push(e.target.dataset.dbId);
            else prev.selected_requests.splice(prev.selected_requests.indexOf(e.target.dataset.dbId), 1);
            return prev;
        });
    }

    render() {
        let content;
        const date_options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const locale_country = globals.country.toUpperCase();
        const date_locale = locale_country === 'ALL' ? LOCALE : `${LOCALE}-${locale_country}`;
        if (Privacy.isAllowed(PRIVACY_ACTIONS.SAVE_MY_REQUESTS)) {
            let request_rows = [];
            this.state.sorted_request_ids.forEach((id) => {
                let request = this.state.requests[id];
                if (!request) return;
                let recipient = request.recipient.split('\n', 1)[0]; // TODO: Proper authority pages and links
                const date = new Date(request.date).toLocaleDateString(date_locale, date_options);
                request_rows.push(
                    <tr>
                        <td>
                            <input
                                id={'request-' + id + '-checkbox'}
                                checked={this.state.selected_requests.includes(id)}
                                type="checkbox"
                                className="form-element"
                                onChange={this.onCheckboxChange}
                                data-db-id={id}
                            />
                        </td>
                        <td data-label={t('date', 'my-requests')}>{date}</td>
                        <td data-label={t('recipient', 'my-requests')}>
                            {request.slug ? (
                                <a
                                    href={
                                        BASE_URL +
                                        (request.response_type === 'complaint'
                                            ? 'supervisory-authority/'
                                            : 'company/') +
                                        request.slug
                                    }>
                                    {recipient}
                                </a>
                            ) : (
                                recipient
                            )}
                        </td>
                        <td data-label={t('reference', 'my-requests')}>{request.reference}</td>
                        <td data-label={t('type', 'my-requests')}>
                            {request.type === 'custom' && request.response_type
                                ? t(request.response_type, 'generator')
                                : t(request.type, 'my-requests')}
                        </td>
                        <td data-label={t('via', 'my-requests')}>{t(request.via, 'my-requests')}</td>
                        <td className="my-requests-button-column">
                            {!request.response_type
                                ? [
                                      <a
                                          href={BASE_URL + 'generator/#!response_type=admonition&response_to=' + id}
                                          className="button button-small button-secondary">
                                          {t('admonition', 'generator')}
                                      </a>,
                                      <a
                                          href={BASE_URL + 'generator/#!response_type=complaint&response_to=' + id}
                                          className="button button-small button-secondary">
                                          {t('complaint', 'generator')}
                                      </a>,
                                  ]
                                : []}
                            <button
                                className="button button-secondary button-small icon-trash"
                                onClick={() => {
                                    this.removeRequest(id);
                                }}
                            />
                        </td>
                    </tr>
                );
            });

            let csv_download_filename =
                new URL(BASE_URL).hostname.replace('www.', '') +
                '_export_' +
                new Date().toISOString().substring(0, 10) +
                '.csv';
            let ics_download_filename =
                new URL(BASE_URL).hostname.replace('www.', '') +
                '_' +
                new Date().toISOString().substring(0, 10) +
                '.ics';

            let table;
            if (Object.values(this.state.requests).length === 0) {
                table = (
                    <div className="box box-info" style="width: 80%; margin: auto;">
                        <h2>
                            <Text id="no-requests-heading" />
                        </h2>
                        <img
                            alt={t('no-requests-heading', 'my-requests')}
                            style="display: block; margin: 20px auto; width: 40%;"
                            src="/img/humaaans/empty.svg"
                        />
                        <Text id="no-requests" />
                        <br />

                        <a className="button button-primary" href={BASE_URL + 'generator'} style="float: right;">
                            <Text id="generate-request" />
                        </a>
                        <div className="clearfix" />
                    </div>
                );
            } else {
                table = [
                    <table id="my-requests-table" className="table fancy-table fancy-table-mobile">
                        <thead>
                            <th>
                                <input
                                    id="toggle-all-checkbox"
                                    checked={
                                        this.state.selected_requests.length == this.state.sorted_request_ids.length
                                    }
                                    type="checkbox"
                                    className="form-element"
                                    title={t('toggle-all', 'my-requests')}
                                    onChange={(e) => {
                                        let selected = [];
                                        if (this.state.selected_requests.length != this.state.sorted_request_ids.length)
                                            selected = this.state.sorted_request_ids.slice();

                                        this.setState({ selected_requests: selected });
                                    }}
                                />
                            </th>
                            <th>
                                <Text id="date" />
                            </th>
                            <th>
                                <Text id="recipient" />
                            </th>
                            <th>
                                <Text id="reference" />
                            </th>
                            <th>
                                <Text id="type" />
                            </th>
                            <th>
                                <Text id="via" />
                            </th>
                            <th />
                        </thead>
                        <tbody>{request_rows}</tbody>
                    </table>,
                    <div id="my-requests-buttons">
                        <a
                            id="download-button"
                            className="button button-secondary"
                            href={URL.createObjectURL(this.buildCsv())}
                            download={csv_download_filename}
                            style="margin-right: 10px;">
                            <Text id="export-btn" />
                        </a>
                        <a
                            id="export-ics-button"
                            className="button button-secondary"
                            href={URL.createObjectURL(this.buildIcs())}
                            download={ics_download_filename}
                            style="margin-right: 10px;">
                            <Text id="export-ics" />
                        </a>
                        <button id="clear-button" className="button button-secondary" onClick={this.clearRequests}>
                            <Text id="delete-all-btn" />
                        </button>
                    </div>,
                ];
            }

            content = (
                <div>
                    <p>
                        <MarkupText id="explanation" />
                    </p>
                    <p>
                        <MarkupText id="explanation-saving" />
                    </p>
                    {table}
                    <div className="clearfix" />
                </div>
            );
        } else {
            content = (
                <main>
                    <FeatureDisabledWidget />
                </main>
            );
        }

        return (
            <IntlProvider scope="my-requests" definition={I18N_DEFINITION}>
                <main>{content}</main>
            </IntlProvider>
        );
    }

    buildCsv() {
        let csv = 'date;slug;recipient;email;reference;type;via\r\n';
        this.state.sorted_request_ids
            .filter((a) => this.state.selected_requests.includes(a))
            .forEach((id) => {
                let request = this.state.requests[id];
                csv +=
                    [
                        request.date,
                        request.slug,
                        request.recipient.replace(/[\n\r]+/g, ', '),
                        request.email,
                        request.reference,
                        request.type,
                        request.via,
                    ].join(';') + '\r\n';
            });

        return new Blob([csv], { type: 'text/csv;charset=utf-8' });
    }

    buildIcs() {
        let now = new Date().toISOString().replace(/[:-]/g, '').substring(0, 15) + 'Z';

        let grouped_requests = this.state.selected_requests.reduce((accumulator, id) => {
            if (!accumulator[this.state.requests[id].date]) accumulator[this.state.requests[id].date] = [];
            accumulator[this.state.requests[id].date].push(id);
            return accumulator;
        }, {});

        let events = '';
        Object.keys(grouped_requests).forEach((group) => {
            let items = [];
            let titles = [];
            grouped_requests[group].forEach((id) => {
                let request = this.state.requests[id];
                titles.push(request.recipient.split('\n', 1)[0]);
                items.push(
                    `* ${request.recipient.split('\n', 1)[0]} (${
                        request.type === 'custom' && request.response_type
                            ? t(request.response_type, 'generator')
                            : t(request.type, 'my-requests')
                    } – ${request.reference})`
                );
            });
            titles = titles.map((title) => (title.length > 15 ? `${title.slice(0, 15)}...` : title));
            let heading = `${t('for', 'my-requests')} ${titles.slice(0, 2).join(', ')}`;
            heading +=
                titles.length > 2 ? ` ${t('and', 'my-requests')} ${titles.length - 2} ${t('more', 'my-requests')}` : '';
            let reminder_date = new Date(group);
            reminder_date.setDate(reminder_date.getDate() + 32);

            events += `
BEGIN:VEVENT
UID:${hash(items.join(','))}@ics.datenanfragen.de
DTSTAMP:${now}
DTSTART:${reminder_date.toISOString().replace(/-/g, '').substring(0, 8)}
SUMMARY:${t('ics-summary', 'my-requests')} ${heading}
DESCRIPTION:${t('ics-desc', 'my-requests').replace(/([,;])/g, '\\$1')}\\n\\n\n ${items
                .join('\\n\n ')
                .replace(/([,;])/g, '\\$1')}
BEGIN:VALARM
TRIGGER:+PT720M
ACTION:DISPLAY
DESCRIPTION:${t('ics-summary', 'my-requests')}
END:VALARM
URL;VALUE=URI:${t('ics-url', 'my-requests')}
END:VEVENT`;
        });

        let ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Datenanfragen.de e. V.//${t('ics-title', 'my-requests')}//${t('ics-lang', 'my-requests')}
X-WR-CALNAME:${t('ics-title', 'my-requests')} (${new Date().toISOString().substring(0, 10)})${events}
END:VCALENDAR`;

        return new Blob([ics.split('\n').join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    }

    clearRequests() {
        if (window.confirm(t('modal-clear-requests', 'privacy-controls'))) {
            this.user_requests
                .clearRequests()
                .then(() => {
                    this.setState({ requests: [] });
                })
                .catch((error) => {
                    rethrow(error, 'Could not clear requests.');
                });
        }
    }

    removeRequest(request_id) {
        if (window.confirm(t('modal-delete-single-request', 'privacy-controls'))) {
            this.user_requests
                .removeRequest(request_id)
                .then(() => {
                    this.setState((prev) => {
                        delete prev.requests[request_id];
                        prev.sorted_request_ids = prev.sorted_request_ids.filter((id) => id !== request_id);
                        prev.selected_requests = prev.selected_requests.filter((id) => id !== request_id);

                        return prev;
                    });
                })
                .catch((error) => {
                    rethrow(error, 'Could not remove request', { db_id: request_id });
                });
        }
    }
}

window.renderMyRequestsWidget = function () {
    let my_requests_div = document.getElementById('my-requests');
    render(<RequestList />, my_requests_div.parentElement, my_requests_div);
};
