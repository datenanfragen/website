import { render } from 'preact';
import { IntlProvider } from 'preact-i18n';
import { RequestGeneratorBuilder } from './Components/RequestGeneratorBuilder';
import { createGeneratorStore, RequestGeneratorProvider, useGeneratorStore } from './store/generator';
import { ActionButton } from './Components/Generator/ActionButton';
import { NewRequestButton } from './Components/Generator/NewRequestButton';
import { RequestForm } from './Components/Generator/RequestForm';
import { CompanyWidget } from './Components/Generator/CompanyWidget';
import { CompanySelector } from './Components/Generator/CompanySelector';
import { Hint } from './Components/Hint';

const Generator = () => {
    const current_company = useGeneratorStore((state) => state.current_company);

    return (
        <main>
            <Hint id="new-generator" />

            <RequestGeneratorBuilder>
                <header id="generator-header">
                    <div id="generator-controls" style="margin-bottom: 10px;">
                        <ActionButton />
                        <NewRequestButton />
                    </div>
                </header>

                <div className="clearfix" />

                <CompanySelector />

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
