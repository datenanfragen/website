import { render } from 'preact';
import { createGeneratorStore, RequestGeneratorProvider } from './store/generator';
import { App, AppPageId } from './Components/App/App';
import Cookie from 'js-cookie';

const elem = document.querySelector('main');
if (elem) {
    render(
        <RequestGeneratorProvider createStore={createGeneratorStore}>
            <App
                initialPageId={
                    process.env.NODE_ENV === 'development'
                        ? (Cookie.get('DEBUG_INITAL_PAGE_ID') as AppPageId)
                        : undefined
                }
            />
        </RequestGeneratorProvider>,
        elem
    );
}
