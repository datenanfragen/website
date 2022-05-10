import { Component, ComponentChildren, JSX } from 'preact';
import { DynamicInputContainer } from './DynamicInputContainer';
import { SignatureInput } from './SignatureInput';
import { MarkupText, Text, IntlProvider } from 'preact-i18n';
import t from '../../Utility/i18n';
import { AddressControl } from './DynamicInput';
import Accordion from '../Accordion';
import { RequestTypeChooser } from './RequestTypeChooser';
import RecipientInput from './RecipientInput';
import TransportMediumChooser from './TransportMediumChooser';
import { IdDataElement, RequestType, Signature } from 'request';
import { useGeneratorStore } from '../../store/generator';
import RequestFlags from './RequestFlags';
import { CustomRequestInput } from './CustomRequestInput';

type RequestFormProps = {
    children: ComponentChildren;
};

export const RequestForm = (props: RequestFormProps) => {
    const request_type = useGeneratorStore((state) => state.request.type);
    const transport_medium = useGeneratorStore((state) => state.request.transport_medium);
    const recipient_address = useGeneratorStore((state) => state.request.recipient_address);
    const recipient_email = useGeneratorStore((state) => state.request.email);
    const reference = useGeneratorStore((state) => state.request.reference);
    const information_block = useGeneratorStore((state) => state.request.information_block);
    const date = useGeneratorStore((state) => state.request.date);
    const signature = useGeneratorStore((state) => state.request.signature);
    const id_data = useGeneratorStore((state) => state.request.id_data);
    const is_tracking_request = useGeneratorStore((state) => state.request.is_tracking_request);
    const rectification_data = useGeneratorStore((state) =>
        state.request.type == 'rectification' ? state.request.rectification_data : []
    );
    const fillFields = useGeneratorStore((state) => state.fillFields);
    const fillSignature = useGeneratorStore((state) => state.fillSignature);
    const setTransportMedium = useGeneratorStore((state) => state.setTransportMedium);
    const setRecipientEmail = useGeneratorStore((state) => state.setRecipientEmail);
    const setRecipientAddress = useGeneratorStore((state) => state.setRecipientAddress);
    const setDate = useGeneratorStore((state) => state.setDate);
    const setInformationBlock = useGeneratorStore((state) => state.setInformationBlock);
    const setSignature = useGeneratorStore((state) => state.setSignature);
    const setField = useGeneratorStore((state) => state.setField);
    const addField = useGeneratorStore((state) => state.addField);
    const removeField = useGeneratorStore((state) => state.removeField);

    let body = [];
    let heading_class = '';
    switch (request_type) {
        case 'rectification':
            body.push(
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
            );
            heading_class = 'has-margin';
        // fallthrough intentional
        case 'erasure':
        case 'objection':
        case 'access':
            body.push(
                <DynamicInputContainer
                    key="id_data"
                    id="id_data"
                    onAddField={(field) => addField(field, 'id_data')}
                    onRemoveField={(id) => removeField(id, 'id_data')}
                    onChange={(id, field) => setField(id, field, 'id_data')}
                    fields={id_data}
                    title={t(is_tracking_request ? 'id-data-tracking' : 'id-data', 'generator')}
                    hasPrimary={true}
                    fillFields={fillFields}
                    allowAddingFields={true}
                    headingClass={heading_class}>
                    <MarkupText id={is_tracking_request ? 'id-data-tracking-explanation' : 'id-data-explanation'} />
                </DynamicInputContainer>
            );
            break;
        case 'custom':
            body = [<CustomRequestInput />];
    }

    return (
        <IntlProvider scope="generator" definition={window.I18N_DEFINITION}>
            <div className="request-form">
                <div className="col50" style="margin-right: 20px;">
                    <div className="request-parameters box" style="margin-bottom: 20px;">
                        <h2>
                            <Text id="request-parameters" />
                        </h2>
                        <RequestTypeChooser />

                        <TransportMediumChooser
                            transportMedium={transport_medium}
                            onChange={(value) => {
                                setTransportMedium(value);
                            }}
                        />

                        <RecipientInput
                            onAddressChange={(address) => setRecipientAddress(address)}
                            onEmailChange={(email) => setRecipientEmail(email)}
                            transportMedium={transport_medium}
                            recipientAddress={recipient_address}
                            email={recipient_email}
                        />

                        <RequestFlags />

                        <Accordion
                            title={t('information-block', 'generator')}
                            id="advanced-information"
                            expanded={false}>
                            <div id="information-block-form">
                                <div className="form-group">
                                    <label htmlFor="request-date">
                                        <Text id="request-date" />
                                    </label>
                                    <input
                                        name="request-date"
                                        type="date"
                                        id="request-date"
                                        className="form-element"
                                        onChange={(e) => setDate(e.currentTarget.value)}
                                        onBlur={(e) =>
                                            !e.currentTarget.value && setDate(new Date().toISOString().substring(0, 10))
                                        }
                                        value={date}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="reference">
                                        <Text id="reference" />
                                    </label>
                                    <input
                                        name="reference"
                                        type="text"
                                        id="reference"
                                        className="form-element readonly"
                                        value={reference}
                                        readOnly
                                    />
                                </div>
                                <textarea
                                    id="information-block"
                                    className="form-element"
                                    placeholder={t('information-block', 'generator')}
                                    rows={4}
                                    spellCheck={true}
                                    onChange={(e) => setInformationBlock(e.currentTarget.value)}
                                    value={information_block}
                                />
                            </div>
                        </Accordion>
                    </div>
                    {props.children}
                </div>

                <div className="col50">
                    <div className="box">
                        {body}

                        {transport_medium !== 'email' ? (
                            <SignatureInput
                                id="signature"
                                width={428}
                                height={190}
                                onChange={setSignature}
                                value={signature}
                                fillSignature={fillSignature}
                            />
                        ) : null}
                    </div>
                </div>
            </div>
        </IntlProvider>
    );
};
