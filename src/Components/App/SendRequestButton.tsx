import { useCallback, useRef, useEffect } from 'preact/hooks';
import { Text, IntlProvider } from 'preact-i18n';
import { useGeneratorStore } from '../../store/generator';
import { useModal } from '../Modal';
import { SetPageFunction } from './App';
import { ActionButton, ActionButtonProps } from '../Generator/ActionButton';
import { MailtoDropdownProps, mailto_handlers } from '../MailtoDropdown';
import t from '../../Utility/i18n';
import { JSX } from 'preact';

type SendRequestButtonProps = {
    setPage: SetPageFunction;
    mailtoDropdownOptions?: Partial<MailtoDropdownProps>;
    actionButtonOptions?: Partial<ActionButtonProps>;
};

export const SendRequestButton = (props: SendRequestButtonProps) => {
    const initiatePdfGeneration = useGeneratorStore((state) => state.initiatePdfGeneration);
    const renderLetter = useGeneratorStore((state) => state.renderLetter);
    const letter = useGeneratorStore((state) => state.letter);
    const request = useGeneratorStore((state) => state.request);
    const [batch, current_company, resetRequestToDefault, markCurrentBatchCompanyDone, removeFromBatch] =
        useGeneratorStore((state) => [
            state.batch,
            state.current_company,
            state.resetRequestToDefault,
            state.markCurrentBatchCompanyDone,
            state.removeFromBatch,
        ]);
    const remainingBatchEntriesCount = Object.values(batch || {}).filter((e) => !e.done).length || 0;

    useEffect(() => {
        if (request.transport_medium !== 'email') return initiatePdfGeneration();
    }, [initiatePdfGeneration, request]);

    const previousActiveElementId = useRef<string>();

    const onModalInputClick = useCallback(
        (e: JSX.TargetedMouseEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            if (previousActiveElementId.current === e.currentTarget.id) return;

            e.currentTarget.select();
            e.currentTarget.focus();
            previousActiveElementId.current = e.currentTarget.id;
        },
        [previousActiveElementId]
    );
    const [Modal, showModal, dismissModal] = useModal(
        <IntlProvider scope="generator" definition={window.I18N_DEFINITION}>
            <Text
                id={
                    request.transport_medium === 'email'
                        ? 'send-request-email-explanation'
                        : 'send-request-pdf-explanation'
                }
            />

            <div className="form-group">
                <strong>
                    <label htmlFor="send-request-modal-subject">{t('subject', 'generator')}</label>
                </strong>
                <input
                    type="text"
                    id="send-request-modal-subject"
                    className="form-element"
                    value={letter().props.subject}
                    onClick={onModalInputClick}
                    readOnly
                />
                <strong>
                    <label htmlFor="send-request-modal-recipient">{t('recipient', 'generator')}</label>
                </strong>
                {request.transport_medium === 'email' ? (
                    <input
                        type="text"
                        id="send-request-modal-recipient"
                        className="form-element"
                        value={
                            request.transport_medium === 'email'
                                ? request.email
                                : request.recipient_address.split('\n')[0]
                        }
                        onClick={onModalInputClick}
                        readOnly
                    />
                ) : (
                    <textarea
                        id="send-request-modal-recipient"
                        className="form-element"
                        rows={4}
                        onClick={onModalInputClick}
                        readOnly>
                        {request.recipient_address}
                    </textarea>
                )}

                <strong>
                    <label htmlFor="send-request-modal-body">{t('body', 'generator')}</label>
                </strong>
                <textarea
                    id="send-request-modal-body"
                    className="form-element"
                    rows={10}
                    onClick={onModalInputClick}
                    readOnly>
                    {/* TODO: For PDFs, this renders the barcode as `[object Object]`. *sigh* */}
                    {request.transport_medium === 'email' ? letter().toEmailString() : letter().toString()}
                </textarea>
            </div>
        </IntlProvider>,
        {
            positiveButton: (
                <button
                    className={`button ${request.sent ? 'button-primary' : 'button-secondary'}`}
                    onClick={() => {
                        if (request.sent) markCurrentBatchCompanyDone();
                        else removeFromBatch(current_company!.slug);
                        resetRequestToDefault({ advanceBatch: true });

                        if (remainingBatchEntriesCount === 1) props.setPage('whats_next');
                        dismissModal();
                    }}
                    style="float: right">
                    <Text id={request.sent ? 'next-request' : 'skip-request'} />
                </button>
            ),
            negativeButton: (
                <ActionButton
                    dropup={true}
                    mailtoDropdownProps={
                        props.mailtoDropdownOptions || {
                            handlers: (Object.keys(mailto_handlers) as (keyof typeof mailto_handlers)[]).filter(
                                (h) => h !== 'copymanually'
                            ),
                        }
                    }
                    {...props.actionButtonOptions}
                />
            ),
            onDismiss: () => {
                previousActiveElementId.current = undefined;
            },
            backdropDismisses: false,
        }
    );

    return (
        <IntlProvider scope="generator" definition={window.I18N_DEFINITION}>
            <button
                className={`button ${request.sent ? 'button-secondary' : 'button-primary'}`}
                onClick={() => {
                    renderLetter();
                    showModal();
                }}>
                <Text id={request.sent ? 'send-request-again' : 'send-request'} />
                &nbsp;&nbsp;
                {/* TODO: PDF icon */}
                <span className={`icon ${request.sent ? 'icon-paper-plane' : 'icon-email'}`} />
            </button>

            <Modal />
        </IntlProvider>
    );
};
