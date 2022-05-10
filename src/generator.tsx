import { render, Component } from 'preact';
import { IntlProvider, Text } from 'preact-i18n';
import { clearUrlParameters } from './Utility/browser';
import t from './Utility/i18n';
import Joyride from 'react-joyride';
import { tutorial_steps } from './wizard-tutorial';
import Cookie from 'js-cookie';
import { RequestGeneratorBuilder } from './Components/RequestGeneratorBuilder';
import { Privacy, PRIVACY_ACTIONS } from './Utility/Privacy';
import { SavedCompanies } from './DataType/SavedCompanies';
import { useEffect, useState, useRef, useCallback } from 'preact/hooks';
import { createGeneratorStore, RequestGeneratorProvider, useGeneratorStore } from './store/generator';
import { useModal } from './Components/Modal';
import { ActionButtonPlaceholder } from './Components/Generator/ActionButton';
import { NewRequestButton } from './Components/Generator/NewRequestButton';
import { RequestForm } from './Components/Generator/RequestForm';
import { CompanyWidget } from './Components/Generator/CompanyWidget';
import { CompanySelector } from './Components/Generator/CompanySelector';
const HIDE_IN_WIZARD_MODE = [
    '.search',
    '.request-type-chooser',
    '#data-portability',
    '#advanced-information',
    '.company-remove',
];

const Generator = () => {
    const startBatch = useGeneratorStore((state) => state.startBatch);
    const clearBatch = useGeneratorStore((state) => state.clearBatch);
    const hasBatch = useGeneratorStore((state) => state.hasBatch);
    const request_type = useGeneratorStore((state) => state.request.type);
    const current_company = useGeneratorStore((state) => state.current_company);

    const [isInWizardMode, setWizardMode] = useState(window.PARAMETERS['from'] === 'wizard');
    const run_wizard_tutorial =
        window.PARAMETERS['from'] === 'wizard' && Cookie.get('finished_wizard_tutorial') !== 'true';

    const tutorial = useRef();

    useEffect(() => {
        HIDE_IN_WIZARD_MODE.forEach((selector) => {
            document.querySelectorAll(selector).forEach((el) => {
                if (isInWizardMode) el.classList.add('hidden');
                else el.classList.remove('hidden');
            });
        });
        document.querySelectorAll<HTMLElement>('.company-info h1').forEach((selector) => {
            selector.style.marginLeft = isInWizardMode ? '0' : '';
        });

        if (Privacy.isAllowed(PRIVACY_ACTIONS.SAVE_WIZARD_ENTRIES) && isInWizardMode) {
            const saved_companies = new SavedCompanies();

            saved_companies.getAll().then((companies) => {
                // Our ref to the `RequestGeneratorBuilder`, `this.generator_builder`, is only available after the
                // component has been rendered for the first time. Thus, this needs to be run in `componentDidMount()`.
                startBatch(Object.keys(companies));
            });
            return () => clearBatch();
        }
    }, [isInWizardMode, clearBatch, startBatch]);

    const [WizardDoneModal, showWizardDoneModal, dismissWizardDoneModal] = useModal(
        <IntlProvider scope="generator" definition={window.I18N_DEFINITION}>
            <Text id="wizard-done-modal" />
        </IntlProvider>,
        {
            positiveText: t('ok', 'generator'),
            onPositiveFeedback: () => dismissWizardDoneModal(),
            defaultButton: 'positive',
        }
    );

    const newRequestHook = useCallback(() => {
        if (isInWizardMode && !hasBatch()) {
            // Remove the GET parameters from the URL so this doesn't get triggered again on the next new request and
            // get the generator out of wizard mode.
            clearUrlParameters();
            setWizardMode(false);
            showWizardDoneModal();
        }
    }, []);

    return (
        <main>
            {/*<Joyride
                ref={tutorial}
                callback={(data) => {
                    if (data.type === 'finished') {
                        Cookie.set('finished_wizard_tutorial', 'true', {
                            expires: 365,
                            secure: true,
                            sameSite: 'strict',
                        });
                    }
                }}
                steps={tutorial_steps}
                type="continuous"
                run={run_wizard_tutorial}
                autoStart={true}
                locale={{
                    back: t('back', 'wizard_tutorial'),
                    close: t('close', 'wizard_tutorial'),
                    last: t('finish', 'wizard_tutorial'),
                    next: t('next', 'wizard_tutorial'),
                    skip: t('skip', 'wizard_tutorial'),
                }}
                showSkipButton={true}
                showStepsProgress={true}
                showOverlay={false}
            />*/}
            <WizardDoneModal />

            <RequestGeneratorBuilder>
                <header id="generator-header">
                    <div id="generator-controls" style="margin-bottom: 10px;">
                        <ActionButtonPlaceholder />
                        <NewRequestButton newRequestHook={newRequestHook} />
                    </div>
                </header>

                <div className="clearfix" />

                <CompanySelector newRequestHook={newRequestHook} />

                <div id="request-generator" className="grid" style="margin-top: 10px;">
                    <div id="form-container">
                        <RequestForm>{current_company ? <CompanyWidget /> : ''}</RequestForm>
                    </div>
                </div>

                <div className="clearfix" />
            </RequestGeneratorBuilder>
        </main>
    );
};

const generator_el = document.getElementById('generator');
if (generator_el)
    render(
        <IntlProvider scope="generator" definition={window.I18N_DEFINITION}>
            <RequestGeneratorProvider createStore={createGeneratorStore}>
                <Generator />
            </RequestGeneratorProvider>
        </IntlProvider>,
        generator_el.parentElement!,
        generator_el
    );
