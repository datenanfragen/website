import { render } from 'preact';
import { createGeneratorStore, RequestGeneratorProvider, useGeneratorStore } from '../store/generator';
import type { Company } from '../types/company';
import type { RequestType, TransportMedium } from '../types/request';
import { ActionButton } from './Generator/ActionButton';
import { StatefulDynamicInputContainer } from './Generator/DynamicInputContainer';
import { RequestTypeChooser } from './Generator/RequestTypeChooser';
import { StatefulSignatureInput } from './Generator/SignatureInput';
import { RequestGeneratorBuilder } from './RequestGeneratorBuilder';

type ActWidgetProps = {
    requestTypes: RequestType[];
    transportMedium: TransportMedium;
    company: string | Company;
    textBeforeDynamicInputContainer: string;
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

                    setRequestType(props.requestTypes[0]);
                    if (props.transportMedium) setTransportMedium(props.transportMedium);
                }}>
                {props.requestTypes.length > 1 && <RequestTypeChooser request_types={props.requestTypes} />}

                {props.textBeforeDynamicInputContainer && <p>{props.textBeforeDynamicInputContainer}</p>}

                <StatefulDynamicInputContainer
                    allowAddingFields={false}
                    allowRemovingFields={false}
                    allowChangingFieldDescriptions={false}
                />

                {transport_medium !== 'email' && <StatefulSignatureInput />}

                <div style="float: right; margin-top: 10px;">
                    <ActionButton />
                </div>
                <div className="clearfix" />
            </RequestGeneratorBuilder>
        </div>
    );
};

(window as typeof window & { renderActWidget: (props: ActWidgetProps, id?: string) => void }).renderActWidget = (
    props,
    id
) => {
    const elems = id ? [document.getElementById(id)] : document.querySelectorAll('.act-widget');
    elems.forEach(
        (el) =>
            el &&
            render(
                <RequestGeneratorProvider createStore={createGeneratorStore}>
                    <ActWidget {...props} />
                </RequestGeneratorProvider>,
                el
            )
    );
};
