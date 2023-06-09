import { useCallback, useEffect } from 'preact/hooks';
import { Text, IntlProvider } from 'preact-i18n';
import { useGeneratorStore } from '../../store/generator';
import { useModal } from '../Modal';
import { SetPageFunction } from './App';
import { ActionButton, ActionButtonProps } from '../Generator/ActionButton';
import { MailtoDropdownProps, mailto_handlers } from '../MailtoDropdown';
import t from '../../Utility/i18n';
import { useProceedingsStore } from '../../store/proceedings';
import { useInputSelectAll } from '../../hooks/useInputSelectAll';

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
    const currentCompany = useGeneratorStore((state) => state.current_company);
    const [getRequestForSaving, setSent] = useGeneratorStore((state) => [state.getRequestForSaving, state.setSent]);
    const addRequest = useProceedingsStore((state) => state.addRequest);

    const finishRequest = useCallback(() => {
        addRequest(getRequestForSaving());
        setSent(true);
    }, [addRequest, setSent, getRequestForSaving]);

    useEffect(() => {
        if (request.transport_medium !== 'email') return initiatePdfGeneration();
    }, [initiatePdfGeneration, request]);

    const [onModalInputClick, unsetModalPreviousActiveElement] = useInputSelectAll();
    const [Modal, showModal, dismissModal] = useModal(
        <IntlProvider scope="generator" definition={window.I18N_DEFINITION}>
            <Text
                id={
                    request.transport_medium === 'email'
                        ? 'send-request-email-explanation'
                        : request.transport_medium === 'webform'
                        ? 'send-request-webform-explanation'
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

                {request.transport_medium !== 'webform' && (
                    <>
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
                    </>
                )}

                <strong>
                    <label htmlFor="send-request-modal-body">{t('body', 'generator')}</label>
                </strong>
                <textarea
                    id="send-request-modal-body"
                    className="form-element"
                    rows={10}
                    onClick={onModalInputClick}
                    onCopy={finishRequest}
                    readOnly>
                    {['email', 'webform'].includes(request.transport_medium)
                        ? letter().toEmailString()
                        : letter().toString()}
                </textarea>
            </div>
        </IntlProvider>,
        {
            positiveButton: <NextRequestButton setPage={props.setPage} afterNext={() => dismissModal()} />,
            negativeButton: (
                <>
                    {request.transport_medium === 'webform' ? (
                        <a
                            className={`button ${request.sent ? 'button-secondary' : 'button-primary'}`}
                            target="_blank"
                            rel="noreferrer"
                            onClick={() => finishRequest()}
                            href={currentCompany?.webform}>
                            <Text id="open-webform" />
                        </a>
                    ) : (
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
                    )}
                </>
            ),
            onDismiss: unsetModalPreviousActiveElement,
            backdropDismisses: false,
        }
    );

    return (
        <IntlProvider scope="generator" definition={window.I18N_DEFINITION}>
            <button
                className={`button ${request.sent ? 'button-secondary' : 'button-primary'}`}
                style="order: 1;"
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

type NextRequestButtonProps = {
    setPage: SetPageFunction;
    afterNext?: () => void;
};

export const NextRequestButton = (props: NextRequestButtonProps) => {
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

    return (
        <button
            className={`button ${request.sent ? 'button-primary' : 'button-secondary'}`}
            onClick={() => {
                if (request.sent) markCurrentBatchCompanyDone();
                else removeFromBatch(current_company!.slug);
                resetRequestToDefault({ advanceBatch: true });

                if (remainingBatchEntriesCount === 1) props.setPage('whats_next');
                props.afterNext?.();
            }}
            style="float: right;">
            <Text
                id={request.sent ? (remainingBatchEntriesCount > 1 ? 'next-request' : 'next-step') : 'skip-request'}
            />
        </button>
    );
};
