import { render } from 'preact';
import { createGeneratorStore, RequestGeneratorProvider } from './store/generator';
import { App } from './Components/App/App';
import { Reactor } from './Components/Reactor/Reactor';
import { GeneratorStoreTestInterface } from './Components/Generator/GeneratorTestInterface';

const elem = document.querySelector('main');
if (elem) {
    render(
        window.PARAMETERS.reference ? (
            <Reactor reference={window.PARAMETERS.reference} />
        ) : (
            <RequestGeneratorProvider createStore={createGeneratorStore}>
                {process.env.NODE_ENV === 'development' && <GeneratorStoreTestInterface />}
                <App />
            </RequestGeneratorProvider>
        ),
        elem
    );
}
