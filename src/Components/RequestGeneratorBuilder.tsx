import type { ComponentChildren } from 'preact';
import { IntlProvider, MarkupText } from 'preact-i18n';
import { memo } from 'preact/compat';
import t from '../Utility/i18n';
import { Privacy, PRIVACY_ACTIONS } from '../Utility/Privacy';
import { SvaFinder } from './SvaFinder';
import { UserRequests } from '../DataType/UserRequests';
import { useEffect } from 'preact/hooks';
import { useGeneratorStore, useGeneratorStoreApi } from '../store/generator';
import type { ResponseType } from 'request';
import { useModal } from './Modal';

type RequestGeneratorBuilderProps = {
    onInitialized?: () => void;
    children: ComponentChildren;
};

export const RequestGeneratorBuilder = memo((props: RequestGeneratorBuilderProps) => {
    const setCompanyBySlug = useGeneratorStore((state) => state.setCompanyBySlug);
    const refreshFillFields = useGeneratorStore((state) => state.refreshFillFields);
    const startBatch = useGeneratorStore((state) => state.startBatch);
    const setBusy = useGeneratorStore((state) => state.setBusy);
    const setReady = useGeneratorStore((state) => state.setReady);
    const setCustomLetterTemplate = useGeneratorStore((state) => state.setCustomLetterTemplate);
    const setSva = useGeneratorStore((state) => state.setSva);
    const initiatePdfGeneration = useGeneratorStore((state) => state.initiatePdfGeneration);
    const renderLetter = useGeneratorStore((state) => state.renderLetter);
    const resetInitialConditions = useGeneratorStore((state) => state.resetInitialConditions);

    // To transiently update the component. See: https://github.com/pmndrs/zustand#transient-updates-for-often-occuring-state-changes
    const generatorStoreApi = useGeneratorStoreApi();

    useEffect(() => {
        generatorStoreApi.subscribe((state, prev) => {
            if (state.request !== prev.request) {
                renderLetter();
            }
        });
        initiatePdfGeneration();
    }, [initiatePdfGeneration, renderLetter, generatorStoreApi]);

    useEffect(() => {
        const { response_to, response_type } = window.PARAMETERS;

        resetInitialConditions(response_to, response_type as ResponseType)
            .then(() => {
                if (response_type === 'complaint') showAuthorityChooser();
            })
            .then(() => {
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
    }, []);

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

    return (
        <IntlProvider scope="generator" definition={window.I18N_DEFINITION}>
            <AuthorityChooser />
            <>{props.children}</>
        </IntlProvider>
    );
});
