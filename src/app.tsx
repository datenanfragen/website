import { render } from 'preact';
import { createGeneratorStore, RequestGeneratorProvider } from './store/generator';
import { App } from './Components/App/App';
import { Reactor } from './Components/Reactor/Reactor';

const elem = document.querySelector('main');
if (elem) {
    render(
        window.PARAMETERS.reference ? (
            <Reactor reference={window.PARAMETERS.reference} />
        ) : (
            <RequestGeneratorProvider createStore={createGeneratorStore}>
                <App />
            </RequestGeneratorProvider>
        ),
        elem
    );
}
