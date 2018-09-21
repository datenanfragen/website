import preact from 'preact';
import { Text } from 'preact-i18n';
import t from '../Utility/i18n';

export default class DynamicInput extends preact.Component {
    constructor(props) {
        super(props);
        this.state = {focus: false};
    }

    shouldComponentUpdate(nextProps) {
        return !this.state.focus && nextProps !== this.props;
    }

    render() {
        let input = '';
        let control = '';
        switch (this.props.type) {
            case 'address':
                input = <AddressControl key={this.props.id + this.props.suffix} id={this.props.id} suffix={this.props.suffix}
                                        required={!this.props.optional} onChange={this.props.onChange} value={this.props.value} />;
                if(this.props.hasPrimary) control = (
                    <div class="col50">
                        <button id={this.props.id + '-primaryButton'} name="primary_button" rel={this.props.id} className="dynamic-input-primaryButton"
                                data-isprimary={this.props.value['primary']} onClick={this.props.onPrimaryChange}><Text id="primary-address" /></button>
                    </div>
                );
                break;
            case 'textarea':
                input = <TextareaControl key={this.props.id + this.props.suffix} id={this.props.id}
                                         suffix={this.props.suffix} required={!this.props.optional} onChange={this.props.onChange} value={this.props.value} />;
                break;
            case 'birthdate':
                input = <DateControl key={this.props.id + this.props.suffix} id={this.props.id}
                                      suffix={this.props.suffix} required={!this.props.optional} onChange={this.props.onChange} value={this.props.value} />;
                break;
            case 'name':
            case 'input':
            default:
                input = <InputControl key={this.props.id + this.props.suffix} id={this.props.id}
                                      suffix={this.props.suffix} required={!this.props.optional} onChange={this.props.onChange} value={this.props.value} />;
                break;
        }
        return (
            <div className="dynamic-input dynamic-input-textarea" id={'dynamic-input-' + this.props.id + '-' + this.props.suffix}>
                <div className="col40">
                    <div className="form-group" style="width: 100%; display: table;">
                        <div style="display: table-cell; width: 27px;">
                            <button id={this.props.id + '-delete-' + this.props.suffix} rel={this.props.id}
                                    className="dynamic-input-delete button-primary button-small icon-trash" onClick={this.props.removeHandler} />
                        </div>
                        <div style="display: table-cell;">
                            <label for={this.props.id + '-desc-' + this.props.suffix} className="sr-only"><Text id="description" /></label>
                            <input key={this.props.id + this.props.suffix} name="desc" type="text" id={this.props.id + '-desc-' + this.props.suffix} rel={this.props.id}
                                   className="form-element" value={this.props.desc} placeholder={t('description', 'generator')} style="margin-left: 5px;" required onChange={this.props.onChange}
                                   onFocus={(e) => {this.setState({focus: true});}} onBlur={(e) => {this.setState({focus: false});}}
                            />
                        </div>
                    </div>
                    {control}
                </div>
                <div className="col60">
                    <div style="padding-left: 10px;" className={"form-group" + (this.props.onAction ? " action-button-container" : "")}>
                        {input}
                        {this.props.onAction ? <button id={this.props.id + '-action-' + this.props.suffix} rel={this.props.id}
                                className="dynamic-input-action button-primary button-small icon-arrow-right" onClick={this.props.onAction}/> : []}
                    </div>

                </div>
                <div className="clearfix" />
            </div>
        );
    }
}

export class TextareaControl extends preact.Component {
    constructor(props) {
        super(props);
        this.state = {focus: false};
    }

    shouldComponentUpdate(nextProps) {
        return !this.state.focus && nextProps !== this.props;
    }

    render() {
        return (
            <div className="form-group">
                <label for={this.props.id + '-value-' + this.props.suffix} className="sr-only">{this.props.desc}</label>
                <textarea key={this.props.id + this.props.suffix} name="value" id={this.props.id + this.props.suffix} rel={this.props.id}
                          className="form-element" placeholder={t('value', 'generator')} required={this.props.required} onChange={this.props.onChange}
                          onFocus={(e) => {this.setState({focus: true});}} onBlur={(e) => {this.setState({focus: false});}} value={this.props.value}
                />
            </div>
        );
    }
}

export class InputControl extends preact.Component {
    constructor(props) {
        super(props);
        this.state = {focus: false};
    }

    shouldComponentUpdate(nextProps) {
        return !this.state.focus && nextProps !== this.props;
    }

    render() {
        return (
            <div className="form-group">
                <label for={this.props.id + '-value-' + this.props.suffix} className="sr-only">{this.props.desc}</label>
                <input key={this.props.id + this.props.suffix} name="value" type="text" id={this.props.id + '-value-' + this.props.suffix} rel={this.props.id}
                       className="form-element" placeholder={t('value', 'generator')} required={this.props.required} onChange={this.props.onChange}
                       onFocus={(e) => {this.setState({focus: true});}} onBlur={(e) => {this.setState({focus: false});}} value={this.props.value}
                />
            </div>
        );
    }
}

export class DateControl extends preact.Component {
    constructor(props) {
        super(props);
        this.state = {focus: false};
    }

    shouldComponentUpdate(nextProps) {
        return !this.state.focus && nextProps !== this.props;
    }

    render() {
        return (
            <div className="form-group">
                <label for={this.props.id + '-value-' + this.props.suffix} className="sr-only">{this.props.desc}</label>
                <input key={this.props.id + this.props.suffix} name="value" type="date" id={this.props.id + '-value-' + this.props.suffix} rel={this.props.id}
                       className="form-element" placeholder={t('value', 'generator')} required={this.props.required} onChange={this.props.onChange}
                       onFocus={(e) => {this.setState({focus: true});}} onBlur={(e) => {this.setState({focus: false});}} value={this.props.value}
                />
            </div>
        );
    }
}

export class AddressControl extends preact.Component {
    constructor(props) {
        super(props);
        this.state = {focus: false};
    }

    shouldComponentUpdate(nextProps) {
        return !this.state.focus && nextProps !== this.props;
    }

    render() {
        return (
            <div>
                <div className="form-group fancy-fg">
                    <input key={this.props.id + '-street_1-' + this.props.suffix} name="street_1" rel={this.props.id} type="text" id={this.props.id + '-street_1-' + this.props.suffix}
                           placeholder={t('address-line-1', 'generator')} className="form-element" required={this.props.required} onChange={this.props.onChange}
                           onFocus={(e) => {this.setState({focus: true});}} onBlur={(e) => {this.setState({focus: false});}} value={this.props.value['street_1']} />
                    <label className="fancy-label" for={this.props.id + '-street_1-' + this.props.suffix}><Text id="address-line-1" /></label>
                </div>
                <div className="form-group fancy-fg">
                    <input key={this.props.id + '-street_2-' + this.props.suffix} name="street_2" rel={this.props.id} type="text" id={this.props.id + '-street_2-' + this.props.suffix}
                           placeholder={t('address-line-2', 'generator')} className="form-element" onChange={this.props.onChange}
                           onFocus={(e) => {this.setState({focus: true});}} onBlur={(e) => {this.setState({focus: false});}} value={this.props.value['street_2']} />
                    <label className="fancy-label" for={this.props.id + '-street_2-' + this.props.suffix}><Text id="address-line-2" /></label>
                </div>
                <div className="form-group fancy-fg">
                    <input key={this.props.id + '-place-' + this.props.suffix} name="place" rel={this.props.id} type="text" id={this.props.id + '-place-' + this.props.suffix}
                           placeholder={t('address-place', 'generator')} className="form-element" required={this.props.required} onChange={this.props.onChange}
                           onFocus={(e) => {this.setState({focus: true});}} onBlur={(e) => {this.setState({focus: false});}} value={this.props.value['place']} />
                    <label className="fancy-label" for={this.props.id + '-place-' + this.props.suffix}><Text id="address-place" /></label>
                </div>
                <div className="form-group fancy-fg">
                    <input key={this.props.id + '-country-' + this.props.suffix} name="country" rel={this.props.id} type="text" id={this.props.id + '-country-' + this.props.suffix}
                           placeholder={t('address-country', 'generator')} className="form-element" onChange={this.props.onChange}
                           onFocus={(e) => {this.setState({focus: true});}} onBlur={(e) => {this.setState({focus: false});}} value={this.props.value['country']} />
                    <label className="fancy-label" for={this.props.id + '-country-' + this.props.suffix}><Text id="address-country" /></label>
                </div>
                <input key={this.props.id + '-primary-' + this.props.suffix} name="primary" rel={this.props.id} type="hidden" id={this.props.id + '-primary-' + this.props.suffix}
                       className="dynamic-input-primary form-element" value={this.props.value['primary']} onChange={this.props.onChange} />
            </div>
        );
    }
}
