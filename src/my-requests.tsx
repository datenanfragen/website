import { render } from 'preact';
import { useState, useCallback, useMemo } from 'preact/hooks';
import { IntlProvider, Text, MarkupText } from 'preact-i18n';
import { useAppStore } from './store/app';
import { FeatureDisabledWidget } from './Components/FeatureDisabledWidget';
import t from './Utility/i18n';
import { Privacy, PRIVACY_ACTIONS } from './Utility/Privacy';
import { icsFromProceedings, findOriginalRequest } from './Utility/requests';
import { useProceedingsStore } from './store/proceedings';
import type { Proceeding } from './types/proceedings';
import { RequestType } from 'request';

const RequestList = () => {
    const proceedings = useProceedingsStore((state) => state.proceedings);
    const clearProceedings = useProceedingsStore((state) => state.clearProceedings);
    const [selectedRequestIds, setSelectedRequestIds] = useState<string[]>([]);

    const sortedRequestIds = useMemo(
        () =>
            Object.keys(proceedings).sort((a, b) => {
                const req_a = Object.values(proceedings[a].messages)[0];
                const req_b = Object.values(proceedings[a].messages)[0];

                if (req_a.date < req_b.date) return -1;
                else if (req_a.date == req_b.date) {
                    if ((req_a.slug ?? 0) < (req_b.slug ?? 0)) return -1;
                    else if (req_a.slug == req_b.slug) {
                        if (req_a.reference < req_b.reference) return -1;
                        else if (req_a.reference == req_b.reference) return 0;
                        return 1;
                    }
                    return 1;
                }
                return 1;
            }),
        [proceedings]
    );

    const buildCsv = useCallback(() => {
        const csv =
            'date;slug;recipient;email;reference;type;via\r\n' +
            sortedRequestIds
                .filter((id) => selectedRequestIds.includes(id))
                .map((id) =>
                    Object.entries(proceedings[id].messages).reduce(
                        (acc, [id, msg]) =>
                            acc +
                            [
                                msg.date,
                                msg.slug,
                                msg.correspondent_address.replace(/[\n\r]+/g, ', '),
                                msg.correspondent_email,
                                msg.reference,
                                msg.type,
                                msg.transport_medium,
                            ].join(';') +
                            '\r\n',
                        ''
                    )
                );

        return new Blob([csv], { type: 'text/csv;charset=utf-8' });
    }, [proceedings, selectedRequestIds, sortedRequestIds]);

    const buildIcs = useCallback(
        () =>
            icsFromProceedings(
                sortedRequestIds.reduce<Proceeding[]>(
                    (acc, id) => (selectedRequestIds.includes(id) ? [...acc, proceedings[id]] : acc),
                    []
                )
            ),
        [proceedings, selectedRequestIds, sortedRequestIds]
    );

    if (!Privacy.isAllowed(PRIVACY_ACTIONS.SAVE_MY_REQUESTS)) {
        return (
            <main>
                <FeatureDisabledWidget />
            </main>
        );
    }

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

                    {Object.values(proceedings).length === 0 ? (
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
                        <>
                            <ul className="proceeding-rows">
                                {sortedRequestIds.map((id) => (
                                    <li className="proceeding-row-list-item">
                                        <input
                                            className="form-element"
                                            type="checkbox"
                                            aria-labelledby={`proceeding-row-heading-${proceedings[id].reference}`}
                                            checked={selectedRequestIds.includes(proceedings[id].reference)}
                                            data-reference={proceedings[id].reference}
                                            onChange={(e) =>
                                                setSelectedRequestIds((prev) =>
                                                    e.currentTarget.checked
                                                        ? [...prev, e.currentTarget.dataset.reference!]
                                                        : prev.filter((i) => i !== e.currentTarget.dataset.reference!)
                                                )
                                            }
                                        />
                                        <ProceedingRow proceeding={proceedings[id]} />
                                    </li>
                                ))}
                            </ul>

                            <div id="my-requests-buttons">
                                <button
                                    id="toggle-all-button"
                                    className="button button-secondary"
                                    style="margin-right: 10px;"
                                    onClick={() =>
                                        setSelectedRequestIds(
                                            selectedRequestIds.length === sortedRequestIds.length
                                                ? []
                                                : sortedRequestIds
                                        )
                                    }>
                                    <Text
                                        id={`${
                                            selectedRequestIds.length === sortedRequestIds.length ? 'de' : ''
                                        }select-all`}
                                    />
                                </button>
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
                                <button
                                    id="clear-button"
                                    className="button button-secondary"
                                    onClick={() =>
                                        window.confirm(t('modal-clear-requests', 'privacy-controls')) &&
                                        clearProceedings()
                                    }>
                                    <Text id="delete-all-btn" />
                                </button>
                            </div>
                        </>
                    )}
                    <div className="clearfix" />
                </div>
            </main>
        </IntlProvider>
    );
};

type ProceedingRowProps = {
    proceeding: Proceeding;
};

const ProceedingRow = (props: ProceedingRowProps) => {
    const country = useAppStore((state) => state.country);
    const removeMessage = useProceedingsStore((state) => state.removeMessage);
    const removeProceeding = useProceedingsStore((state) => state.removeProceeding);

    const original_request = findOriginalRequest(props.proceeding);

    const locale_country = country.toUpperCase();
    const date_locale = locale_country === 'ALL' ? window.LOCALE : `${window.LOCALE}-${locale_country}`;

    const recipient_name = original_request?.correspondent_address.split('\n')[0];

    return (
        <details className="proceeding-row">
            <summary>
                <h3 id={`proceeding-row-heading-${props.proceeding.reference}`}>
                    {original_request && (
                        <span
                            className={`icon-${original_request.type}`}
                            title={t(original_request.type as RequestType, 'my-requests')}
                            style="float: right;"
                        />
                    )}
                    {recipient_name?.length === 0 ? 'No Name' : recipient_name}
                </h3>
                <time
                    className={`proceeding-date ${
                        props.proceeding.status === 'overdue' ? 'proceeding-date-overdue' : ''
                    }`}
                    dateTime={original_request?.date.toISOString()}>
                    {original_request?.date.toLocaleDateString(date_locale, {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })}
                </time>
                <span
                    className={`proceeding-status badge ${
                        props.proceeding.status === 'done'
                            ? 'badge-success'
                            : props.proceeding.status === 'overdue'
                            ? 'badge-error'
                            : 'badge-warning'
                    }`}>
                    <Text id={props.proceeding.status} />
                </span>
                <div className="flex-spacer-mobile" aria-hidden={true} />
                <span className="proceeding-reference">{props.proceeding.reference}</span>
            </summary>

            <ul style="padding: 0">
                {Object.entries(props.proceeding.messages).map(([ref, msg], index) => (
                    <li className="proceeding-message">
                        <div style="width: 100%">
                            <time dateTime={msg?.date.toISOString()}>
                                {msg?.date.toLocaleDateString(date_locale, {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </time>
                            <h4>
                                {msg.type === original_request?.type
                                    ? t('original-request', 'my-requests')
                                    : t(msg.type, 'my-requests')}
                            </h4>
                            {msg.subject && msg.content ? (
                                <>
                                    <br />
                                    <button
                                        className="button button-unstyled icon icon-email"
                                        onClick={() => alert('TODO')}>
                                        {msg.subject}
                                    </button>
                                </>
                            ) : (
                                msg.subject && (
                                    <>
                                        <br />
                                        <span className="icon icon-email">{msg.subject}</span>
                                    </>
                                )
                            )}
                        </div>
                        {msg != original_request && (
                            <button
                                className="button button-secondary button-small icon-trash"
                                title={t('delete-message', 'my-requests')}
                                onClick={() => removeMessage(msg.id)}
                            />
                        )}
                        {index === Object.entries(props.proceeding.messages).length - 1 && (
                            <button className="button button-small button-primary" onClick={() => alert('TODO')}>
                                <Text id="message-react" />
                            </button>
                        )}
                    </li>
                ))}
            </ul>
            <div className="proceeding-actions">
                <button className="button button-small button-secondary icon icon-plus-circle">
                    <Text id="import-message" />
                </button>
                <button
                    className="button button-small button-error icon icon-trash"
                    onClick={() =>
                        confirm(t('delete-proceeding-confirm', 'my-requests')) &&
                        removeProceeding(props.proceeding.reference)
                    }>
                    <Text id="delete-proceeding" />
                </button>
            </div>
        </details>
    );
};

(window as typeof window & { renderMyRequestsWidget: () => void }).renderMyRequestsWidget = function () {
    const my_requests_div = document.getElementById('my-requests');
    if (my_requests_div) render(<RequestList />, my_requests_div.parentElement!, my_requests_div);
};
