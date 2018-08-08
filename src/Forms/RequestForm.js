import preact from 'preact';
import DynamicInputContainer from "./DynamicInputContainer";
import SignatureInput from "./SignatureInput";
import { MarkupText, Text } from 'preact-i18n';
import t from '../Utility/i18n';
import {AddressControl} from "./DynamicInput";

export default class RequestForm extends preact.Component {
    constructor(props) {
        super(props);

        this.state = {
            information_block: false
        }
    }

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
                    <DynamicInputContainer key="id_data" id="id_data" onChange={this.props.onChange} fields={this.props.request_data['id_data']} title={t('id-data', 'generator')} hasPrimary={true}>
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

        if(this.props.request_data['transport_medium'] !== 'email') body.push(<SignatureInput id="signature" width={400} height={200} onChange={this.props.onChange}/>);

        let information_block = [];
        if(this.state.information_block) {
            information_block =
                (<div id="information-block-form">
                    <div className="form-group">
                        <label for="request-date"><Text id='request-date'/></label>
                        <input name="request-date" type="date" id="request-date" className="form-element"
                               onChange={e => this.props.onChange({'date': e.target.value})} value={this.props.request_data['date']} />
                    </div>
                    <textarea id="information-block" className="form-element" placeholder={t('information-block', 'generator')}
                              rows="4" spellcheck="true" onChange={e => this.props.onChange({'information_block': e.target.value})}
                              value={this.props.request_data['information_block']} />
                </div>);
        }

        return (
            <div className="request-form">
                <div>
                    <h2><Text id="request-parameters"/></h2>

                    <div className="request-type-chooser">
                        <Text id="request-type" /><br />
                        <input type="radio" id="request-type-choice-access" name="request-type" value="access" className="form-element" checked={this.props.request_data['type'] === 'access'}
                               onChange={this.props.onTypeChange} /> <label for="request-type-choice-access"><Text id="access-request"/></label>
                        <input type="radio" id="request-type-choice-erasure" name="request-type" value="erasure" className="form-element" checked={this.props.request_data['type'] === 'erasure'}
                               onChange={this.props.onTypeChange} /> <label for="request-type-choice-erasure"><Text id="erasure-request"/></label>
                        <input type="radio" id="request-type-choice-rectification" name="request-type" value="rectification" className="form-element" checked={this.props.request_data['type'] === 'rectification'}
                               onChange={this.props.onTypeChange} /> <label for="request-type-choice-rectification"><Text id="rectification-request"/></label>
                        <input type="radio" id="request-type-choice-custom" name="request-type" value="custom" className="form-element" checked={this.props.request_data['type'] === 'custom'}
                               onChange={this.props.onTypeChange} /> <label for="request-type-choice-custom"><Text id="own-request"/></label>
                    </div>

                    <div className="request-transport-medium-chooser">
                        <Text id="request-transport-medium" /><br />
                        <input type="radio" id="request-transport-medium-choice-fax" name="transport-medium" value="fax" className="form-element" checked={this.props.request_data['transport_medium'] === 'fax'}
                               onChange={this.props.onTransportMediumChange} /> <label for="request-transport-medium-choice-fax"><Text id="fax"/></label>
                        <input type="radio" id="request-transport-medium-choice-email" name="transport-medium" value="email" className="form-element" checked={this.props.request_data['transport_medium'] === 'email'}
                               onChange={this.props.onTransportMediumChange} /> <label for="request-transport-medium-choice-email"><Text id="email"/></label>
                        <input type="radio" id="request-transport-medium-choice-letter" name="transport-medium" value="letter" className="form-element" checked={this.props.request_data['transport_medium'] === 'letter'}
                               onChange={this.props.onTransportMediumChange} /> <label for="request-transport-medium-choice-letter"><Text id="letter"/></label>
                    </div>

                    <div className="form-group fancy-fg recipient-form" style="margin-top: 17px;">
                        <Text id="recipient-explanation"/><br />
                        <textarea id="request-recipient" className="form-element" placeholder={t('recipient', 'generator')} rows="4" spellcheck="false" onChange={event => {
                            this.props.onChange({'recipient_address': event.target.value});
                        }} value={this.props.request_data['recipient_address']} />
                        <label className="sr-only" for="request-recipient"><Text id="recipient"/></label>
                        <input type="hidden" id="request-template" value="default" />
                    </div>

                    {this.renderFlags()}

                </div>

                {body}

                <fieldset>
                    <legend><a href="" onClick={e => {
                        e.preventDefault();
                        this.setState({information_block: !this.state.information_block});
                    }}><Text id='information-block'/></a></legend>
                    {information_block}
                </fieldset>
            </div>
        );
    }


    renderFlags() {
        let flags = [];
        switch(this.props.request_data['type']) {
            case 'access':
                flags.push(<div className="form-group">
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
