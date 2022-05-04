import type { ComponentChildren } from 'preact';
import { IntlProvider, MarkupText } from 'preact-i18n';
import t, { t_r } from '../Utility/i18n';
import { REQUEST_ARTICLES, fetchTemplate } from '../Utility/requests';
import { PARAMETERS } from '../Utility/common';
import Privacy, { PRIVACY_ACTIONS } from '../Utility/Privacy';
import Modal from './Modal';
import SvaFinder from './SvaFinder';
import { Template } from 'letter-generator';
import UserRequests from '../my-requests';
import { ActionButton } from './Generator/ActionButton';
import { useEffect, useMemo } from 'preact/hooks';
// This will be replaced with an URL by the worker-loader plugin in webpack which is why eslint can't fin a defautl import (ts can be tricked by defining a module).
// eslint-disable-next-line import/default
import PdfWorker from '../Utility/pdf.worker.ts';
import { rethrow } from '../Utility/errors';
import { useGeneratorStore } from '../store/generator';
import { CUSTOM_TEMPLATE_OPTIONS, Request } from 'request';
import { clearUrlParameters } from '../Utility/browser';

type RequestGeneratorBuilderProps = {
    newRequestHook: () => void;
    onInitialized?: () => void;
    children: ComponentChildren;
};

export const RequestGeneratorBuilder = (props: RequestGeneratorBuilderProps) => {
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
    const removeCompany = useGeneratorStore((state) => state.removeCompany);
    const clearBatch = useGeneratorStore((state) => state.clearBatch);
    const storeRequest = useGeneratorStore((state) => state.storeRequest);

    const pdfWorker = useMemo(() => new PdfWorker(), []);

    useEffect(() => {
        if (pdfWorker) {
            if (window.hugoDevMode) {
                // copy the worker to window if we are in a dev env to enable easy testing
                (window as typeof window & { pdfWorker: PdfWorker }).pdfWorker = pdfWorker;
            }
            const onMessage = (message: MessageEvent<any>) =>
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
                const { response_to, response_type } = PARAMETERS;

                // This is a response to a previous request (warning or complaint).
                if (Privacy.isAllowed(PRIVACY_ACTIONS.SAVE_MY_REQUESTS) && response_to && response_type) {
                    // Just for the looks: Switch the view before fetching the template
                    setRequestType('custom');

                    return (new UserRequests().getRequest(response_to) as Promise<Request>)
                        .then((request) =>
                            setCustomLetterTemplate(
                                response_type in CUSTOM_TEMPLATE_OPTIONS ? response_type : 'no-template',
                                request
                            ).then(() => request)
                        )
                        .then((request) => {
                            if (response_type === 'admonition' && request?.slug) {
                                return setCompanyBySlug(request.slug);
                            }
                        })
                        .then(() => {
                            if (response_type === 'complaint') showAuthorityChooser();
                        });
                }
                // This is just a regular ol' request.
                else {
                    return refreshTemplate();
                }
            })
            .then(setReady);
    };

    useEffect(() => {
        resetInitialConditions().then(() => {
            if (
                !(
                    Privacy.isAllowed(PRIVACY_ACTIONS.SAVE_MY_REQUESTS) &&
                    PARAMETERS['response_to'] &&
                    PARAMETERS['response_type']
                )
            ) {
                // If specified in the URL, load a single company…
                if (PARAMETERS['company']) setCompanyBySlug(PARAMETERS['company']);
                else {
                    // …or multiple ones.
                    const batch_companies = PARAMETERS['companies'];
                    if (batch_companies) {
                        let batch = batch_companies.split(',');
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
    }, []);

    const showAuthorityChooser = () => {
        this.setState({
            modal: (state) => (
                <Modal
                    negativeText={t('cancel', 'generator')}
                    onNegativeFeedback={() => this.setState({ modal: null })}
                    positiveDefault={true}
                    onDismiss={() => this.setState({ modal: null })}>
                    <IntlProvider scope="generator" definition={I18N_DEFINITION}>
                        <MarkupText id="modal-select-authority" />
                    </IntlProvider>
                    <SvaFinder
                        callback={(sva) => {
                            this.setCompany(sva);
                            this.setState({ ready: false }, () => {
                                fetchTemplate(sva['complaint-language'], 'complaint', null, '').then((text) => {
                                    this.changeRequest((request) => {
                                        request.custom_data.content = new Template(text, [], {
                                            request_article: REQUEST_ARTICLES[state.response_request.type],
                                            request_date: state.response_request.date,
                                            request_recipient_address: state.response_request.recipient,
                                        }).getText();
                                    });
                                    this.setState({ ready: !!text });
                                });
                            });
                            this.setState({ modal: null });
                        }}
                        style="margin-top: 15px;"
                    />
                </Modal>
            ),
        });
    };

    const newRequest = () => {
        // Remove GET parameter-selected company from the URL after the request is finished.
        // Also remove warning and complaint GET parameters from the URL after the request is finished.
        if (PARAMETERS['company'] || PARAMETERS['response_type'] || PARAMETERS['response_to']) {
            clearUrlParameters();
        }

        if (props.newRequestHook) props.newRequestHook();

        resetRequestToDefault();
        removeCompany();
        setDownload(false);

        return resetInitialConditions();
    };

    const confirmNewRequest = () => {
        const confirmNewRequestModal = (state) => (
            <Modal
                positiveButton={
                    <div style="float: right;">
                        <ActionButton
                            transport_medium={state.request.transport_medium}
                            blob_url={state.blob_url}
                            email={state.request.email}
                            letter={state.letter}
                            download_filename={state.download_filename}
                            download_active={state.download_active}
                            done={state.request.done}
                            ready={state.ready}
                            buttonText={t(
                                state.request.transport_medium === 'email' ? 'send-email-first' : 'download-pdf-first',
                                'generator'
                            )}
                            createModal={(modal) => new Promise((resolve) => this.setState({ modal }, resolve))}
                            onSuccess={() => {
                                if (this.state.modal === confirmNewRequestModal) this.setState({ modal: null });
                                storeRequest();
                                newRequest().then(() => {
                                    // We are in batch mode, move to the next company.
                                    if (this.state.batch?.length > 0) {
                                        this.setCompanyBySlug(this.state.batch.shift());
                                    } else this.renderLetter();
                                });
                            }}
                        />
                    </div>
                }
                negativeText={t('new-request', 'generator')}
                onNegativeFeedback={(e) => {
                    this.setState({ modal: null });
                    this.newRequest().then(() => {
                        // We are in batch mode, move to the next company.
                        if (this.state.batch?.length > 0) {
                            this.setCompanyBySlug(this.state.batch.shift());
                        } else this.renderLetter();
                    });
                }}
                positiveDefault={true}
                innerStyle="overflow: visible;"
                onDismiss={() => this.setState({ modal: null })}>
                {t('modal-new-request', 'generator')}
            </Modal>
        );
        this.setState({
            modal: confirmNewRequestModal,
        });
    };

    return (
        <IntlProvider scope="generator" definition={window.I18N_DEFINITION}>
            <>{props.children}</>
        </IntlProvider>
    );
};

const handleAutocompleteSelected = (e, suggestion, dataset) => {
    if (this.state.suggestion) {
        this.setState({
            modal: (state) => (
                <Modal
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
                </Modal>
            ),
        });
    } else {
        this.setCompany(suggestion.document);
    }
};
