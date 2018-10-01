import preact from 'preact';
import DynamicInputContainer from "./DynamicInputContainer";
import SignatureInput from "./SignatureInput";
import { MarkupText, Text } from 'preact-i18n';
import t from '../Utility/i18n';
import {AddressControl} from "./DynamicInput";
import Accordion from "../Components/Accordion";
import Radio from "../Components/Radio";

export default class RequestForm extends preact.Component {
    render() {
        let body = [];
        switch(this.props.request_data['type']) {
            case 'rectification':
                body.push(
                    <DynamicInputContainer key="rectification_data" id="rectification_data" title={t('rectification-data', 'generator')} fields={this.props.request_data['rectification_data']} hasPrimary={false} onChange={this.props.onChange}>
                        <MarkupText id="rectification-data-explanation" />
                    </DynamicInputContainer>
                );
            case 'erasure':
            case 'access':
                body.push(
                    <DynamicInputContainer key="id_data" id="id_data" onChange={this.props.onChange} fields={this.props.request_data['id_data']} title={t('id-data', 'generator')} hasPrimary={true} fillFields={this.props.fillFields}>
                        <MarkupText id="id-data-explanation" />
                    </DynamicInputContainer>
                );
                break;
            case 'custom':
                body.push(
                    <div>
                        <h2><Text id="own-request" /></h2>
                        <div className="form-group">
                            <label for="custom-template-select" className="sr-only"><Text id="template"/></label>
                            <select type="text" id="custom-template-select" name="template" className="form-element" placeholder={t('template', 'generator')} onChange={this.props.onLetterTemplateChange}>
                                <option value="no-template" checked={true}><Text id="no-template"/></option>
                                <option value="admonition"><Text id="admonition"/></option>
                                <option value="complaint"><Text id="complaint"/></option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label for="custom-subject-input" className="sr-only"><Text id="subject" /></label>
                            <input type="text" id="custom-subject-input" name="subject" className="form-element" placeholder={t('subject', 'generator')} onChange={this.props.onLetterChange} value={this.props.request_data.custom_data['subject']}/>
                        </div>
                        <div className="form-group">
                            <label for="custom-content-input" className="sr-only"><Text id="content"/></label>
                            <textarea type="text" id="custom-content-input" name="content" className="form-element" placeholder={t('content', 'generator')} onChange={this.props.onLetterChange} style="height: 200px;" value={this.props.request_data.custom_data['content']} />
                            <div id="tagxplanation"><MarkupText id="tagxplanation" /></div>
                        </div>
                    </div>,
                    <div>
                        <h2><Text id="sender-address" /></h2>
                        <div className="form-group fancy-fg">
                            <input type="text" id="custom-sender-name" name="name" placeholder={t('name', 'generator')} className="form-element" onChange={this.props.onLetterChange} value={this.props.request_data.custom_data['name']} />
                            <label className="fancy-label" for="custom-sender-name"><Text id="name" /></label>
                        </div>
                        <AddressControl id='0' suffix='custom-request' required={false} onChange={event => this.props.onLetterChange(event, true)} value={this.props.request_data.custom_data['sender_address']} />
                    </div>
                );
                break;
        }

        if(this.props.request_data['transport_medium'] !== 'email') body.push(<SignatureInput id="signature" width={450} height={200} onChange={this.props.onChange} value={this.props.request_data['signature']} fillSignature={this.props.fillSignature}/>);

        return (
            <div className="request-form">
                <div className="col50" style="margin-right: 20px;">
                    <div className="box" style="margin-bottom: 20px;">
                        <h2><Text id="request-parameters"/></h2>

                        <div className="request-type-chooser">
                            <Text id="request-type" /><br />
                            <div className="radio-group">
                                <Radio id="request-type-choice-access" radio_variable={this.props.request_data['type']} value="access" name="request-type"
                                       onChange={this.props.onTypeChange} label={t('access-request', 'generator')}/>
                                <Radio id="request-type-choice-erasure" radio_variable={this.props.request_data['type']} value="erasure" name="request-type"
                                       onChange={this.props.onTypeChange} label={t('erasure-request', 'generator')}/>
                                <Radio id="request-type-choice-rectification" radio_variable={this.props.request_data['type']} value="rectification" name="request-type"
                                       onChange={this.props.onTypeChange} label={t('rectification-request', 'generator')}/>
                                <Radio id="request-type-choice-custom" radio_variable={this.props.request_data['type']} value="custom" name="request-type"
                                       onChange={this.props.onTypeChange} label={t('own-request', 'generator')}/>
                            </div>
                        </div>

                        <div className="form-group fancy-fg recipient-form" style="margin-top: 17px;">
                            <Text id="recipient-explanation"/><br />
                            <textarea id="request-recipient" className="form-element" placeholder={t('recipient', 'generator')} rows="4" spellcheck="false" onChange={event => {
                                this.props.onChange({'recipient_address': event.target.value});
                            }} value={this.props.request_data['recipient_address']} />
                            <label className="sr-only" for="request-recipient"><Text id="recipient"/></label>
                            <input type="hidden" id="request-template" value="default" />
                        </div>

                        <div className="request-transport-medium-chooser">
                            <Text id="request-transport-medium" /><br />
                            <div className="radio-group">
                                <Radio id="request-transport-medium-choice-fax" radio_variable={this.props.request_data['transport_medium']} value="fax" name="transport-medium"
                                       onChange={this.props.onTransportMediumChange} label={t('fax', 'generator')}/>
                                <Radio id="request-transport-medium-choice-email" radio_variable={this.props.request_data['transport_medium']} value="email" name="transport-medium"
                                       onChange={this.props.onTransportMediumChange} label={t('email', 'generator')}/>
                                <Radio id="request-transport-medium-choice-letter" radio_variable={this.props.request_data['transport_medium']} value="letter" name="transport-medium"
                                       onChange={this.props.onTransportMediumChange} label={t('letter', 'generator')}/>
                            </div>
                        </div>

                        {this.renderFlags()}

                        <Accordion title={t('information-block', 'generator')} id="advanced-information">
                            <div id="information-block-form">
                                <div className="form-group">
                                    <label for="request-date"><Text id='request-date'/></label>
                                    <input name="request-date" type="date" id="request-date" className="form-element"
                                           onChange={e => this.props.onChange({'date': e.target.value})} value={this.props.request_data['date']} />
                                </div>
                                <div className="form-group">
                                    <label for="reference"><Text id="reference" /></label>
                                    <input name="reference" type="text" id="reference" className="form-element readonly"
                                        value={this.props.request_data['reference']} readonly />
                                </div>
                                <textarea id="information-block" className="form-element" placeholder={t('information-block', 'generator')}
                                          rows="4" spellcheck="true" onChange={e => this.props.onChange({'information_block': e.target.value})}
                                          value={this.props.request_data['information_block']} />
                            </div>
                        </Accordion>
                    </div>
                    {this.props.children}
                </div>

                <div className="col50">
                    <div className="box">
                        {body}
                    </div>
                </div>
            </div>
        );
    }


    renderFlags() {
        let flags = [];
        switch(this.props.request_data['type']) {
            case 'access':
                flags.push(<div id="data-portability" className="form-group">
                    <input type="checkbox" id="request-flags-data-portability" className="request-flags form-element" checked={this.props.request_data['data_portability']} onChange={event => {
                        this.props.onChange({'data_portability': event.target.checked});
                    }}/>
                    <label for="request-flags-data-portability"><Text id="data-portability" /></label>
                </div>);
                break;
            case 'erasure':
                flags.push(
                    <div className="form-group">
                        <input type="checkbox" id="request-flags-erase-all" className="request-flags form-element" checked={this.props.request_data['erase_all']} onChange={event => {
                            this.props.onChange({'erase_all': event.target.checked});
                        }}/>
                        <label for="request-flags-erase-all"><Text id="erase-all" /></label>
                    </div>
                );
                if(!this.props.request_data['erase_all']) flags.push(
                    <div className="form-group">
                        <textarea id="request-erasure-data" className="form-element" onChange={event => {
                            this.props.onChange({'erasure_data': event.target.value});
                        }} placeholder={t('erasure-data', 'generator')}>{this.props.request_data['erasure_data']}</textarea>
                        <label for="request-erasure-data" className="sr-only"><Text id="erasure-data" /></label>
                    </div>
                );
        }
        return flags;
    }

}
