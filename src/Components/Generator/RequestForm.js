import { Component } from 'preact';
import DynamicInputContainer from './DynamicInputContainer';
import SignatureInput from './SignatureInput';
import { MarkupText, Text, IntlProvider } from 'preact-i18n';
import t from '../../Utility/i18n';
import { AddressControl } from './DynamicInput';
import Accordion from '../Accordion';
import RequestTypeChooser from './RequestTypeChooser';
import RecipientInput from './RecipientInput';
import TransportMediumChooser from './TransportMediumChooser';
import PropTypes from 'prop-types';

export default class RequestForm extends Component {
    render() {
        let body = [];
        let heading_class = '';
        switch (this.props.request_data['type']) {
            case 'rectification':
                body.push(
                    <DynamicInputContainer
                        key="rectification_data"
                        id="rectification_data"
                        title={t('rectification-data', 'generator')}
                        fields={this.props.request_data['rectification_data']}
                        hasPrimary={false}
                        onAddField={this.props.onAddField}
                        onRemoveField={this.props.onRemoveField}
                        onSetPrimaryAddress={this.props.onSetPrimaryAddress}
                        onChange={this.props.onInputChange}>
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
                        onAddField={this.props.onAddField}
                        onRemoveField={this.props.onRemoveField}
                        onSetPrimaryAddress={this.props.onSetPrimaryAddress}
                        onChange={this.props.onInputChange}
                        fields={this.props.request_data['id_data']}
                        title={t(
                            this.props.request_data.is_tracking_request ? 'id-data-tracking' : 'id-data',
                            'generator'
                        )}
                        hasPrimary={true}
                        fillFields={this.props.fillFields}
                        heading_class={heading_class}>
                        <MarkupText
                            id={
                                this.props.request_data.is_tracking_request
                                    ? 'id-data-tracking-explanation'
                                    : 'id-data-explanation'
                            }
                        />
                    </DynamicInputContainer>
                );
                break;
            case 'custom':
                body.push(
                    <div>
                        <h2>
                            <Text id="own-request" />
                        </h2>
                        <div className="form-group">
                            <label htmlFor="custom-template-select" className="sr-only">
                                <Text id="template" />
                            </label>
                            <div className="select-container" style="width: initial;">
                                <select
                                    type="text"
                                    id="custom-template-select"
                                    name="template"
                                    className="form-element"
                                    placeholder={t('template', 'generator')}
                                    onBlur={this.props.onLetterTemplateChange}
                                    onChange={this.props.onLetterTemplateChange}>
                                    <option value="no-template" checked={true}>
                                        <Text id="no-template" />
                                    </option>
                                    <option value="admonition">
                                        <Text id="admonition" />
                                    </option>
                                    <option value="complaint">
                                        <Text id="complaint" />
                                    </option>
                                </select>
                                <div className="icon icon-arrow-down" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="custom-subject-input" className="sr-only">
                                <Text id="subject" />
                            </label>
                            <input
                                type="text"
                                id="custom-subject-input"
                                name="subject"
                                className="form-element"
                                placeholder={t('subject', 'generator')}
                                onChange={this.props.onLetterChange}
                                value={this.props.request_data.custom_data['subject']}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="custom-content-input" className="sr-only">
                                <Text id="content" />
                            </label>
                            <textarea
                                type="text"
                                id="custom-content-input"
                                name="content"
                                className="form-element"
                                placeholder={t('content', 'generator')}
                                onChange={this.props.onLetterChange}
                                style="height: 200px;"
                                value={this.props.request_data.custom_data['content']}
                            />
                            <div id="tagxplanation">
                                <MarkupText id="tagxplanation" />
                            </div>
                        </div>
                    </div>,
                    <div>
                        <h2 className="has-margin">
                            <Text id="sender-address" />
                        </h2>
                        <div className="form-group fancy-fg">
                            <input
                                type="text"
                                id="custom-sender-name"
                                name="name"
                                placeholder={t('name', 'generator')}
                                className="form-element"
                                onChange={this.props.onLetterChange}
                                value={this.props.request_data.custom_data['name']}
                            />
                            <label className="fancy-label" htmlFor="custom-sender-name">
                                <Text id="name" />
                            </label>
                        </div>
                        <AddressControl
                            id="0"
                            suffix="custom-request"
                            required={false}
                            onChange={(event) => this.props.onLetterChange(event, true)}
                            value={this.props.request_data.custom_data['sender_address']}
                        />
                    </div>
                );
                break;
        }

        if (this.props.request_data['transport_medium'] !== 'email')
            body.push(
                <SignatureInput
                    id="signature"
                    width={428}
                    height={190}
                    onChange={this.props.onChange}
                    value={this.props.request_data['signature']}
                    fillSignature={this.props.fillSignature}
                />
            );

        return (
            <IntlProvider scope="generator" definition={I18N_DEFINITION}>
                <div className="request-form">
                    <div className="col50" style="margin-right: 20px;">
                        <div className="request-parameters box" style="margin-bottom: 20px;">
                            <h2>
                                <Text id="request-parameters" />
                            </h2>
                            <RequestTypeChooser
                                onTypeChange={this.props.onTypeChange}
                                current={this.props.request_data['type']}
                            />

                            <TransportMediumChooser
                                transportMedium={this.props.request_data.transport_medium}
                                onChange={this.props.onTransportMediumChange}
                            />

                            <RecipientInput
                                onAddressChange={(e) => this.props.onChange({ recipient_address: e.target.value })}
                                onEmailChange={(e) => this.props.onChange({ email: e.target.value })}
                                transportMedium={this.props.request_data.transport_medium}
                                recipientAddress={this.props.request_data.recipient_address}
                                email={this.props.request_data.email}
                            />

                            {this.renderFlags()}
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
                                            onChange={(e) => this.props.onChange({ date: e.target.value })}
                                            onBlur={(e) =>
                                                !e.target.value &&
                                                this.props.onChange({ date: new Date().toISOString().substring(0, 10) })
                                            }
                                            value={this.props.request_data['date']}
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
                                            value={this.props.request_data['reference']}
                                            readOnly
                                        />
                                    </div>
                                    <textarea
                                        id="information-block"
                                        className="form-element"
                                        placeholder={t('information-block', 'generator')}
                                        rows="4"
                                        spellCheck="true"
                                        onChange={(e) => this.props.onChange({ information_block: e.target.value })}
                                        value={this.props.request_data['information_block']}
                                    />
                                </div>
                            </Accordion>
                        </div>
                        {this.props.children}
                    </div>

                    <div className="col50">
                        <div className="box">{body}</div>
                    </div>
                </div>
            </IntlProvider>
        );
    }

    renderFlags() {
        let flags = [];
        switch (this.props.request_data['type']) {
            case 'access':
                flags.push(
                    <div id="data-portability" className="form-group">
                        <input
                            type="checkbox"
                            id="request-flags-data-portability"
                            className="request-flags form-element"
                            checked={this.props.request_data['data_portability']}
                            onChange={(event) => {
                                this.props.onChange({ data_portability: event.target.checked });
                            }}
                        />
                        <label htmlFor="request-flags-data-portability">
                            <Text id="data-portability" />
                        </label>
                    </div>
                );
                break;
            case 'erasure':
                flags.push(
                    <div className="form-group">
                        <input
                            type="checkbox"
                            id="request-flags-erase-all"
                            className="request-flags form-element"
                            checked={this.props.request_data['erase_all']}
                            onChange={(event) => {
                                this.props.onChange({ erase_all: event.target.checked });
                            }}
                        />
                        <label htmlFor="request-flags-erase-all">
                            <Text id="erase-all" />
                        </label>
                    </div>
                );
                if (!this.props.request_data['erase_all'])
                    flags.push(
                        <div className="form-group">
                            <textarea
                                id="request-erasure-data"
                                className="form-element"
                                onChange={(event) => {
                                    this.props.onChange({ erasure_data: event.target.value });
                                }}
                                placeholder={t('erasure-data', 'generator')}>
                                {this.props.request_data['erasure_data']}
                            </textarea>
                            <label htmlFor="request-erasure-data" className="sr-only">
                                <Text id="erasure-data" />
                            </label>
                        </div>
                    );
        }
        return flags;
    }

    static propTypes = {
        request_data: PropTypes.object.isRequired,

        fillSignature: PropTypes.object,
        fillFields: PropTypes.arrayOf(PropTypes.object),

        onAddField: PropTypes.func.isRequired,
        onRemoveField: PropTypes.func.isRequired,
        onSetPrimaryAddress: PropTypes.func.isRequired,
        onInputChange: PropTypes.func.isRequired,
        onChange: PropTypes.func.isRequired,
        onTypeChange: PropTypes.func.isRequired,
        onLetterChange: PropTypes.func.isRequired,
        onTransportMediumChange: PropTypes.func.isRequired,
        onLetterTemplateChange: PropTypes.func.isRequired,

        children: PropTypes.node.isRequired,
    };
}
