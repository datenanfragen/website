import { ActionButton } from '../Generator/ActionButton';
import { IntlProvider, Text } from 'preact-i18n';
import { useGeneratorStore } from '../../store/generator';
import { clearUrlParameters } from '../../Utility/browser';
import { useCallback, useState } from 'preact/hooks';
import { useModal } from '../Modal';
import t from '../../Utility/i18n';
import type { JSX } from 'preact';
import { useProceedingsStore } from '../../store/proceedings';

type NewRequestButtonProps = {
    newRequestHook?: (arg?: unknown) => void;
    buttonProps?: JSX.DOMAttributes<HTMLButtonElement>;
};

export const NewRequestButton = (props: NewRequestButtonProps) => {
    const request_sent = useGeneratorStore((state) => state.request.sent);
    const renderLetter = useGeneratorStore((state) => state.renderLetter);
    const hasBatch = useGeneratorStore((state) => state.hasBatch);
    const [ConfirmNewRequestModal, showConfirmNewRequestModal, , , newRequest] = useNewRequestModal(
        props.newRequestHook
    );
    const current_company = useGeneratorStore((state) => state.current_company);
    const removeFromBatch = useGeneratorStore((state) => state.removeFromBatch);

    return (
        <>
            <button
                className="button button-secondary"
                id="new-request-button"
                onClick={() => {
                    if (!request_sent) return showConfirmNewRequestModal();
                    if (current_company) removeFromBatch(current_company.slug);
                    newRequest().then(renderLetter);
                }}
                {...props.buttonProps}>
                <Text id={hasBatch() ? 'next-request' : 'new-request'} />
            </button>
            <ConfirmNewRequestModal />
        </>
    );
};

export const useNewRequestModal = (
    newRequestHook?: (arg?: unknown) => void | Promise<void>
): [
    () => JSX.Element,
    (payload?: Parameters<Exclude<typeof newRequestHook, undefined>>[0]) => void,
    () => void,
    boolean,
    () => Promise<void>
] => {
    const transport_medium = useGeneratorStore((state) => state.request.transport_medium);
    const resetRequestToDefault = useGeneratorStore((state) => state.resetRequestToDefault);
    const setBusy = useGeneratorStore((state) => state.setBusy);
    const current_company = useGeneratorStore((state) => state.current_company);
    const renderLetter = useGeneratorStore((state) => state.renderLetter);
    const getRequestForSaving = useGeneratorStore((state) => state.getRequestForSaving);
    const removeFromBatch = useGeneratorStore((state) => state.removeFromBatch);

    const addRequest = useProceedingsStore((state) => state.addRequest);

    const [payload, setPayload] = useState<Parameters<Exclude<typeof newRequestHook, undefined>>[0]>();

    const newRequest = useCallback(async () => {
        // Remove GET parameter-selected company from the URL after the request is finished.
        if (window.PARAMETERS['company'] || window.PARAMETERS['companies']) clearUrlParameters();

        resetRequestToDefault({ advanceBatch: true, beforeAdvanceBatchHook: () => newRequestHook?.(payload) });
    }, [newRequestHook, resetRequestToDefault, payload]);

    const [ConfirmNewRequestModal, showModal, dismissConfirmNewRequestModal, shown] = useModal(
        <IntlProvider scope="generator" definition={window.I18N_DEFINITION}>
            <Text id="modal-new-request" />
        </IntlProvider>,
        {
            positiveButton: (
                <div style="float: right;">
                    <ActionButton
                        buttonText={
                            <IntlProvider scope="generator" definition={window.I18N_DEFINITION}>
                                <Text id={transport_medium === 'email' ? 'send-email-first' : 'download-pdf-first'} />
                            </IntlProvider>
                        }
                        onSuccess={() => {
                            dismissConfirmNewRequestModal();
                            addRequest(getRequestForSaving());
                            if (current_company) removeFromBatch(current_company.slug);
                            setBusy();
                            newRequest().then(() => renderLetter());
                        }}
                    />
                </div>
            ),
            negativeText: t('new-request', 'generator'),
            onNegativeFeedback: () => {
                dismissConfirmNewRequestModal();
                if (current_company) removeFromBatch(current_company.slug);
                setBusy();
                newRequest().then(() => renderLetter());
            },
            defaultButton: 'positive',
            innerStyle: 'overflow: visible;',
        }
    );

    const showConfirmNewRequestModal = useCallback(
        (payload?: Parameters<Exclude<typeof newRequestHook, undefined>>[0]) => {
            setPayload(payload);
            showModal();
        },
        [setPayload, showModal]
    );

    return [ConfirmNewRequestModal, showConfirmNewRequestModal, dismissConfirmNewRequestModal, shown, newRequest];
};
