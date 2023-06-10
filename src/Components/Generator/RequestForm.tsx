import { ComponentChildren } from 'preact';
import { DynamicInputContainer } from './DynamicInputContainer';
import { SignatureInput } from './SignatureInput';
import { MarkupText, Text, IntlProvider } from 'preact-i18n';
import t from '../../Utility/i18n';
import { Accordion } from '../Accordion';
import { RequestTypeChooser } from './RequestTypeChooser';
import { RecipientInput } from './RecipientInput';
import { TransportMediumChooser } from './TransportMediumChooser';
import { TRANSPORT_MEDIA } from '../../Utility/requests';
import { useGeneratorStore } from '../../store/generator';
import { RequestFlags } from './RequestFlags';
import { CustomRequestInput } from './CustomRequestInput';

type RequestFormProps = {
    children: ComponentChildren;
};

export const RequestForm = (props: RequestFormProps) => {
    const request_type = useGeneratorStore((state) => state.request.type);
    const transportMedium = useGeneratorStore((state) => state.request.transport_medium);
    const recipient_address = useGeneratorStore((state) => state.request.recipient_address);
    const recipient_email = useGeneratorStore((state) => state.request.email);
    const reference = useGeneratorStore((state) => state.request.reference);
    const information_block = useGeneratorStore((state) => state.request.information_block);
    const date = useGeneratorStore((state) => state.request.date);
    const signature = useGeneratorStore((state) => state.request.signature);
    const id_data = useGeneratorStore((state) => state.request.id_data);
    const isTrackingRequest = useGeneratorStore((state) => state.request.is_tracking_request);
    const rectification_data = useGeneratorStore((state) =>
        state.request.type == 'rectification' ? state.request.rectification_data : []
    );
    const current_company = useGeneratorStore((state) => state.current_company);
    const fillFields = useGeneratorStore((state) => state.fillFields);
    const fillSignature = useGeneratorStore((state) => state.fillSignature);
    const setTransportMedium = useGeneratorStore((state) => state.setTransportMedium);
    const setRecipientEmail = useGeneratorStore((state) => state.setRecipientEmail);
    const setRecipientAddress = useGeneratorStore((state) => state.setRecipientAddress);
    const setDate = useGeneratorStore((state) => state.setDate);
    const setInformationBlock = useGeneratorStore((state) => state.setInformationBlock);
    const setSignature = useGeneratorStore((state) => state.setSignature);
    const setIsTrackingRequest = useGeneratorStore((state) => state.setIsTrackingRequest);
    const setField = useGeneratorStore((state) => state.setField);
    const addField = useGeneratorStore((state) => state.addField);
    const removeField = useGeneratorStore((state) => state.removeField);

    const customTemplateField = `custom-${request_type}-template`;
    const trackingTemplateName = `${request_type}-tracking`;
    const hasNoOrTrackingTemplate =
        request_type !== 'custom' &&
        (!current_company?.[customTemplateField] || current_company[customTemplateField] === trackingTemplateName);

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
                            value={transportMedium}
                            onChange={(value) => setTransportMedium(value)}
                            media={TRANSPORT_MEDIA.filter((m) => m !== 'webform' || current_company?.webform)}
                        />

                        <RecipientInput
                            onAddressChange={(address) => setRecipientAddress(address)}
                            onEmailChange={(email) => setRecipientEmail(email)}
                            transportMedium={transportMedium}
                            recipientAddress={recipient_address}
                            email={recipient_email}
                        />

                        <RequestFlags />
                        {hasNoOrTrackingTemplate && request_type === 'access' && (
                            <label>
                                <input
                                    type="checkbox"
                                    className="form-element"
                                    checked={isTrackingRequest}
                                    onClick={(e) => setIsTrackingRequest(e.currentTarget.checked)}
                                />
                                <Text id="consider-as-tracking-company" />
                            </label>
                        )}

                        <Accordion
                            title={t('information-block', 'generator')}
                            id="advanced-information"
                            expandedInitially={false}>
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
                        {request_type === 'rectification' && (
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
                        )}

                        {request_type === 'custom' && <CustomRequestInput />}

                        <DynamicInputContainer
                            key="id_data"
                            id="id_data"
                            onAddField={(field) => addField(field, 'id_data')}
                            onRemoveField={(id) => removeField(id, 'id_data')}
                            onChange={(id, field) => setField(id, field, 'id_data')}
                            fields={id_data}
                            fieldFilter={
                                request_type === 'custom'
                                    ? (f) => f.type === 'name' || (transportMedium !== 'email' && f.type === 'address')
                                    : undefined
                            }
                            title={t(
                                request_type === 'custom'
                                    ? 'sender-address'
                                    : isTrackingRequest
                                    ? 'id-data-tracking'
                                    : 'id-data',
                                'generator'
                            )}
                            hasPrimary={true}
                            fillFields={fillFields}
                            allowAddingFields={request_type !== 'custom'}
                            allowChangingFieldDescriptions={request_type !== 'custom'}
                            allowRemovingFields={request_type !== 'custom'}
                            headingClass={request_type === 'rectification' ? 'has-margin' : ''}>
                            {request_type !== 'custom' && (
                                <MarkupText
                                    id={isTrackingRequest ? 'id-data-tracking-explanation' : 'id-data-explanation'}
                                />
                            )}
                        </DynamicInputContainer>

                        {(transportMedium === 'fax' || transportMedium === 'letter') && (
                            <SignatureInput
                                id="signature"
                                width={428}
                                height={190}
                                onChange={setSignature}
                                value={signature}
                                fillSignature={fillSignature}
                            />
                        )}
                    </div>
                </div>
            </div>
        </IntlProvider>
    );
};
