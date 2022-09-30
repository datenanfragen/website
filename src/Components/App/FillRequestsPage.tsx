import { useEffect } from 'preact/hooks';
import { MarkupText, Text } from 'preact-i18n';
import t from '../../Utility/i18n';
import { useGeneratorStore } from '../../store/generator';
import { DynamicInputContainer, StatefulDynamicInputContainer } from '../Generator/DynamicInputContainer';
import { PageOptions, SetPageFunction } from './App';
import { SendRequestButton } from '../App/SendRequestButton';
import { ErrorException } from '../../Utility/errors';
import { StatefulSignatureInput } from '../Generator/SignatureInput';
import { RequestFlags } from '../Generator/RequestFlags';

type FillRequestsPageProps = {
    setPage: SetPageFunction;
    pageOptions?: PageOptions;
};

export const FillRequestsPage = (props: FillRequestsPageProps) => {
    const [batch, current_company, request_type, transport_medium, fillSignature] = useGeneratorStore((state) => [
        state.batch,
        state.current_company,
        state.request.type,
        state.request.transport_medium,
        state.fillSignature,
    ]);
    const resetRequestToDefault = useGeneratorStore((state) => state.resetRequestToDefault);
    const fillFields = useGeneratorStore((state) => state.fillFields);
    const rectification_data = useGeneratorStore((state) =>
        state.request.type === 'rectification' ? state.request.rectification_data : undefined
    );
    const [addField, removeField, setField] = useGeneratorStore((state) => [
        state.addField,
        state.removeField,
        state.setField,
    ]);

    useEffect(() => {
        if (!current_company) resetRequestToDefault({ advanceBatch: true });
    }, [current_company, resetRequestToDefault]);

    if (!batch) throw new ErrorException('Got to fill requests page without batch.');
    if (!current_company) return <></>;

    return (
        <div className="fill-requests-page">
            <BatchBreadcrumbs />
            <h2>
                <Text id="fill-in-request" fields={{ company: current_company.name }} />
            </h2>

            {/* TODO: Better explanation. */}
            <StatefulDynamicInputContainer
                allowAddingFields={true}
                allowChangingFieldDescriptions={true}
                allowRemovingFields={true}
                hasPrimary={true}
                fillFields={fillFields}>
                <MarkupText id="id-data-explanation" />
            </StatefulDynamicInputContainer>
            <br />

            {request_type === 'erasure' && <RequestFlags />}

            {request_type === 'rectification' && rectification_data && (
                <>
                    <DynamicInputContainer
                        key="rectification_data"
                        id="rectification_data"
                        title={t('rectification-data', 'generator')}
                        fields={rectification_data}
                        hasPrimary={false}
                        onAddField={(field) => addField(field, 'rectification_data')}
                        onRemoveField={(id) => removeField(id, 'rectification_data')}
                        onChange={(id, field) => setField(id, field, 'rectification_data')}
                        allowAddingFields={true}>
                        <MarkupText id="rectification-data-explanation" />
                    </DynamicInputContainer>
                    <br />
                </>
            )}

            {(transport_medium === 'fax' || transport_medium === 'letter') && (
                <>
                    <StatefulSignatureInput fillSignature={fillSignature} />
                    <br />
                </>
            )}

            <div className="action-button-row">
                <SendRequestButton
                    setPage={props.setPage}
                    mailtoDropdownOptions={props.pageOptions?.mailtoDropdown}
                    actionButtonOptions={props.pageOptions?.actionButton}
                />
            </div>
        </div>
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
                    <li className="batch-breadcrumb batch-breadcrumb-sent">
                        <div className="batch-breadcrumb-content ">
                            <Text
                                id="batch-breadcrumbs-sent"
                                plural={completed_request_num}
                                fields={{ sent: completed_request_num }}
                            />
                        </div>
                    </li>
                )}
                {current_company && (
                    <li
                        className="batch-breadcrumb batch-breadcrumb-active"
                        aria-current="page"
                        title={current_company.name}>
                        <div className="batch-breadcrumb-content">{current_company.name}</div>
                    </li>
                )}
                {batch && current_company_index + 1 < batch_length && (
                    <li
                        className="batch-breadcrumb desktop-only"
                        title={Object.entries(batch)[current_company_index + 1][1].company.name}>
                        <div className="batch-breadcrumb-content">
                            {Object.entries(batch)[current_company_index + 1][1].company.name}
                        </div>
                    </li>
                )}
                {remaining_requests_num >= 2 && (
                    <li className="batch-breadcrumb desktop-only">
                        <div className="batch-breadcrumb-content">
                            <Text
                                id="batch-breadcrumbs-remaining"
                                plural={remaining_requests_num - 1}
                                fields={{ left: remaining_requests_num - 1 }}
                            />
                        </div>
                    </li>
                )}
                {/* We do this to save space on mobile and hide the upcoming request, but then the request count is off, so we have it here twice. */}
                {remaining_requests_num > 1 && (
                    <li className="batch-breadcrumb mobile-only">
                        <div className="batch-breadcrumb-content">
                            <Text
                                id="batch-breadcrumbs-remaining"
                                plural={remaining_requests_num - 1}
                                fields={{ left: remaining_requests_num - 1 }}
                            />
                        </div>
                    </li>
                )}
            </ol>
        </nav>
    );
};
