import preact from 'preact';
import { IntlProvider } from 'preact-i18n';
import { PARAMETERS } from 'Utility/common';
import t from './Utility/i18n';
import Joyride from 'react-joyride';
import { tutorial_steps } from './wizard-tutorial.js';
import Cookie from 'js-cookie';
import RequestGeneratorBuilder, {
    ActionButtonPlaceholder,
    NewRequestButtonPlaceholder,
    CompanySelectorPlaceholder,
    RequestFormPlaceholder
} from './Components/RequestGeneratorBuilder';

class Generator extends preact.Component {
    constructor(props) {
        super(props);

        this.state = {
            run_wizard_tutorial: false
        };

        if (PARAMETERS['from'] === 'wizard') {
            if (Cookie.get('finished_wizard_tutorial') !== 'true') this.state.run_wizard_tutorial = true;
        }
    }

    render() {
        return (
            <main>
                <Joyride
                    ref={c => (this.tutorial = c)}
                    callback={data => {
                        if (data.type == 'finished') Cookie.set('finished_wizard_tutorial', 'true', { expires: 365 });
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
                        skip: t('skip', 'wizard_tutorial')
                    }}
                    showSkipButton={true}
                    showStepsProgress={true}
                    showOverlay={false}
                />

                <RequestGeneratorBuilder ref={el => (this.generator_builder = el)}>
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
                </RequestGeneratorBuilder>
            </main>
        );
    }
}

preact.render(
    <IntlProvider scope="generator" definition={I18N_DEFINITION}>
        <Generator />
    </IntlProvider>,
    null,
    document.getElementById('generator')
);
