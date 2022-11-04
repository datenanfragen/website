import { useEffect, useRef, useMemo } from 'preact/hooks';
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
import { getGeneratedMessage, useProceedingsStore } from '../../store/proceedings';
import { flash, FlashMessage } from '../FlashMessage';
import { Hint } from '../Hint';
import { isValidRequestType } from '../../Utility/requests';

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
    const setBatchRequestType = useGeneratorStore((state) => state.setBatchRequestType);
    const proceedings = useProceedingsStore((state) => state.proceedings);

    useEffect(() => {
        if (window.PARAMETERS.company || window.PARAMETERS.companies) {
            const companies =
                window.PARAMETERS.company || window.PARAMETERS.companies.split(',').map((slug) => slug.trim());
            appendToBatchBySlug(companies)
                .catch(() => flash(<FlashMessage type="error">{t('company-not-found', 'error-msg')}</FlashMessage>))
                .then(() => {
                    if (window.PARAMETERS.request_type && isValidRequestType(window.PARAMETERS.request_type)) {
                        setBatchRequestType(window.PARAMETERS.request_type);
                        setPage('review_selection');
                    }
                });
        } else if (window.PARAMETERS.request_type && isValidRequestType(window.PARAMETERS.request_type)) {
            setBatchRequestType(window.PARAMETERS.request_type);
            setPage('company_search');
        }
    }, [appendToBatchBySlug, setBatchRequestType]);

    const { Wizard, set, back, canGoBack, pageTitle } = useWizard(pages(setPage, props.pageOptions), {
        initialPageId: props.initialPageId ?? 'request_type_chooser',
    });
    const pageTitleElement = useRef<HTMLHeadingElement>(null);

    function setPage(new_page: AppPageId) {
        set(new_page);
        pageTitleElement.current?.focus();
    }

    const hasUsedOldGenerator = useMemo(
        () =>
            !!Object.values(proceedings).find(
                (p) => (getGeneratedMessage(p, 'request')?.date || new Date('9999-12-31')) <= new Date('2022-09-30')
            ),
        [proceedings]
    );

    return (
        <>
            {hasUsedOldGenerator && <Hint id="advanced-generator" />}
            <IntlProvider definition={window.I18N_DEFINITION} scope="generator">
                <header className="wizard-header">
                    {canGoBack && (
                        <button
                            onClick={() => {
                                back();
                                pageTitleElement.current?.focus();
                            }}
                            disabled={!canGoBack}
                            className="button button-unstyled button-fit-content app-back-button icon-arrow-left"
                            title={t('back', 'generator')}
                        />
                    )}
                    {pageTitle && (
                        <h2 ref={pageTitleElement} tabIndex={-1} style="outline: none">
                            {pageTitle}
                        </h2>
                    )}
                </header>

                <Wizard />
            </IntlProvider>
        </>
    );
};
