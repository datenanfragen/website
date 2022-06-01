import { render } from 'preact';
import { IntlProvider, MarkupText, Text } from 'preact-i18n';
import { useCallback, useEffect, useMemo, useState } from 'preact/hooks';
import { FeatureDisabledWidget } from './Components/FeatureDisabledWidget';
import { UserRequest, UserRequests } from './DataType/UserRequests';
import { useAppStore } from './store/app';
import { hash, objFilter } from './Utility/common';
import { rethrow } from './Utility/errors';
import t from './Utility/i18n';
import { Privacy, PRIVACY_ACTIONS } from './Utility/Privacy';

const user_requests = new UserRequests();

const RequestList = () => {
    const country = useAppStore((state) => state.country);

    const [requests, setRequests] = useState<Record<string, UserRequest>>({});
    const [selectedRequestIds, setSelectedRequestIds] = useState<string[]>([]);

    useEffect(() => {
        user_requests.getRequests()?.then((new_requests) => new_requests && setRequests(new_requests));
    }, []);

    const sortedRequestIds = useMemo(
        () =>
            Object.keys(requests).sort((a, b) => {
                const req_a = requests[a];
                const req_b = requests[b];

                if (req_a.date < req_b.date) return -1;
                else if (req_a.date == req_b.date) {
                    if (req_a.slug < req_b.slug) return -1;
                    else if (req_a.slug == req_b.slug) {
                        if (req_a.reference < req_b.reference) return -1;
                        else if (req_a.reference == req_b.reference) return 0;
                        return 1;
                    }
                    return 1;
                }
                return 1;
            }),
        [requests]
    );

    const buildCsv = useCallback(() => {
        const csv =
            'date;slug;recipient;email;reference;type;via\r\n' +
            sortedRequestIds
                .filter((id) => selectedRequestIds.includes(id))
                .map((id) => {
                    const request = requests[id];
                    return (
                        [
                            request.date,
                            request.slug,
                            request.recipient.replace(/[\n\r]+/g, ', '),
                            request.email,
                            request.reference,
                            request.type,
                            request.via,
                        ].join(';') + '\r\n'
                    );
                });

        return new Blob([csv], { type: 'text/csv;charset=utf-8' });
    }, [requests, selectedRequestIds, sortedRequestIds]);

    const buildIcs = useCallback(() => {
        // Maps from date to request IDs.
        const grouped_requests = selectedRequestIds.reduce<Record<string, string[]>>(
            (acc, id) => ({ ...acc, [requests[id].date]: [...(acc[requests[id].date] || []), id] }),
            {}
        );

        const events = Object.keys(grouped_requests)
            .map((group) => {
                const items = grouped_requests[group].map((id) => {
                    const request = requests[id];
                    return `* ${request.recipient.split('\n', 1)[0]} (${
                        request.type === 'custom' && request.response_type
                            ? t(request.response_type, 'generator')
                            : t(request.type, 'my-requests')
                    } – ${request.reference})`;
                });
                const titles = grouped_requests[group]
                    .map((id) => requests[id].recipient.split('\n', 1)[0])
                    .map((title) => (title.length > 15 ? `${title.slice(0, 15)}...` : title));

                const heading_base = `${t('for', 'my-requests')} ${titles.slice(0, 2).join(', ')}`;
                const heading_ellipsis =
                    titles.length > 2
                        ? ` ${t('and', 'my-requests')} ${titles.length - 2} ${t('more', 'my-requests')}`
                        : '';
                const reminder_date = new Date(group);
                reminder_date.setDate(reminder_date.getDate() + 32);

                return `
BEGIN:VEVENT
UID:${hash(items.join(','))}@ics.datenanfragen.de
DTSTAMP:${new Date().toISOString().replace(/[:-]/g, '').substring(0, 15)}Z
DTSTART:${reminder_date.toISOString().replace(/-/g, '').substring(0, 8)}
SUMMARY:${t('ics-summary', 'my-requests')} ${heading_base}${heading_ellipsis}
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
            })
            .join('\n');

        const ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Datenanfragen.de e. V.//${t('ics-title', 'my-requests')}//${t('ics-lang', 'my-requests')}
X-WR-CALNAME:${t('ics-title', 'my-requests')} (${new Date().toISOString().substring(0, 10)})${events}
END:VCALENDAR`;

        return new Blob([ics.split('\n').join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    }, [requests, selectedRequestIds]);

    const removeRequest = useCallback(
        (request_id: string) => {
            if (window.confirm(t('modal-delete-single-request', 'privacy-controls'))) {
                user_requests
                    .removeRequest(request_id)
                    ?.then(() => {
                        setRequests(objFilter(requests, ([id, b]) => id !== request_id));
                        setSelectedRequestIds(selectedRequestIds.filter((id) => id !== request_id));
                    })
                    .catch((error) => rethrow(error, 'Could not remove request', { db_id: request_id }));
            }
        },
        [selectedRequestIds, requests]
    );
    const clearRequests = useCallback(() => {
        if (window.confirm(t('modal-clear-requests', 'privacy-controls'))) {
            user_requests
                .clearRequests()
                ?.then(() => setRequests({}))
                .catch((error) => rethrow(error, 'Could not clear requests.'));
        }
    }, []);

    if (!Privacy.isAllowed(PRIVACY_ACTIONS.SAVE_MY_REQUESTS)) {
        return (
            <main>
                <FeatureDisabledWidget />
            </main>
        );
    }

    const locale_country = country.toUpperCase();
    const date_locale = locale_country === 'ALL' ? window.LOCALE : `${window.LOCALE}-${locale_country}`;

    const request_rows = sortedRequestIds.map((id) => {
        const request = requests[id];
        const recipient = request.recipient.split('\n', 1)[0];

        return (
            <tr>
                <td>
                    <input
                        id={`request-${id}-checkbox`}
                        checked={selectedRequestIds.includes(id)}
                        type="checkbox"
                        className="form-element"
                        onChange={(e) =>
                            setSelectedRequestIds((prev) =>
                                e.currentTarget.checked
                                    ? [...prev, e.currentTarget.dataset.dbId!]
                                    : prev.filter((i) => i !== e.currentTarget.dataset.dbId!)
                            )
                        }
                        data-db-id={id}
                    />
                </td>
                <td data-label={t('date', 'my-requests')}>
                    {new Date(request.date).toLocaleDateString(date_locale, {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })}
                </td>
                <td data-label={t('recipient', 'my-requests')}>
                    {request.slug ? (
                        <a
                            href={
                                window.BASE_URL +
                                (request.response_type === 'complaint' ? 'supervisory-authority/' : 'company/') +
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
                    {!request.response_type && [
                        <a
                            href={`${window.BASE_URL}generator/#!response_type=admonition&response_to=${id}`}
                            className="button button-small button-secondary">
                            {t('admonition', 'generator')}
                        </a>,
                        <a
                            href={`${window.BASE_URL}generator/#!response_type=complaint&response_to=${id}`}
                            className="button button-small button-secondary">
                            {t('complaint', 'generator')}
                        </a>,
                    ]}
                    <button
                        className="button button-secondary button-small icon-trash"
                        onClick={() => removeRequest(id)}
                    />
                </td>
            </tr>
        );
    });

    const csv_download_filename = `${new URL(window.BASE_URL).hostname.replace('www.', '')}_export_${new Date()
        .toISOString()
        .substring(0, 10)}.csv`;
    const ics_download_filename = `${new URL(window.BASE_URL).hostname.replace('www.', '')}_${new Date()
        .toISOString()
        .substring(0, 10)}.ics`;

    return (
        <IntlProvider scope="my-requests" definition={window.I18N_DEFINITION}>
            <main>
                <div>
                    <p>
                        <MarkupText id="explanation" />
                    </p>
                    <p>
                        <MarkupText id="explanation-saving" />
                    </p>

                    {Object.values(requests).length === 0 ? (
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

                            <a
                                className="button button-primary"
                                href={`${window.BASE_URL}generator`}
                                style="float: right;">
                                <Text id="generate-request" />
                            </a>
                            <div className="clearfix" />
                        </div>
                    ) : (
                        [
                            <table id="my-requests-table" className="table fancy-table fancy-table-mobile">
                                <thead>
                                    <tr>
                                        <th>
                                            <input
                                                id="toggle-all-checkbox"
                                                checked={selectedRequestIds.length == sortedRequestIds.length}
                                                type="checkbox"
                                                className="form-element"
                                                title={t('toggle-all', 'my-requests')}
                                                onChange={() =>
                                                    setSelectedRequestIds(
                                                        selectedRequestIds.length === sortedRequestIds.length
                                                            ? []
                                                            : sortedRequestIds
                                                    )
                                                }
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
                                    </tr>
                                </thead>
                                <tbody>{request_rows}</tbody>
                            </table>,
                            <div id="my-requests-buttons">
                                <a
                                    id="download-button"
                                    className="button button-secondary"
                                    href={URL.createObjectURL(buildCsv())}
                                    download={csv_download_filename}
                                    style="margin-right: 10px;">
                                    <Text id="export-btn" />
                                </a>
                                <a
                                    id="export-ics-button"
                                    className="button button-secondary"
                                    href={URL.createObjectURL(buildIcs())}
                                    download={ics_download_filename}
                                    style="margin-right: 10px;">
                                    <Text id="export-ics" />
                                </a>
                                <button id="clear-button" className="button button-secondary" onClick={clearRequests}>
                                    <Text id="delete-all-btn" />
                                </button>
                            </div>,
                        ]
                    )}
                    <div className="clearfix" />
                </div>
            </main>
        </IntlProvider>
    );
};

(window as typeof window & { renderMyRequestsWidget: () => void }).renderMyRequestsWidget = function () {
    const my_requests_div = document.getElementById('my-requests');
    if (my_requests_div) render(<RequestList />, my_requests_div.parentElement!, my_requests_div);
};
