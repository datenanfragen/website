import { render } from 'preact';
import { createGeneratorStore, RequestGeneratorProvider } from './store/generator';
import { App } from './Components/App/App';

const elem = document.querySelector('main');
if (elem) {
    render(
        <RequestGeneratorProvider createStore={createGeneratorStore}>
            <App />
        </RequestGeneratorProvider>,
        elem
    );
}
