import type { ComponentChildren } from 'preact';
import { IntlProvider } from 'preact-i18n';
import { memo } from 'preact/compat';
import { useEffect } from 'preact/hooks';
import { useGeneratorStore, useGeneratorStoreApi } from '../store/generator';

type RequestGeneratorBuilderProps = {
    onInitialized?: () => void;
    children: ComponentChildren;
};

export const RequestGeneratorBuilder = memo((props: RequestGeneratorBuilderProps) => {
    const setCompanyBySlug = useGeneratorStore((state) => state.setCompanyBySlug);
    const refreshFillFields = useGeneratorStore((state) => state.refreshFillFields);
    const appendToBatchBySlug = useGeneratorStore((state) => state.appendToBatchBySlug);
    const advanceBatch = useGeneratorStore((state) => state.advanceBatch);
    const initiatePdfGeneration = useGeneratorStore((state) => state.initiatePdfGeneration);
    const renderLetter = useGeneratorStore((state) => state.renderLetter);
    const resetInitialConditions = useGeneratorStore((state) => state.resetInitialConditions);
    const transport_medium = useGeneratorStore((state) => state.request.transport_medium);

    // To transiently update the component. See: https://github.com/pmndrs/zustand#transient-updates-for-often-occuring-state-changes
    const generatorStoreApi = useGeneratorStoreApi();

    useEffect(
        () =>
            generatorStoreApi.subscribe((state, prev) => {
                if (state.request !== prev.request) renderLetter();
            }),
        [renderLetter, generatorStoreApi]
    );

    useEffect(() => {
        if (transport_medium !== 'email') {
            const callbacks = initiatePdfGeneration();
            renderLetter();
            return callbacks;
        }
    }, [initiatePdfGeneration, transport_medium, renderLetter]);

    const { onInitialized } = props;

    useEffect(() => {
        resetInitialConditions().then(() => {
            // If specified in the URL, load a single company…
            if (window.PARAMETERS['company']) setCompanyBySlug(window.PARAMETERS['company']);
            else {
                // …or multiple ones.
                const batch_companies = window.PARAMETERS['companies'];
                if (batch_companies) {
                    const batch = batch_companies.split(',').map((slug) => slug.trim());

                    // We are in batch mode, move to the next company.
                    // Note: Previously, we checked for `this.state.batch` here. This is wrong however: The `generator.js`
                    // may have already called `setBatch()` and thus set `this.state.batch` *and* shifted it.
                    // Re-calling this code (due to the async nature of the `then` block, it may well run later) would
                    // result in skipping the first company (see #253). Instead, we only want to prepare batch mode here if
                    // it was enabled through the URL (i.e. `batch_companies` is set).
                    if (batch.length > 0) appendToBatchBySlug(batch).then(() => advanceBatch());
                }
            }

            renderLetter();
            onInitialized?.();
            refreshFillFields();
        });
    }, [
        onInitialized,
        refreshFillFields,
        renderLetter,
        appendToBatchBySlug,
        advanceBatch,
        resetInitialConditions,
        setCompanyBySlug,
    ]);

    return (
        <IntlProvider scope="generator" definition={window.I18N_DEFINITION}>
            <>{props.children}</>
        </IntlProvider>
    );
});
