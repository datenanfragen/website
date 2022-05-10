import { render } from 'preact';
import { RequestGeneratorBuilder } from './RequestGeneratorBuilder';
import { RequestType, TransportMedium } from 'request';
import { Company } from '../types/company.d';
import { ActionButtonPlaceholder } from './Generator/ActionButton';
import { SignatureInputPlaceholder } from './Generator/SignatureInput';
import { RequestTypeChooser } from './Generator/RequestTypeChooser';
import { DynamicInputContainerPlaceholder } from './Generator/DynamicInputContainer';
import { createGeneratorStore, RequestGeneratorProvider, useGeneratorStore } from '../store/generator';

type ActWidgetProps = {
    request_types: RequestType[];
    transport_medium: TransportMedium;
    company: string | Company;
    text_before_dynamic_input_container: string;
};

export const ActWidget = (props: ActWidgetProps) => {
    const transport_medium = useGeneratorStore((state) => state.request.transport_medium);
    const setRequestType = useGeneratorStore((state) => state.setRequestType);
    const setTransportMedium = useGeneratorStore((state) => state.setTransportMedium);
    const setCompanyBySlug = useGeneratorStore((state) => state.setCompanyBySlug);
    const setCompany = useGeneratorStore((state) => state.setCompany);

    return (
        <div className="box">
            <RequestGeneratorBuilder
                onInitialized={() => {
                    if (typeof props.company === 'string') setCompanyBySlug(props.company);
                    else if (typeof props.company === 'object') setCompany(props.company);

                    setRequestType(props.request_types[0]);
                    props.transport_medium && setTransportMedium(props.transport_medium);
                }}>
                {props.request_types.length > 1 ? <RequestTypeChooser request_types={props.request_types} /> : null}

                {props.text_before_dynamic_input_container ? <p>{props.text_before_dynamic_input_container}</p> : null}

                <DynamicInputContainerPlaceholder
                    allowAddingFields={false}
                    allowRemovingFields={false}
                    allowChangingFieldDescriptions={false}
                />

                {transport_medium !== 'email' ? <SignatureInputPlaceholder /> : null}

                <div style="float: right; margin-top: 10px;">
                    <ActionButtonPlaceholder />
                </div>
                <div className="clearfix" />
            </RequestGeneratorBuilder>
        </div>
    );
};

(window as typeof window & { renderActWidget: (id?: string, props?: ActWidgetProps) => void }).renderActWidget = (
    id,
    props
) => {
    if (!props) props = (window as typeof window & { props: ActWidgetProps }).props;
    const elems = id ? [document.getElementById(id)] : document.querySelectorAll('.act-widget');
    elems.forEach(
        (el) =>
            el &&
            render(
                <RequestGeneratorProvider createStore={createGeneratorStore}>
                    <ActWidget {...props!} />
                </RequestGeneratorProvider>,
                el
            )
    );
};
