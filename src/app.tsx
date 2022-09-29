import { render } from 'preact';
import { createGeneratorStore, RequestGeneratorProvider, useGeneratorStoreApi } from './store/generator';
import { App } from './Components/App/App';
import { Reactor } from './Components/Reactor/Reactor';
import { useEffect } from 'preact/hooks';

// Expose the store for the test interface
const GeneratorStoreTestInterface = () => {
    const generatorStoreApi = useGeneratorStoreApi();

    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            (window as typeof window & { generatorStoreApi: typeof generatorStoreApi }).generatorStoreApi =
                generatorStoreApi;
        }
    });

    return <></>;
};

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
