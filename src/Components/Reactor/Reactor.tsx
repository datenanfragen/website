import { IntlProvider } from 'preact-i18n';
import { Radio } from '../Radio';
import { useWizard, WizardPages } from '../../hooks/useWizard';
import type { ReactorHook } from '../../types/reactor.d';

import baseModule from './modules/base';
import additionalId from './modules/additional-id-data';

export const Reactor = () => {
    const modules = [baseModule, additionalId];
    const hooks = modules.flatMap((m) => m.hooks).filter((h): h is ReactorHook => h !== undefined);
    const steps = modules
        .flatMap((m) => m.steps)
        .map((step) => ({
            ...step,
            options: [
                ...hooks.filter((h) => h.stepId === step.id && h.position === 'before').flatMap((h) => h.options),
                ...step.options,
                ...hooks.filter((h) => h.stepId === step.id && h.position === 'after').flatMap((h) => h.options),
            ],
        }));

    const pages = (setPage: (newPage: string) => void) =>
        steps.reduce<WizardPages<string>>(
            (acc, step) => ({
                ...acc,
                [step.id]: {
                    component: (
                        <>
                            {typeof step.body === 'string' ? <p>{step.body}</p> : step.body}

                            {step.options && (
                                <>
                                    <div className="radio-group radio-group-vertical radio-group-padded col66 col100-mobile">
                                        {step.options.map((option) => (
                                            <Radio onClick={() => setPage(option.targetStepId)} label={option.text} />
                                        ))}
                                    </div>
                                    <div className="clearfix" />
                                </>
                            )}
                        </>
                    ),
                    canGoBack: false,
                },
            }),
            {}
        );

    const { Wizard, set } = useWizard(pages(setPage), {
        initialPageId: 'base::start',
    });

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
