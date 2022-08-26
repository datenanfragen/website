import { useState, useCallback, useMemo } from 'preact/hooks';
import { IntlProvider, Text } from 'preact-i18n';
import { useAppStore } from '../store/app';
import { FeatureDisabledWidget } from './FeatureDisabledWidget';
import t from '../Utility/i18n';
import { Privacy, PRIVACY_ACTIONS } from '../Utility/Privacy';
import { icsFromProceedings } from '../Utility/requests';
import {
    compareMessage,
    getGeneratedMessage,
    getNameFromMesssage,
    getNewestMessage,
    useProceedingsStore,
} from '../store/proceedings';
import type { Proceeding, Message } from '../types/proceedings';
import type { RequestType } from '../types/request.d';
import { useModal } from './Modal';
import { MessageMetadataInput } from './MessageMetadataInput';
import type { ComponentChildren } from 'preact';

type RequestListProps = {
    /** Component to show if no proceedings are available */
    emptyComponent: ComponentChildren;
    importEmailsButton?: ComponentChildren;
};
export const RequestList = (props: RequestListProps) => {
    const proceedings = useProceedingsStore((state) => state.proceedings);
    const clearProceedings = useProceedingsStore((state) => state.clearProceedings);

    const [selectedRequestIds, setSelectedRequestIds] = useState<string[]>([]);
    const [selectionMode, setSelectionMode] = useState(false);

    const sortedRequestIds = useMemo(
        () =>
            Object.keys(proceedings).sort((a, b) => {
                const req_a = Object.values(proceedings[a].messages)[0];
                const req_b = Object.values(proceedings[b].messages)[0];

                return compareMessage(req_a, req_b);
            }),
        [proceedings]
    );

    const buildCsv = useCallback(() => {
        const csv =
            'date;slug;recipient;email;reference;type;via\r\n' +
            sortedRequestIds
                .filter((id) => selectedRequestIds.includes(id))
                .map((id) =>
                    Object.values(proceedings[id].messages).reduce(
                        (acc, msg) =>
                            acc +
                            [
                                msg.date.toISOString().substring(0, 10),
                                msg.slug,
                                msg.correspondent_address?.replace(/[\n\r]+/g, ', '),
                                msg.correspondent_email || '',
                                msg.reference,
                                msg.type,
                                msg.transport_medium,
                            ].join(';') +
                            '\r\n',
                        ''
                    )
                )
                .join('');

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
            {Object.values(proceedings).length === 0 ? (
                <>{props.emptyComponent}</>
            ) : (
                <>
                    <div className="proceedings-toolbar">
                        <button
                            className="button button-secondary button-small"
                            onClick={() => setSelectionMode(!selectionMode)}>
                            {selectionMode ? <Text id="cancel" /> : <Text id="selection-mode" />}
                        </button>
                        {!selectionMode && (
                            <>
                                {props.importEmailsButton}
                                <button
                                    id="clear-button"
                                    className="button button-error button-small"
                                    onClick={() =>
                                        window.confirm(t('modal-clear-requests', 'privacy-controls')) &&
                                        clearProceedings()
                                    }>
                                    <Text id="delete-all-btn" />
                                </button>
                            </>
                        )}

                        {selectionMode && (
                            <div className="dropdown-container" style="float:right;">
                                <button className="icon-ellipsis button button-small button-secondary" />
                                <div className="dropdown" style="right: 0; max-width: 400px; width: 90vw;">
                                    <button
                                        id="toggle-all-button"
                                        className="button button-secondary"
                                        style="margin-right: 10px;"
                                        onClick={() => {
                                            setSelectionMode(true);
                                            setSelectedRequestIds(
                                                selectedRequestIds.length === sortedRequestIds.length
                                                    ? []
                                                    : sortedRequestIds
                                            );
                                        }}
                                        title={t('more-options', 'my-requests')}>
                                        <Text
                                            id={`${
                                                selectedRequestIds.length === sortedRequestIds.length ? 'de' : ''
                                            }select-all`}
                                        />
                                    </button>
                                    {selectedRequestIds.length > 0 && (
                                        <>
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
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    <ul className="proceeding-rows">
                        {sortedRequestIds.map((id) => (
                            <li className="proceeding-row-list-item">
                                {selectionMode && (
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
                                )}
                                <ProceedingRow proceeding={proceedings[id]} />
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </IntlProvider>
    );
};

type ProceedingRowProps = {
    proceeding: Proceeding;
};

export const ProceedingRow = (props: ProceedingRowProps) => {
    const country = useAppStore((state) => state.country);
    const savedLocale = useAppStore((state) => state.savedLocale);
    const removeMessage = useProceedingsStore((state) => state.removeMessage);
    const removeProceeding = useProceedingsStore((state) => state.removeProceeding);

    const original_request = getGeneratedMessage(props.proceeding, 'request');

    const newMessageTemplate = useMemo<Omit<Message, 'id'>>(
        () => ({
            transport_medium: 'email',
            date: new Date(),
            reference: props.proceeding.reference,
            sentByMe: !getNewestMessage(props.proceeding)?.sentByMe,
            correspondent_address: original_request?.correspondent_address || '',
            correspondent_email: original_request?.correspondent_email || '',
            type: 'response',
            subject: '',
            content: '',
        }),
        [props.proceeding, original_request]
    );

    const ImportModalContent = () => {
        const [newMessage, setNewMessage] = useState<Omit<Message, 'id'>>(newMessageTemplate);
        const addMessage = useProceedingsStore((state) => state.addMessage);

        return (
            <>
                <p>
                    <Text id="import-message-modal-explanation" />
                </p>
                <MessageMetadataInput
                    message={newMessage}
                    onChange={(message) => setNewMessage(message)}
                    includeContent={true}
                />
                <button
                    className="button button-secondary"
                    style="margin-top: 10px;"
                    onClick={() => {
                        if (
                            JSON.stringify(newMessage) === JSON.stringify(newMessageTemplate) ||
                            confirm(t('confirm-cancel-add-message', 'my-requests'))
                        ) {
                            setNewMessage(newMessageTemplate);
                            dismissImportMessageModal();
                        }
                    }}>
                    <Text id="cancel" />
                </button>
                <button
                    className="button button-primary"
                    style="margin-left: 5px; margin-top: 10px;"
                    onClick={() => {
                        addMessage(newMessage);
                        setNewMessage(newMessageTemplate);
                        dismissImportMessageModal();
                    }}>
                    <Text id="add-message" />
                </button>
            </>
        );
    };

    const [ImportMessageModal, showImportMessageModal, dismissImportMessageModal] = useModal(<ImportModalContent />, {
        defaultButton: 'positive',
        backdropDismisses: false,
        escDismisses: false,
        hasDismissButton: false,
    });

    const locale_country = country.toUpperCase();
    const date_locale = locale_country === 'ALL' ? savedLocale : `${savedLocale}-${locale_country}`;

    return (
        <>
            <ImportMessageModal />
            <details className="proceeding-row">
                <summary>
                    <h1 id={`proceeding-row-heading-${props.proceeding.reference}`}>
                        {original_request && (
                            <span
                                className={`icon-${original_request.type}`}
                                title={t(original_request.type as RequestType, 'my-requests')}
                                style="float: right;"
                            />
                        )}
                        {getNameFromMesssage(
                            original_request,
                            <em>
                                <Text id="no-company-name" />
                            </em>
                        )}
                    </h1>
                    <time
                        className={`proceeding-date${
                            props.proceeding.status === 'overdue' ? ' proceeding-date-overdue' : ''
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
                    {Object.values(props.proceeding.messages).map((msg, index) => (
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
                                <h2>
                                    <span
                                        className={`icon icon-${msg.sentByMe ? 'person' : 'factory'}`}
                                        title={t(`sent-by-${msg.sentByMe ? 'me' : 'someone-else'}`, 'my-requests')}
                                    />
                                    {msg.type === original_request?.type
                                        ? t('original-request', 'my-requests')
                                        : t(msg.type, 'my-requests')}
                                </h2>
                                {msg.subject && msg.content ? (
                                    <>
                                        <br />
                                        <button
                                            className="button button-unstyled icon icon-email"
                                            onClick={() => alert(msg.content)}>
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
                            {index === Object.keys(props.proceeding.messages).length - 1 && (
                                <a
                                    className="button button-small button-primary"
                                    style="word-wrap: unset;"
                                    // TODO: This is broken for the language versions that redirect their /generator to
                                    // something else.
                                    href={`${window.BASE_URL}generator#!reference=${props.proceeding.reference}`}>
                                    <Text id="message-react" />
                                </a>
                            )}
                            {msg != original_request && (
                                <button
                                    className="button button-secondary button-small icon-trash"
                                    title={t('delete-message', 'my-requests')}
                                    onClick={() =>
                                        confirm(t('delete-message-confirm', 'my-requests')) && removeMessage(msg.id)
                                    }
                                />
                            )}
                        </li>
                    ))}
                </ul>
                <div className="proceeding-actions">
                    <button
                        className="button button-small button-secondary icon icon-plus-circle"
                        onClick={showImportMessageModal}>
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
        </>
    );
};
