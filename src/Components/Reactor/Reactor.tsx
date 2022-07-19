import { useCallback, useMemo } from 'preact/hooks';
import { IntlProvider, Text } from 'preact-i18n';
import { Radio } from '../Radio';
import { DynamicInputContainer } from '../Generator/DynamicInputContainer';
import { useReactorStore } from '../../store/reactor';
import { useWizard, WizardPages } from '../../hooks/useWizard';
import { reactorModules } from './modules/index';
import { generateLetter } from '../../Utility/reactor';
import type { ReactorHook, ReactorModuleWithDataId } from '../../types/reactor.d';

export const Reactor = () => {
    const store = useReactorStore();

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
                        ].filter(
                            (o) =>
                                !(
                                    o.hideIf !== undefined &&
                                    (typeof o.hideIf === 'function' ? o.hideIf(store) : o.hideIf)
                                )
                        );
                    return step;
                }),
        [hooks, store]
    );
    const pages = useCallback(
        (setPage: (newPage: string) => void) =>
            steps.reduce<WizardPages<string>>(
                (acc, step) => ({
                    ...acc,
                    [step.id]: {
                        component: (
                            <>
                                <p>{typeof step.body === 'function' ? step.body(store) : step.body}</p>

                                {/* TODO: v */}
                                {step.id === 'base::generate-letter' && (
                                    <pre>{generateLetter(store, 'en', 'TODO').toEmailString()}</pre>
                                )}

                                <div className="col66 col100-mobile">
                                    {step.type === 'options' && (
                                        <div className="radio-group radio-group-vertical radio-group-padded">
                                            {step.options.map((option) => (
                                                <Radio
                                                    onClick={() => {
                                                        option.onChoose?.(store);
                                                        setPage(option.targetStepId);
                                                    }}
                                                    label={option.text}
                                                />
                                            ))}
                                        </div>
                                    )}

                                    {step.type === 'textarea' && (
                                        <textarea
                                            className="form-element"
                                            value={store.moduleData[step.moduleId]?.issue.variables[step.variableName]}
                                            rows={step.rows}
                                            onBlur={(e) =>
                                                store.setIssueVariable(
                                                    step.moduleId,
                                                    step.variableName,
                                                    e.currentTarget.value
                                                )
                                            }
                                        />
                                    )}

                                    {step.type === 'dynamic-inputs' && (
                                        <DynamicInputContainer
                                            id={`${step.moduleId}-additional-data`}
                                            fields={store.moduleData[step.moduleId].additionalData}
                                            hasPrimary={false}
                                            onAddField={(field) => store.addAdditionalDataField(step.moduleId, field)}
                                            onRemoveField={(index) =>
                                                store.removeAdditionalDataField(step.moduleId, index)
                                            }
                                            onChange={(index, field) =>
                                                store.setAdditionalDataField(step.moduleId, index, field)
                                            }
                                            allowAddingFields={true}
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
        [steps, store]
    );

    const { Wizard, set } = useWizard(pages(setPage), { initialPageId: 'base::start' });

    function setPage(new_page: string) {
        set(new_page);
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
