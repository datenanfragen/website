import { render, Component } from 'preact';
import { IntlProvider } from 'preact-i18n';
import { PARAMETERS } from './Utility/common';
import { clearUrlParameters } from './Utility/browser';
import t from './Utility/i18n';
import Joyride from 'react-joyride';
import { tutorial_steps } from './wizard-tutorial.js';
import Cookie from 'js-cookie';
import RequestGeneratorBuilder from './Components/RequestGeneratorBuilder';
import Privacy, { PRIVACY_ACTIONS } from './Utility/Privacy';
import { SavedCompanies } from './Components/Wizard';
import Modal, { showModal, dismissModal } from './Components/Modal';

const HIDE_IN_WIZARD_MODE = [
    '.search',
    '.request-type-chooser',
    '#data-portability',
    '#advanced-information',
    '.company-remove',
];

class Generator extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_in_wizard_mode: PARAMETERS['from'] === 'wizard',
            run_wizard_tutorial: PARAMETERS['from'] === 'wizard' && Cookie.get('finished_wizard_tutorial') !== 'true',
        };

        if (Privacy.isAllowed(PRIVACY_ACTIONS.SAVE_WIZARD_ENTRIES)) this.saved_companies = new SavedCompanies();
    }

    componentDidMount = () => {
        this.adjustAccordingToWizardMode();

        if (this.state.is_in_wizard_mode && Privacy.isAllowed(PRIVACY_ACTIONS.SAVE_WIZARD_ENTRIES)) {
            this.saved_companies.getAll().then((companies) => {
                // Our ref to the `RequestGeneratorBuilder`, `this.generator_builder`, is only available after the
                // component has been rendered for the first time. Thus, this needs to be run in `componentDidMount()`.
                this.generator_builder.startBatch(Object.keys(companies));
            });
        }
    };

    render() {
        return (
            <main>
                <Joyride
                    ref={(c) => (this.tutorial = c)}
                    callback={(data) => {
                        if (data.type === 'finished') Cookie.set('finished_wizard_tutorial', 'true', { expires: 365 });
                    }}
                    steps={tutorial_steps}
                    type="continuous"
                    run={this.state.run_wizard_tutorial}
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

                <RequestGeneratorBuilder
                    ref={(el) => (this.generator_builder = el)}
                    newRequestHook={this.newRequestHook}
                    render={({
                        ActionButtonPlaceholder,
                        NewRequestButtonPlaceholder,
                        CompanySelectorPlaceholder,
                        RequestFormPlaceholder,
                    }) => (
                        <>
                            <header id="generator-header">
                                <div id="generator-controls" style="margin-bottom: 10px;">
                                    <ActionButtonPlaceholder />
                                    <NewRequestButtonPlaceholder />
                                </div>
                            </header>

                            <div className="clearfix" />

                            <CompanySelectorPlaceholder />

                            <div id="request-generator" className="grid" style="margin-top: 10px;">
                                <div id="form-container">
                                    <RequestFormPlaceholder />
                                </div>
                            </div>

                            <div className="clearfix" />
                        </>
                    )}
                />
            </main>
        );
    }

    adjustAccordingToWizardMode() {
        HIDE_IN_WIZARD_MODE.forEach((selector) => {
            document.querySelectorAll(selector).forEach((el) => {
                if (this.state.is_in_wizard_mode) el.classList.add('hidden');
                else el.classList.remove('hidden');
            });
        });
        document.querySelectorAll('.company-info h1').forEach((selector) => {
            selector.style.marginLeft = this.state.is_in_wizard_mode ? '0' : '';
        });
    }

    newRequestHook = (that) => {
        if (
            that.state.request.type === 'access' &&
            Privacy.isAllowed(PRIVACY_ACTIONS.SAVE_WIZARD_ENTRIES) &&
            that.state.suggestion?.slug
        ) {
            this.saved_companies.remove(that.state.suggestion.slug);
        }

        if (this.state.is_in_wizard_mode && that.state.batch?.length === 0) {
            // Remove the GET parameters from the URL so this doesn't get triggered again on the next new request and
            // get the generator out of wizard mode.
            clearUrlParameters();
            // eslint-disable-next-line react/no-direct-mutation-state
            this.state.is_in_wizard_mode = false;

            this.adjustAccordingToWizardMode();

            const modal = showModal(
                <Modal
                    positiveText={t('ok', 'generator')}
                    onPositiveFeedback={() => dismissModal(modal)}
                    positiveDefault={true}
                    onDismiss={() => dismissModal(modal)}>
                    {t('wizard-done-modal', 'generator')}
                </Modal>
            );
        }
    };
}

const generator_el = document.getElementById('generator');
render(
    <IntlProvider scope="generator" definition={I18N_DEFINITION}>
        <Generator />
    </IntlProvider>,
    generator_el.parentElement,
    generator_el
);
