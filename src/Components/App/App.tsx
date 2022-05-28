import { IntlProvider, Text } from 'preact-i18n';
import { useWizard } from '../../hooks/useWizard';
import { RequestTypeChooserPage } from './RequestTypeChooserPage';
import { CompanyChooserPage } from './CompanyChooserPage';

const pages = (setPage: SetPageFunction) => ({
    request_type_chooser: <RequestTypeChooserPage setPage={setPage} />,
    company_chooser: <CompanyChooserPage setPage={setPage} />,
});

export type AppPageIds = keyof ReturnType<typeof pages>;
export type SetPageFunction = (newPage: AppPageIds) => void;

export const App = () => {
    const { Wizard, set, back, canGoBack } = useWizard(pages(setPage), { initialPageId: 'request_type_chooser' });

    function setPage(new_page: AppPageIds) {
        set(new_page);
    }

    return (
        <IntlProvider definition={window.I18N_DEFINITION} scope="generator">
            <div>
                <Wizard />
                <button
                    onClick={back}
                    disabled={!canGoBack}
                    className="button button-secondary button-small icon icon-arrow-left">
                    <Text id="back" />
                </button>
            </div>
        </IntlProvider>
    );
};
