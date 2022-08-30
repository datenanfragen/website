import {
    t_a,
    mail2pdf,
    BlobStorage,
    RequestList,
    useModal,
    useProceedingsStore,
    flash,
    FlashMessage,
} from '../../index';
import { IntlProvider, Text } from 'preact-i18n';
import { useCallback, useEffect, useMemo, useState } from 'preact/hooks';
import { slugify } from '../../../../src/Utility/common';

type ProceedingsListProps<PageId extends string> = {
    setPage: (newPage: PageId) => void;
    userEmailRegex: string;
};
export const ProceedingsList = <PageId extends string>(props: ProceedingsListProps<PageId>) => {
    const blobStorage = useMemo(() => new BlobStorage(), []);
    const getBlobFromStorage = useCallback(
        (blobId: string) => blobStorage.getBlob('proceeding-files', blobId),
        [blobStorage]
    );

    const ImapImportModalContent = () => {
        const [emailFolderList, setEmailFolderList] = useState<string[]>([]);
        const [emailFolder, setEmailFolder] = useState<string>('');
        const [progress, setProgress] = useState<{ current: number; max: number }>();
        const addMessage = useProceedingsStore((state) => state.addMessage);
        const mapEmailToProceeding = useProceedingsStore((state) => state.mapEmailToProceeding);

        useEffect(
            () =>
                void window.email
                    .getFolders()
                    .then((folders) => setEmailFolderList(folders))
                    .catch(() =>
                        flash(<FlashMessage type="error">{t_a('imap-folder-load-error', 'proceedings')}</FlashMessage>)
                    ),
            []
        );

        const importEmails = () => {
            window.email
                .getMessages({ folder: emailFolder })
                .then(async (emails) => {
                    if (emails.length === 0) return;
                    setProgress({ current: 0, max: emails.length });
                    const sortedEmails = emails.sort((emailA, emailB) =>
                        emailA.envelope.date === emailB.envelope.date
                            ? 0
                            : emailA.envelope.date === undefined
                            ? -1
                            : emailB.envelope.date === undefined
                            ? 1
                            : emailA.envelope.date > emailB.envelope.date
                            ? 1
                            : -1
                    );

                    for (const [i, email] of sortedEmails.entries()) {
                        const reference = mapEmailToProceeding(email);
                        if (reference) {
                            const blobStorageId = await window.email
                                .downloadMessage(emailFolder, email.seq)
                                .then((mailStream) => mail2pdf(mailStream))
                                .then((pdfMail) => {
                                    const uuid = crypto.randomUUID();
                                    return blobStorage.setBlob('proceeding-files', uuid, pdfMail);
                                })
                                .catch(() =>
                                    flash(
                                        <FlashMessage type="error">
                                            {t_a('imap-message-download-error', 'proceedings')}
                                        </FlashMessage>
                                    )
                                );

                            const sentByMe =
                                email.envelope.from?.some((address) =>
                                    address.address?.match(new RegExp(props.userEmailRegex))
                                ) || false;
                            addMessage({
                                reference,
                                date: email.envelope.date || new Date(),
                                type: 'response',
                                correspondent_address: sentByMe
                                    ? email.envelope.to?.map((a) => a.name).join(', ') || ''
                                    : email.envelope.from?.map((a) => a.name).join(', ') || '',
                                correspondent_email: sentByMe
                                    ? email.envelope.to?.map((a) => a.address).join(', ') || ''
                                    : email.envelope.from?.map((a) => a.address).join(', ') || '',
                                transport_medium: 'email',
                                subject: email.envelope.subject,
                                sentByMe,
                                content: blobStorageId
                                    ? {
                                          blobId: blobStorageId,
                                          filename: `${reference}-${slugify(
                                              email.envelope.subject || 'no-subject'
                                          )}-${blobStorageId}.pdf`,
                                      }
                                    : undefined,
                                extra: {
                                    emailId: email.envelope.messageId,
                                },
                            });
                        }
                        setProgress({ current: i + 1, max: emails.length });
                    }

                    setProgress(undefined);
                })
                .then(() =>
                    flash(
                        <FlashMessage type="success">
                            {t_a('imap-import-success', 'proceedings', { folder: emailFolder })}
                        </FlashMessage>
                    )
                )
                .catch(() => {
                    flash(<FlashMessage type="error">{t_a('imap-message-list-error', 'proceedings')}</FlashMessage>);
                });
        };

        return (
            <div className="imap-import-modal">
                <p>
                    <Text id="imap-import-explanation" />
                </p>
                <div className="form-group">
                    <label htmlFor="imap-import-folder">
                        <Text id="imap-import-folder" />
                    </label>
                    <div className="select-container">
                        <select
                            value={emailFolder}
                            onChange={(e) => {
                                setEmailFolder(e.currentTarget.value);
                            }}
                            disabled={emailFolderList.length === 0}>
                            {emailFolderList.length > 0 ? (
                                emailFolderList.map((s) => <option value={s}>{s}</option>)
                            ) : (
                                <select value="" selected={true}>
                                    <Text id="imap-folders-loading" />
                                </select>
                            )}
                        </select>
                        <div className="icon icon-arrow-down" />
                    </div>
                </div>

                <button className="button button-secondary" onClick={importEmails}>
                    <Text id="imap-import-confirm" />
                </button>
                {progress !== undefined && (
                    <progress min={0} max={progress.max} value={progress.current} className="imap-import-progress">
                        <Text id="imap-import-progress" fields={progress} />
                    </progress>
                )}
            </div>
        );
    };

    const [ImapImportModal, showImapImportModal] = useModal(<ImapImportModalContent />, {
        defaultButton: 'positive',
        backdropDismisses: true,
        escDismisses: true,
        hasDismissButton: true,
    });

    return (
        <IntlProvider definition={window.I18N_DEFINITION_APP} scope="proceedings">
            <header>
                <h1>
                    <Text id="title" />
                </h1>
            </header>

            <ImapImportModal />

            <RequestList
                importEmailsButton={
                    <button className="button button-secondary" onClick={showImapImportModal}>
                        {t_a('import-via-imap', 'proceedings')}
                    </button>
                }
                getBlobFromStorage={getBlobFromStorage}
                emptyComponent={
                    <div className="box box-info" style="width: 80%; margin: auto;">
                        <h2>
                            <Text id="no-requests-heading" />
                        </h2>
                        <Text id="no-requests" />
                        <br />

                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                        <a
                            className="button button-primary"
                            href=""
                            style="float: right;"
                            onClick={(e) => {
                                e.preventDefault();
                                props.setPage('newRequests' as PageId);
                            }}>
                            <Text id="generate-request" />
                        </a>
                        <div className="clearfix" />
                    </div>
                }
            />
        </IntlProvider>
    );
};
