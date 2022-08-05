import { useCallback, useMemo, useEffect } from 'preact/hooks';
import { IntlProvider, Text, MarkupText } from 'preact-i18n';
import t from '../../Utility/i18n';
import { Radio } from '../Radio';
import { SvaFinder } from '../SvaFinder';
import { mailto_handlers } from '../MailtoDropdown';
import { DynamicInputContainer, StatefulDynamicInputContainer } from '../Generator/DynamicInputContainer';
import { StatefulSignatureInput } from '../Generator/SignatureInput';
import { ActionButton } from '../Generator/ActionButton';
import { useReactorStore } from '../../store/reactor';
import { getGeneratedMessage, useProceedingsStore } from '../../store/proceedings';
import { useGeneratorStore, createGeneratorStore, RequestGeneratorProvider } from '../../store/generator';
import { useWizard, WizardPages } from '../../hooks/useWizard';
import { reactorModules } from './modules/index';
import type { ReactorHook, ReactorModuleWithDataId, StateCallback } from '../../types/reactor.d';
import type { CustomRequest } from '../../types/request';
import { ErrorException } from '../../Utility/errors';

type ReactorProps = { reference: string };

const _Reactor = ({ reference }: ReactorProps) => {
    const reactorState = useReactorStore();
    const proceedingsState = useProceedingsStore();
    const [fillFields, fillSignature, request] = useGeneratorStore((state) => [
        state.fillFields,
        state.fillSignature,
        state.request as CustomRequest,
    ]);
    const [addField, setField, removeField] = useGeneratorStore((state) => [
        state.addField,
        state.setField,
        state.removeField,
    ]);
    const [
        resetRequestToDefault,
        setCustomLetterProperty,
        setSva,
        setCompanyBySlug,
        setTransportMedium,
        setRecipientAddress,
        setRecipientEmail,
        renderLetter,
        setSent,
        initiatePdfGeneration,
    ] = useGeneratorStore((state) => [
        state.resetRequestToDefault,
        state.setCustomLetterProperty,
        state.setSva,
        state.setCompanyBySlug,
        state.setTransportMedium,
        state.setRecipientAddress,
        state.setRecipientEmail,
        state.renderLetter,
        state.setSent,
        state.initiatePdfGeneration,
    ]);

    useEffect(() => {
        resetRequestToDefault({ advanceBatch: false, type: 'custom', reference });
        const proceeding = proceedingsState.proceedings[reference];
        if (!proceeding)
            throw new ErrorException(
                'Tried to use reactor with non-existent proceeding.',
                { reference },
                t('error-invalid-reference', 'reactor')
            );

        const requestMessage = getGeneratedMessage(proceeding, 'request');
        if (!requestMessage)
            // TODO: Do we want to attach the proceeding (cf. `base.ts`)?
            throw new ErrorException('Tried to use reactor with proceeding without initial request.', { proceeding });

        if (requestMessage.slug) setCompanyBySlug(requestMessage.slug);
        else {
            // TODO: We're not respecting the language of the original request because messages don't store that
            // information.
            setTransportMedium(requestMessage.transport_medium);
            setRecipientAddress(requestMessage.correspondent_address);
            setRecipientEmail(requestMessage.correspondent_email);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (request.transport_medium !== 'email') return initiatePdfGeneration();
    }, [initiatePdfGeneration, request]);

    const callbackState = useMemo(
        () => ({
            reactorState,
            proceedingsState,
            reference,
            proceeding: proceedingsState.proceedings[reference],
            generatorState: { setCustomLetterProperty, request, renderLetter },
        }),
        [reactorState, proceedingsState, reference, setCustomLetterProperty, request, renderLetter]
    );

    const toPrimitive = useCallback(
        <T,>(value: T | StateCallback<T>) =>
            typeof value === 'function' ? (value as StateCallback<T>)(callbackState) : value,
        [callbackState]
    );

    const hooks = useMemo(
        () => reactorModules.flatMap((m) => m.hooks).filter((h): h is ReactorHook => h !== undefined),
        []
    );
    const steps = useMemo(
        () =>
            reactorModules
                .flatMap((m) => m.steps.map((s) => ({ ...s, moduleId: m.id as ReactorModuleWithDataId })))
                .map((step) => {
                    if (step.type === 'options')
                        step.options = [
                            ...hooks
                                .filter((h) => h.stepId === step.id && h.position === 'before')
                                .flatMap((h) => h.options),
                            ...step.options,
                            ...hooks
                                .filter((h) => h.stepId === step.id && h.position === 'after')
                                .flatMap((h) => h.options),
                        ].filter((o) => !(o.hideIf !== undefined && toPrimitive(o.hideIf)));
                    return step;
                }),
        [hooks, toPrimitive]
    );
    const pages = useCallback(
        (setPage: (newPage: string) => void) =>
            steps
                .filter((s): s is Exclude<typeof s, { type: 'condition' }> => s.type !== 'condition')
                .reduce<WizardPages<string>>(
                    (acc, step) => ({
                        ...acc,
                        [step.id]: {
                            component: (
                                <>
                                    <p>{toPrimitive(step.body)}</p>

                                    {step.type === 'letter' && (
                                        <>
                                            <textarea
                                                id="send-request-modal-body"
                                                className="form-element"
                                                rows={20}
                                                onBlur={(e) => {
                                                    setCustomLetterProperty('content', e.currentTarget.value);
                                                    renderLetter();
                                                }}>
                                                {request.custom_data?.content}
                                            </textarea>
                                            <div id="tagxplanation">
                                                <IntlProvider definition={window.I18N_DEFINITION} scope="generator">
                                                    <MarkupText id="tagxplanation" />
                                                </IntlProvider>
                                            </div>

                                            <div className="col66 col100-mobile">
                                                {reactorState.type !== 'complaint' && (
                                                    <StatefulDynamicInputContainer
                                                        title={t('sender', 'reactor')}
                                                        allowAddingFields={false}
                                                        allowChangingFieldDescriptions={false}
                                                        allowRemovingFields={false}
                                                        fieldFilter={(f) =>
                                                            f.type === 'name' ||
                                                            (request.transport_medium !== 'email' &&
                                                                f.type === 'address')
                                                        }
                                                    />
                                                )}

                                                {(request.transport_medium === 'fax' ||
                                                    request.transport_medium === 'letter') && (
                                                    <>
                                                        <StatefulSignatureInput fillSignature={fillSignature} />
                                                        <br />
                                                    </>
                                                )}

                                                <ActionButton
                                                    dropup={true}
                                                    mailtoDropdownProps={{
                                                        handlers: (
                                                            Object.keys(
                                                                mailto_handlers
                                                            ) as (keyof typeof mailto_handlers)[]
                                                        ).filter((h) => h !== 'copymanually'),
                                                    }}
                                                    onSuccess={() => {
                                                        proceedingsState.addMessage({
                                                            reference,
                                                            date: new Date(request.date),
                                                            type: reactorState.type,
                                                            transport_medium: request.transport_medium,
                                                            correspondent_address: request.recipient_address,
                                                            correspondent_email: request.email,
                                                            subject: request.custom_data?.subject,
                                                            content: request.custom_data?.content,
                                                            sentByMe: true,
                                                            reactorData: reactorState.moduleData,
                                                        });
                                                        setSent(true);
                                                    }}
                                                />
                                            </div>
                                        </>
                                    )}

                                    <div className="col66 col100-mobile">
                                        {step.type === 'options' && (
                                            <div className="radio-group radio-group-vertical radio-group-padded">
                                                {step.options.map((option) => (
                                                    <Radio
                                                        onClick={() => {
                                                            option.onChoose?.(callbackState);
                                                            setPage(toPrimitive(option.targetStepId));
                                                        }}
                                                        label={toPrimitive(option.text)}
                                                        disabled={toPrimitive(option.disableIf)}
                                                    />
                                                ))}
                                            </div>
                                        )}

                                        {step.type === 'textarea' && (
                                            <textarea
                                                className="form-element"
                                                value={
                                                    reactorState.moduleData[step.moduleId]?.issue.variables[
                                                        step.variableName
                                                    ]
                                                }
                                                rows={step.rows}
                                                onBlur={(e) =>
                                                    reactorState.setIssueVariable(
                                                        step.moduleId as 'custom-text',
                                                        step.variableName as 'text',
                                                        e.currentTarget.value
                                                    )
                                                }
                                            />
                                        )}

                                        {step.type === 'dynamic-inputs' && (
                                            <DynamicInputContainer
                                                id={`${step.moduleId}-additional-data`}
                                                fields={
                                                    step.storeIn === 'module'
                                                        ? reactorState.moduleData[step.moduleId]?.additionalData
                                                        : request.id_data
                                                }
                                                hasPrimary={false}
                                                onAddField={(field) =>
                                                    step.storeIn === 'module'
                                                        ? reactorState.addAdditionalDataField(step.moduleId, field)
                                                        : addField(field, 'id_data')
                                                }
                                                onRemoveField={(index) =>
                                                    step.storeIn === 'module'
                                                        ? reactorState.removeAdditionalDataField(step.moduleId, index)
                                                        : removeField(index, 'id_data')
                                                }
                                                onChange={(index, field) =>
                                                    step.storeIn === 'module'
                                                        ? reactorState.setAdditionalDataField(
                                                              step.moduleId,
                                                              index,
                                                              field
                                                          )
                                                        : setField(index, field, 'id_data')
                                                }
                                                allowAddingFields={true}
                                                fillFields={fillFields}
                                            />
                                        )}

                                        {step.type === 'sva-finder' && (
                                            <SvaFinder
                                                showTitle={false}
                                                callback={(sva) => {
                                                    if (sva) {
                                                        setSva(sva);
                                                        setPage(step.nextStepId);
                                                    }
                                                }}
                                            />
                                        )}

                                        {(step.type === 'textarea' || step.type === 'dynamic-inputs') && (
                                            <button
                                                className="button button-primary"
                                                onClick={() => setPage(step.nextStepId)}>
                                                <Text id="next" />
                                            </button>
                                        )}
                                    </div>
                                    <div className="clearfix" />
                                </>
                            ),
                            canGoBack: false,
                        },
                    }),
                    {}
                ),
        [
            steps,
            toPrimitive,
            request.custom_data?.content,
            request.custom_data?.subject,
            request.transport_medium,
            request.id_data,
            request.date,
            request.recipient_address,
            request.email,
            fillSignature,
            reactorState,
            fillFields,
            setCustomLetterProperty,
            renderLetter,
            proceedingsState,
            reference,
            setSent,
            callbackState,
            addField,
            removeField,
            setField,
            setSva,
        ]
    );

    const { Wizard, set } = useWizard(pages(setPage), { initialPageId: 'base::start' });

    function setPage(new_page: string) {
        const step = steps.find((s) => s.id === new_page);
        if (!step) return;

        // TODO: This is quite a horrible hack. The function captures the state when the render occurs. But it can be
        // updated later and steps expect their `onEnter` to be called with the current state.
        step.onEnter?.({ ...callbackState, reactorState: useReactorStore.getState() });

        if (step.type === 'condition') setPage(toPrimitive(step.condition) ? step.trueStepId : step.falseStepId);
        else set(new_page);
    }

    return (
        <IntlProvider definition={window.I18N_DEFINITION} scope="reactor">
            <header className="wizard-header">
                <h2>TODO</h2>
            </header>

            <Wizard />
        </IntlProvider>
    );
};

export const Reactor = (props: ReactorProps) => {
    const hasHydrated = useProceedingsStore((s) => s._hasHydrated);
    if (!hasHydrated) return <></>;

    return (
        <RequestGeneratorProvider createStore={createGeneratorStore}>
            <_Reactor {...props} />
        </RequestGeneratorProvider>
    );
};
