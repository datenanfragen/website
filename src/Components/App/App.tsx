import { IntlProvider, Text } from 'preact-i18n';
import { useWizard } from '../../hooks/useWizard';
import { RequestTypeChooserPage } from './RequestTypeChooserPage';
import { CompanySearchPage } from './CompanySearchPage';
import { ReviewSelectionPage } from './ReviewSelectionPage';

const pages = (setPage: SetPageFunction) => ({
    request_type_chooser: <RequestTypeChooserPage setPage={setPage} />,
    company_search: <CompanySearchPage setPage={setPage} />,
    review_selection: <ReviewSelectionPage setPage={setPage} />,
});

export type AppPageId = keyof ReturnType<typeof pages>;
export type SetPageFunction = (newPage: AppPageId) => void;

export const App = () => {
    // TODO: Undo.
    const { Wizard, set, back, canGoBack } = useWizard(pages(setPage), { initialPageId: 'company_search' });

    function setPage(new_page: AppPageId) {
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
