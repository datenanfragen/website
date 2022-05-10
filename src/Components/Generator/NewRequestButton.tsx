import { ActionButton } from '../Generator/ActionButton';
import { IntlProvider, Text } from 'preact-i18n';
import { useGeneratorStore } from '../../store/generator';
import { clearUrlParameters } from '../../Utility/browser';
import { useCallback, useState } from 'preact/hooks';
import { useModal } from '../Modal';
import t from '../../Utility/i18n';
import type { JSX } from 'preact';
import { Privacy, PRIVACY_ACTIONS } from '../../Utility/Privacy';
import { SavedCompanies } from '../../DataType/SavedCompanies';

type NewRequestButtonProps = {
    newRequestHook?: (arg?: unknown) => void;
    buttonProps?: Record<string | symbol, unknown>;
};

export const NewRequestButton = (props: NewRequestButtonProps) => {
    const request_sent = useGeneratorStore((state) => state.request.sent);
    const renderLetter = useGeneratorStore((state) => state.renderLetter);
    const hasBatch = useGeneratorStore((state) => state.hasBatch);
    const [ConfirmNewRequestModal, showConfirmNewRequestModal, , , newRequest] = useNewRequestModal(
        props.newRequestHook
    );

    return (
        <>
            <button
                className="button button-secondary"
                id="new-request-button"
                onClick={() => {
                    if (!request_sent) return showConfirmNewRequestModal();
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
    const resetInitialConditions = useGeneratorStore((state) => state.resetInitialConditions);
    const transport_medium = useGeneratorStore((state) => state.request.transport_medium);
    const setDownload = useGeneratorStore((state) => state.setDownload);
    const resetRequestToDefault = useGeneratorStore((state) => state.resetRequestToDefault);
    const removeCompany = useGeneratorStore((state) => state.removeCompany);
    const advanceBatch = useGeneratorStore((state) => state.advanceBatch);
    const storeRequest = useGeneratorStore((state) => state.storeRequest);
    const setBusy = useGeneratorStore((state) => state.setBusy);
    const request_type = useGeneratorStore((state) => state.request.type);
    const current_company = useGeneratorStore((state) => state.current_company);
    const renderLetter = useGeneratorStore((state) => state.renderLetter);

    const [payload, setPayload] = useState<Parameters<Exclude<typeof newRequestHook, undefined>>[0]>();

    const newRequest = useCallback(async () => {
        // Remove GET parameter-selected company from the URL after the request is finished.
        // Also remove warning and complaint GET parameters from the URL after the request is finished.
        if (window.PARAMETERS['company'] || window.PARAMETERS['response_type'] || window.PARAMETERS['response_to']) {
            clearUrlParameters();
        }

        if (
            request_type === 'access' &&
            Privacy.isAllowed(PRIVACY_ACTIONS.SAVE_WIZARD_ENTRIES) &&
            current_company?.slug
        )
            new SavedCompanies().remove(current_company.slug);

        resetRequestToDefault();
        setDownload(false);
        setBusy();
        removeCompany()
            .then(() => {
                return newRequestHook && newRequestHook(payload);
            })
            .then(() => advanceBatch())
            .then(() => resetInitialConditions());
    }, [
        newRequestHook,
        resetInitialConditions,
        resetRequestToDefault,
        setDownload,
        removeCompany,
        current_company,
        request_type,
        payload,
        advanceBatch,
        setBusy,
    ]);

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
                            storeRequest()
                                .then(() => setBusy())
                                .then(() => newRequest())
                                .then(() => renderLetter());
                        }}
                    />
                </div>
            ),
            negativeText: t('new-request', 'generator'),
            onNegativeFeedback: () => {
                dismissConfirmNewRequestModal();
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
