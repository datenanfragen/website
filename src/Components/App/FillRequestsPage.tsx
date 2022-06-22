import { useEffect } from 'preact/hooks';
import { MarkupText, Text } from 'preact-i18n';
import { useGeneratorStore } from '../../store/generator';
import { SetPageFunction } from './App';
import { StatefulDynamicInputContainer } from '../Generator/DynamicInputContainer';
import { SendRequestButton } from '../App/SendRequestButton';
import { ErrorException } from '../../Utility/errors';

type FillRequestsPageProps = {
    setPage: SetPageFunction;
};

export const FillRequestsPage = (props: FillRequestsPageProps) => {
    const [batch, current_company] = useGeneratorStore((state) => [state.batch, state.current_company]);
    const resetRequestToDefault = useGeneratorStore((state) => state.resetRequestToDefault);

    useEffect(() => {
        if (!current_company) resetRequestToDefault(true);
    }, [current_company, resetRequestToDefault]);

    if (!batch) throw new ErrorException('Got to fill requests page without batch.');
    if (!current_company) return <></>;

    return (
        <>
            <BatchBreadcrumbs />
            <h2>{current_company.name}</h2>
            {/* TODO: Better explanation. */}
            <MarkupText id="id-data-explanation" />
            {/* TODO: Maybe the "add new input" stuff should be more like the fill fields dropdown? That thing currently takes up a lot of space and is confusing, especially since ideally, users should even need it. We could even combine it with the fill fields dropdown! */}
            <StatefulDynamicInputContainer
                allowAddingFields={false}
                allowChangingFieldDescriptions={false}
                allowRemovingFields={false}
            />
            {/* TODO: Don't we need to call `renderLetter()`? (From a quick investigation: Emails don't need it (even though it does something for emails…) but PDFs do.) */}
            <SendRequestButton />
        </>
    );
};

const BatchBreadcrumbs = () => {
    const [batch, current_company] = useGeneratorStore((state) => [state.batch, state.current_company]);
    const batch_length = Object.keys(batch || {}).length || 0;
    const completed_requests = Object.values(batch || {}).filter((batchEntry) => batchEntry.done);
    const completed_request_num = completed_requests?.length || 0;
    const remaining_requests_num = batch_length - completed_request_num;
    const current_company_index = Object.keys(batch || {}).findIndex((item) => item === current_company?.slug);

    return (
        <nav>
            <ol className="batch-breadcrumbs">
                {completed_request_num >= 1 && (
                    <li className="batch-breadcrumb">
                        <span className="batch-breadcrumb-sent">
                            <Text
                                id="batch-breadcrumbs-sent"
                                plural={completed_request_num}
                                fields={{ sent: completed_request_num }}
                            />
                        </span>
                    </li>
                )}
                {current_company && (
                    <li className="batch-breadcrumb" aria-current="page">
                        <span className="batch-breadcrumb-active">{current_company.name}</span>
                    </li>
                )}
                {batch && current_company_index + 1 < batch_length && (
                    <li className="batch-breadcrumb desktop-only">
                        <span>{Object.entries(batch)[current_company_index + 1][1].company.name}</span>
                    </li>
                )}
                {remaining_requests_num >= 2 && (
                    <li className="batch-breadcrumb desktop-only">
                        <span>
                            <Text
                                id="batch-breadcrumbs-remaining"
                                plural={remaining_requests_num - 1}
                                fields={{ left: remaining_requests_num - 1 }}
                            />
                        </span>
                    </li>
                )}
                {/* We do this to save space on mobile and hide the upcoming request, but then the request count is off, so we have it here twice. */}
                {remaining_requests_num > 1 && (
                    <li className="batch-breadcrumb mobile-only">
                        <span>
                            <Text
                                id="batch-breadcrumbs-remaining"
                                plural={remaining_requests_num - 1}
                                fields={{ left: remaining_requests_num - 1 }}
                            />
                        </span>
                    </li>
                )}
            </ol>
        </nav>
    );
};
