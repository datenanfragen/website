import { IntlProvider, Text } from 'preact-i18n';
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
    },
    company_search: {
        component: <CompanySearchPage setPage={setPage} />,
        title: t('company-chooser-page-title', 'generator'),
    },
    review_selection: {
        component: <ReviewSelectionPage setPage={setPage} />,
        title: t('selected-companies-page-title', 'generator'),
    },
    fill_requests: { component: <FillRequestsPage setPage={setPage} />, title: undefined },
});

export type AppPageId = keyof ReturnType<typeof pages>;
export type SetPageFunction = (newPage: AppPageId) => void;

type AppProps = {
    initialPageId?: AppPageId;
};

export const App = (props: AppProps) => {
    // TODO: Undo.
    const { Wizard, set, back, canGoBack, pageTitle } = useWizard(pages(setPage), {
        initialPageId: props.initialPageId ?? 'request_type_chooser',
    });

    function setPage(new_page: AppPageId) {
        set(new_page);
    }

    return (
        <IntlProvider definition={window.I18N_DEFINITION} scope="generator">
            <header className="wizard-header">
                <nav>
                    {canGoBack && (
                        <button
                            onClick={back}
                            disabled={!canGoBack}
                            className="button button-unstyled button-fit-content icon-arrow-left"
                            style="padding: 5px 7px 5px 5px; margin-right: 10px;"
                            title={t('back', 'generator')}
                        />
                    )}
                </nav>
                {pageTitle && <h2>{pageTitle}</h2>}
            </header>

            <Wizard />
        </IntlProvider>
    );
};
