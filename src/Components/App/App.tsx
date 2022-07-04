import { IntlProvider } from 'preact-i18n';
import { useWizard } from '../../hooks/useWizard';
import { RequestTypeChooserPage } from './RequestTypeChooserPage';
import { CompanySearchPage } from './CompanySearchPage';
import { ReviewSelectionPage } from './ReviewSelectionPage';
import { FillRequestsPage } from './FillRequestsPage';
import t from '../../Utility/i18n';

const pages = (setPage: SetPageFunction) => ({
    request_type_chooser: {
        component: <RequestTypeChooserPage setPage={setPage} />,
        title: t('request-type-chooser-page-title', 'generator'),
        canGoBack: true,
    },
    company_search: {
        component: <CompanySearchPage setPage={setPage} />,
        title: t('company-chooser-page-title', 'generator'),
        canGoBack: true,
    },
    review_selection: {
        component: <ReviewSelectionPage setPage={setPage} />,
        title: t('selected-companies-page-title', 'generator'),
        canGoBack: true,
    },
    fill_requests: { component: <FillRequestsPage />, title: undefined, canGoBack: false },
});

export type AppPageId = keyof ReturnType<typeof pages>;
export type SetPageFunction = (newPage: AppPageId) => void;

type AppProps = {
    initialPageId?: AppPageId;
};

export const App = (props: AppProps) => {
    const { Wizard, set, back, canGoBack, pageTitle } = useWizard(pages(setPage), {
        initialPageId: props.initialPageId ?? 'request_type_chooser',
    });

    function setPage(new_page: AppPageId) {
        set(new_page);
    }

    return (
        <IntlProvider definition={window.I18N_DEFINITION} scope="generator">
            <header className="wizard-header">
                {canGoBack && (
                    <button
                        onClick={back}
                        disabled={!canGoBack}
                        className="button button-unstyled button-fit-content app-back-button icon-arrow-left"
                        title={t('back', 'generator')}
                    />
                )}
                {pageTitle && <h2>{pageTitle}</h2>}
            </header>

            <Wizard />
        </IntlProvider>
    );
};
