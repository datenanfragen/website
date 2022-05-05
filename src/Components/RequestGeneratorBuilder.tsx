import type { ComponentChildren } from 'preact';
import { IntlProvider, MarkupText, Text } from 'preact-i18n';
import t, { t_r } from '../Utility/i18n';
import { REQUEST_ARTICLES, fetchTemplate } from '../Utility/requests';
import Privacy, { PRIVACY_ACTIONS } from '../Utility/Privacy';
import DeprecatedModal from './DeprecatedModal';
import { SvaFinder } from './SvaFinder';
import { Template } from 'letter-generator';
import { UserRequests } from '../DataType/UserRequests';
import { ActionButton } from './Generator/ActionButton';
import { useEffect, useMemo } from 'preact/hooks';
// This will be replaced with an URL by the worker-loader plugin in webpack which is why eslint can't fin a defautl import (ts can be tricked by defining a module).
// eslint-disable-next-line import/default
import PdfWorker from '../Utility/pdf.worker.ts';
import { rethrow } from '../Utility/errors';
import { RequestGeneratorProvider, useGeneratorStore, createGeneratorStore } from '../store/generator';
import { CustomTemplateName, CUSTOM_TEMPLATE_OPTIONS, Request } from 'request';
import { clearUrlParameters } from '../Utility/browser';
import { useModal } from './Modal';

type RequestGeneratorBuilderProps = {
    newRequestHook: () => void;
    onInitialized?: () => void;
    children: ComponentChildren;
};

export const RequestGeneratorBuilder = (props: RequestGeneratorBuilderProps) => (
    <RequestGeneratorProvider createStore={createGeneratorStore}>
        <WrappedRequestGeneratorBuilder newRequestHook={props.newRequestHook} onInitialized={props.onInitialized}>
            {props.children}
        </WrappedRequestGeneratorBuilder>
    </RequestGeneratorProvider>
);

const WrappedRequestGeneratorBuilder = (props: RequestGeneratorBuilderProps) => {
    const setDownload = useGeneratorStore((state) => state.setDownload);
    const transport_medium = useGeneratorStore((state) => state.request.transport_medium);
    const getLetter = useGeneratorStore((state) => state.letter);
    const getFilename = useGeneratorStore((state) => state.letter_filename);
    const setCompanyBySlug = useGeneratorStore((state) => state.setCompanyBySlug);
    const refreshFillFields = useGeneratorStore((state) => state.refreshFillFields);
    const startBatch = useGeneratorStore((state) => state.startBatch);
    const initializeFields = useGeneratorStore((state) => state.initializeFields);
    const setBusy = useGeneratorStore((state) => state.setBusy);
    const setReady = useGeneratorStore((state) => state.setReady);
    const setRequestType = useGeneratorStore((state) => state.setRequestType);
    const setCustomLetterTemplate = useGeneratorStore((state) => state.setCustomLetterTemplate);
    const refreshTemplate = useGeneratorStore((state) => state.refreshTemplate);
    const resetRequestToDefault = useGeneratorStore((state) => state.resetRequestToDefault);
    const setCompany = useGeneratorStore((state) => state.setCompany);
    const setSva = useGeneratorStore((state) => state.setSva);
    const removeCompany = useGeneratorStore((state) => state.removeCompany);
    const clearBatch = useGeneratorStore((state) => state.clearBatch);
    const advanceBatch = useGeneratorStore((state) => state.advanceBatch);
    const storeRequest = useGeneratorStore((state) => state.storeRequest);

    const pdfWorker = useMemo(() => new PdfWorker(), []);

    useEffect(() => {
        if (pdfWorker) {
            if ((window as typeof window & { hugoDevMode: boolean })?.hugoDevMode) {
                // copy the worker to window if we are in a dev env to enable easy testing
                (window as typeof window & { pdfWorker: PdfWorker }).pdfWorker = pdfWorker;
            }
            const onMessage = (message: MessageEvent<{ blob_url: string; filename: string }>) =>
                setDownload(true, message.data.blob_url, message.data.filename);
            const onError = (error: ErrorEvent) => rethrow(error, 'PdfWorker error');

            pdfWorker.addEventListener('message', onMessage);
            pdfWorker.addEventListener('error', onError);

            return () => {
                pdfWorker.removeEventListener('message', onMessage);
                pdfWorker.removeEventListener('error', onError);
            };
        }
    }, [pdfWorker]);

    const renderLetter = () => {
        const letter = getLetter();

        if (transport_medium === 'email') {
            setDownload(
                true,
                URL.createObjectURL(
                    new Blob([letter.toEmailString(true)], {
                        type: 'text/plain',
                    })
                )
            );
        } else {
            setDownload(false);
            pdfWorker.postMessage({
                pdfdoc: { doc: letter.toPdfDoc() },
                filename: getFilename(),
            });
        }
    };

    const resetInitialConditions = () => {
        setBusy();
        return initializeFields()
            .then(() => {
                const { response_to, response_type } = window.PARAMETERS;

                // This is a response to a previous request (warning or complaint).
                if (Privacy.isAllowed(PRIVACY_ACTIONS.SAVE_MY_REQUESTS) && response_to && response_type) {
                    // Just for the looks: Switch the view before fetching the template
                    setRequestType('custom');

                    return new UserRequests()
                        .getRequest(response_to)
                        .then((request) => {
                            if (request) {
                                return setCustomLetterTemplate(
                                    response_type in CUSTOM_TEMPLATE_OPTIONS
                                        ? (response_type as CustomTemplateName)
                                        : 'no-template',
                                    request
                                ).then(() => request);
                            }
                            throw new Error('No user request found');
                        })
                        .then((request) => {
                            if (response_type === 'admonition' && request?.slug) {
                                return setCompanyBySlug(request.slug);
                            }
                        })
                        .then(() => {
                            if (response_type === 'complaint') showAuthorityChooser();
                        })
                        .catch((e) => {
                            /* Fail silently when no user request was found */
                            if (e.message !== 'No user request found') rethrow(e);
                        });
                }

                // This is just a regular ol' request.
                return refreshTemplate();
            })
            .then(setReady);
    };

    useEffect(() => {
        resetInitialConditions().then(() => {
            if (
                !(
                    Privacy.isAllowed(PRIVACY_ACTIONS.SAVE_MY_REQUESTS) &&
                    window.PARAMETERS['response_to'] &&
                    window.PARAMETERS['response_type']
                )
            ) {
                // If specified in the URL, load a single company…
                if (window.PARAMETERS['company']) setCompanyBySlug(window.PARAMETERS['company']);
                else {
                    // …or multiple ones.
                    const batch_companies = window.PARAMETERS['companies'];
                    if (batch_companies) {
                        const batch = batch_companies.split(',');
                        // We are in batch mode, move to the next company.
                        // Note: Previously, we checked for `this.state.batch` here. This is wrong however: The `generator.js`
                        // may have already called `setBatch()` and thus set `this.state.batch` *and* shifted it.
                        // Re-calling this code (due to the async nature of the `then` block, it may well run later) would
                        // result in skipping the first company (see #253). Instead, we only want to prepare batch mode here if
                        // it was enabled through the URL (i.e. `batch_companies` is set).

                        if (batch.length > 0) {
                            startBatch(batch);
                        }
                    }
                }
            }

            renderLetter();
            props.onInitialized?.();
            refreshFillFields();
        });
    });

    const [AuthorityChooser, showAuthorityChooser, dismissAuthorityChooser] = useModal(
        <>
            <IntlProvider scope="generator" definition={window.I18N_DEFINITION}>
                <MarkupText id="modal-select-authority" />
            </IntlProvider>
            <SvaFinder
                callback={(sva) => {
                    if (sva) {
                        setBusy();
                        const response_to = window.PARAMETERS['response_to'];

                        setSva(sva)
                            .then(() => {
                                if (response_to) return new UserRequests().getRequest(response_to);
                            })
                            .then((user_request) => setCustomLetterTemplate('complaint', user_request ?? undefined))
                            .then(() => renderLetter)
                            .then(() => setReady);
                    }

                    dismissAuthorityChooser();
                }}
                style="margin-top: 15px;"
            />
        </>,
        {
            onNegativeFeedback: () => dismissAuthorityChooser(),
            defaultButton: 'positive',
            shownInitially: false,
            negativeText: t('cancel', 'generator'),
        }
    );

    const newRequest = () => {
        // Remove GET parameter-selected company from the URL after the request is finished.
        // Also remove warning and complaint GET parameters from the URL after the request is finished.
        if (window.PARAMETERS['company'] || window.PARAMETERS['response_type'] || window.PARAMETERS['response_to']) {
            clearUrlParameters();
        }

        if (props.newRequestHook) props.newRequestHook();

        resetRequestToDefault();
        removeCompany();
        setDownload(false);

        return resetInitialConditions();
    };

    const [ConfirmNewRequestModal, showConfirmNewRequestModal, dismissConfirmNewRequestModal] = useModal(
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
                                .then(() => advanceBatch())
                                .then(() => renderLetter())
                                .then(() => setReady());
                        }}
                    />
                </div>
            ),
            negativeText: t('new-request', 'generator'),
            onNegativeFeedback: () => {
                dismissConfirmNewRequestModal();
                setBusy();
                newRequest()
                    .then(() => advanceBatch())
                    .then(() => renderLetter())
                    .then(() => setReady());
            },
            defaultButton: 'positive',
            innerStyle: 'overflow: visible;',
        }
    );

    return (
        <IntlProvider scope="generator" definition={window.I18N_DEFINITION}>
            <AuthorityChooser />
            <ConfirmNewRequestModal />
            <>{props.children}</>
        </IntlProvider>
    );
};

/*
const handleAutocompleteSelected = (e, suggestion, dataset) => {
    if (this.state.suggestion) {
        this.setState({
            modal: (state) => (
                <DeprecatedModal
                    positiveText={t('new-request', 'generator')}
                    negativeText={t('override-request', 'generator')}
                    onNegativeFeedback={(e) => {
                        this.setState({ modal: null });
                        this.setCompany(suggestion.document);
                    }}
                    onPositiveFeedback={(e) => {
                        this.setState({ modal: null });
                        this.newRequest().then(() => {
                            this.setCompany(suggestion.document);
                        });
                    }}
                    positiveDefault={true}
                    onDismiss={() => this.setState({ modal: null })}>
                    {t('modal-autocomplete-new-request', 'generator')}
                </DeprecatedModal>
            ),
        });
    } else {
        this.setCompany(suggestion.document);
    }
};*/
