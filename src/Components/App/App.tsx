import { useEffect } from 'preact/hooks';
import { IntlProvider } from 'preact-i18n';
import { useWizard } from '../../hooks/useWizard';
import { RequestTypeChooserPage } from './RequestTypeChooserPage';
import { CompanySearchPage } from './CompanySearchPage';
import { ReviewSelectionPage } from './ReviewSelectionPage';
import { FillRequestsPage } from './FillRequestsPage';
import { WhatsNextPage } from './WhatsNextPage';
import t from '../../Utility/i18n';
import type { MailtoDropdownProps } from '../MailtoDropdown';
import type { SearchClient } from '../../Utility/search';
import type { SearchParams } from 'typesense/lib/Typesense/Documents';
import { ActionButtonProps } from '../Generator/ActionButton';
import { useGeneratorStore } from '../../store/generator';
import { flash, FlashMessage } from '../FlashMessage';

const pages = (setPage: SetPageFunction, pageOptions?: PageOptions) => ({
    request_type_chooser: {
        component: <RequestTypeChooserPage setPage={setPage} />,
        title: t('request-type-chooser-page-title', 'generator'),
        canGoBack: true,
    },
    company_search: {
        component: <CompanySearchPage setPage={setPage} pageOptions={pageOptions} />,
        title: t('company-chooser-page-title', 'generator'),
        canGoBack: true,
    },
    review_selection: {
        component: <ReviewSelectionPage setPage={setPage} />,
        title: t('selected-companies-page-title', 'generator'),
        canGoBack: true,
    },
    fill_requests: {
        component: <FillRequestsPage setPage={setPage} pageOptions={pageOptions} />,
        title: undefined,
        canGoBack: false,
    },
    whats_next: {
        component: <WhatsNextPage setPage={setPage} onViewRequests={pageOptions?.onViewRequests} />,
        title: t('whats-next-title', 'generator'),
        canGoBack: false,
    },
});

export type AppPageId = keyof ReturnType<typeof pages>;
export type SetPageFunction = (newPage: AppPageId) => void;

export type PageOptions = {
    mailtoDropdown?: Partial<MailtoDropdownProps>;
    searchClient?: (params: Partial<SearchParams>) => SearchClient;
    actionButton?: Partial<ActionButtonProps>;
    /** Function to execute when the 'View your requests' button on the 'What’s next?' page is clicked. */
    onViewRequests?: () => void;
};

type AppProps = {
    initialPageId?: AppPageId;
    pageOptions?: PageOptions;
};

export const App = (props: AppProps) => {
    const appendToBatchBySlug = useGeneratorStore((state) => state.appendToBatchBySlug);

    useEffect(() => {
        if (window.PARAMETERS.company || window.PARAMETERS.companies) {
            const companies =
                window.PARAMETERS.company || window.PARAMETERS.companies.split(',').map((slug) => slug.trim());
            appendToBatchBySlug(companies).catch(() =>
                flash(<FlashMessage type="error">{t('company-not-found', 'error-msg')}</FlashMessage>)
            );
        }
    }, [appendToBatchBySlug]);

    const { Wizard, set, back, canGoBack, pageTitle } = useWizard(pages(setPage, props.pageOptions), {
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
