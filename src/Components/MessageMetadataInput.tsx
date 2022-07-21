import type { Message } from '../types/proceedings';
import { TransportMediumChooser } from './Generator/TransportMediumChooser';
import { Radio } from './Radio';
import { Text } from 'preact-i18n';
import t from '../Utility/i18n';

type MessageMetadataInputProps = {
    message: Omit<Message, 'id'>;
    includeContent?: boolean;
    idSuffix?: string;
    onChange: (message: Omit<Message, 'id'>) => void;
};

export const MessageMetadataInput = (props: MessageMetadataInputProps) => {
    return (
        <div className="message-metadata-input">
            <div className="form-group">
                <label htmlFor={`message-metatdata-input-date${props.idSuffix ? '-' + props.idSuffix : ''}`}>
                    <Text id="date" />
                </label>
                <input
                    id={`message-metatdata-input-date${props.idSuffix ? '-' + props.idSuffix : ''}`}
                    type="date"
                    className="form-element"
                    value={props.message.date.toISOString().split('T')[0]}
                    onChange={(e) => props.onChange({ ...props.message, date: new Date(e.currentTarget.value) })}
                />
            </div>
            <div className="form-group">
                <TransportMediumChooser
                    value={props.message.transport_medium}
                    onChange={(transport_medium) => props.onChange({ ...props.message, transport_medium })}
                    label={t('transport-medium-input-label', 'my-requests')}
                />
            </div>
            <div className="form-group">
                <label htmlFor={`message-metatdata-input-subject${props.idSuffix ? '-' + props.idSuffix : ''}`}>
                    <Text id="subject" />
                </label>
                <input
                    id={`message-metatdata-input-subject${props.idSuffix ? '-' + props.idSuffix : ''}`}
                    type="text"
                    className="form-element"
                    value={props.message.subject}
                    onChange={(e) => props.onChange({ ...props.message, subject: e.currentTarget.value })}
                />
            </div>
            {props.includeContent && (
                <div className="form-group">
                    <label htmlFor={`message-metatdata-input-content${props.idSuffix ? '-' + props.idSuffix : ''}`}>
                        <Text id="content" />
                    </label>
                    <textarea
                        id={`message-metatdata-input-content${props.idSuffix ? '-' + props.idSuffix : ''}`}
                        className="form-element"
                        placeholder={t('content-placeholder', 'my-requests')}
                        value={props.message.content}
                        onChange={(e) => props.onChange({ ...props.message, content: e.currentTarget.value })}
                    />
                </div>
            )}
            <fieldset className="form-group label-only-fieldset">
                <legend>
                    <Text id="sender-direction-label" />
                </legend>
                <div className="radio-group">
                    {(['by-me', 'by-someone-else'] as const).map((v) => (
                        <Radio
                            id={`message-metatdata-input-sentByMe-${v}${props.idSuffix ? '-' + props.idSuffix : ''}`}
                            radioVariable={props.message.sentByMe ? 'by-me' : 'by-someone-else'}
                            value={v}
                            name="sentByMe"
                            onChange={(value) => props.onChange({ ...props.message, sentByMe: value === 'by-me' })}
                            label={
                                <span className={`icon icon-${v === 'by-me' ? 'person' : 'factory'}`}>
                                    <Text id={`radio-sent-${v}`} />
                                </span>
                            }
                        />
                    ))}
                </div>
            </fieldset>

            <fieldset>
                <legend>
                    <Text id={`${props.message.sentByMe ? 'recipient' : 'sender'}-information`} />
                </legend>
                <div className="form-group">
                    <label
                        htmlFor={`message-metatdata-input-correspondent-email${
                            props.idSuffix ? '-' + props.idSuffix : ''
                        }`}>
                        <Text id="correspondent-email" />
                    </label>
                    <input
                        id={`message-metatdata-input-subject${props.idSuffix ? '-' + props.idSuffix : ''}`}
                        type="text"
                        className="form-element"
                        value={props.message.correspondent_email}
                        onChange={(e) => props.onChange({ ...props.message, subject: e.currentTarget.value })}
                    />
                </div>
                <div className="form-group">
                    <label
                        htmlFor={`message-metatdata-input-correspondent-address${
                            props.idSuffix ? '-' + props.idSuffix : ''
                        }`}>
                        <Text id="correspondent-address" />
                    </label>
                    <textarea
                        id={`message-metatdata-input-correspondent-address${
                            props.idSuffix ? '-' + props.idSuffix : ''
                        }`}
                        className="form-element"
                        value={props.message.correspondent_address}
                        onChange={(e) => props.onChange({ ...props.message, content: e.currentTarget.value })}
                    />
                </div>
            </fieldset>
        </div>
    );
};
