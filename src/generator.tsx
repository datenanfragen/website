import { render } from 'preact';
import { IntlProvider, Text } from 'preact-i18n';
import { clearUrlParameters } from './Utility/browser';
import t from './Utility/i18n';
// The type bindings "provided" by this package do not match with the versions of the original package.
// Since we intend to get rid of this anyway, we will just ignore it.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Joyride from 'react-joyride';
import { tutorial_steps } from './wizard-tutorial';
import Cookie from 'js-cookie';
import { RequestGeneratorBuilder } from './Components/RequestGeneratorBuilder';
import { Privacy, PRIVACY_ACTIONS } from './Utility/Privacy';
import { SavedCompanies } from './DataType/SavedCompanies';
import { useEffect, useState, useRef, useCallback } from 'preact/hooks';
import { createGeneratorStore, RequestGeneratorProvider, useGeneratorStore } from './store/generator';
import { useModal } from './Components/Modal';
import { ActionButton } from './Components/Generator/ActionButton';
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
    const appendToBatchBySlug = useGeneratorStore((state) => state.appendToBatchBySlug);
    const advanceBatch = useGeneratorStore((state) => state.advanceBatch);
    const clearBatch = useGeneratorStore((state) => state.clearBatch);
    const hasBatch = useGeneratorStore((state) => state.hasBatch);
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
        document
            .querySelectorAll<HTMLElement>('.company-info h1')
            .forEach((element) => (element.style.marginLeft = isInWizardMode ? '0' : ''));

        if (Privacy.isAllowed(PRIVACY_ACTIONS.SAVE_WIZARD_ENTRIES) && isInWizardMode) {
            const saved_companies = new SavedCompanies();

            saved_companies
                .getAll()
                .then((companies) => appendToBatchBySlug(Object.keys(companies)))
                .then(() => advanceBatch());
            return () => clearBatch();
        }
    }, [isInWizardMode, clearBatch, appendToBatchBySlug, advanceBatch]);

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
    }, [showWizardDoneModal, setWizardMode, hasBatch, isInWizardMode]);

    return (
        <main>
            <Joyride
                ref={tutorial}
                callback={(data: { type: string }) => {
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
            />
            <WizardDoneModal />

            <RequestGeneratorBuilder>
                <header id="generator-header">
                    <div id="generator-controls" style="margin-bottom: 10px;">
                        <ActionButton />
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
