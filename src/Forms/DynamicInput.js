import preact from 'preact';

export default class DynamicInput extends preact.Component {
    constructor(props) {
        super(props);
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
                        <button id={this.props.id + '-primaryButton'} rel={this.props.id} className="dynamic-input-primaryButton"
                                data-isprimary={this.props.value['primary']} onClick={this.props.onPrimaryChange}>Hauptadresse</button>
                    </div>
                );
                break;
            case 'textarea':
                input = <TextareaControl key={this.props.id + this.props.suffix} id={this.props.id}
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
                        <div style="display: table-cell">
                            <button id={this.props.id + '-delete-' + this.props.suffix} rel={this.props.id}
                                    className="dynamic-input-delete" onClick={this.props.removeHandler}>
                                <img src="/img/trash.svg" style="height: 16px;" />
                            </button>
                        </div>
                        <div style="display: table-cell;">
                            <label for={this.props.id + '-desc-' + this.props.suffix} className="sr-only">Beschreibung</label>
                            <input key={this.props.id + this.props.suffix} type="text" id={this.props.id + '-desc-' + this.props.suffix}
                                   className="form-element" value={this.props.desc} placeholder="Beschreibung" style="margin-left: 5px;" required onChange={this.props.onChange} />
                        </div>
                    </div>
                    {control}
                </div>
                <div className="col60">
                    <div style="padding-left: 10px;">{input}</div>
                </div>
                <div className="clearfix" />
            </div>
        );
    }
}

export class TextareaControl extends preact.Component {
    render() {
        return (
            <div className="form-group">
                <label for={this.props.id + '-value-' + this.props.suffix} className="sr-only">{this.props.desc}</label>
                <textarea key={this.props.id + this.props.suffix} id={this.props.id + '-value-' + this.props.suffix}
                          className="form-element" placeholder="Wert" required={this.props.required} onChange={this.props.onChange}>
                    {this.props.value}
                </textarea>
            </div>
        );
    }
}

export class InputControl extends preact.Component {
    render() {
        return (
            <div className="form-group">
                <label for={this.props.id + '-value-' + this.props.suffix} className="sr-only">{this.props.desc}</label>
                <input key={this.props.id + this.props.suffix} type="text" id={this.props.id + '-value-' + this.props.suffix}
                       className="form-element" placeholder="Wert" required={this.props.required} onChange={this.props.onChange} value={this.props.value}/>
            </div>
        );
    }
}

export class AddressControl extends preact.Component {
    render() {
        return (
            <div>
                <div className="form-group fancy-fg">
                    <input key={this.props.id + '-street_1-' + this.props.suffix} type="text" id={this.props.id + '-street_1-' + this.props.suffix}
                           placeholder="Adresszeile 1" className="form-element" required={this.props.required} onChange={this.props.onChange} value={this.props.value['street_1']} />
                    <label className="fancy-label" for={this.props.id + '-street_1-' + this.props.suffix}>Adresszeile 1</label>
                </div>
                <div className="form-group fancy-fg">
                    <input key={this.props.id + '-street_2-' + this.props.suffix} type="text" id={this.props.id + '-street_2-' + this.props.suffix}
                           placeholder="Adresszeile 2" className="form-element" onChange={this.props.onChange} value={this.props.value['street_2']} />
                    <label className="fancy-label" for={this.props.id + '-street_2-' + this.props.suffix}>Adresszeile 2</label>
                </div>
                <div className="form-group fancy-fg">
                    <input key={this.props.id + '-place-' + this.props.suffix} type="text" id={this.props.id + '-place-' + this.props.suffix}
                           placeholder="Ort" className="form-element" required={this.props.required} onChange={this.props.onChange} value={this.props.value['place']} />
                    <label className="fancy-label" for={this.props.id + '-place-' + this.props.suffix}>Ort</label>
                </div>
                <div className="form-group fancy-fg">
                    <input key={this.props.id + '-country-' + this.props.suffix} type="text" id={this.props.id + '-country-' + this.props.suffix}
                           placeholder="Land" className="form-element" onChange={this.props.onChange} value={this.props.value['country']} />
                    <label className="fancy-label" for={this.props.id + '-country-' + this.props.suffix}>Land</label>
                </div>
                <input key={this.props.id + '-primary-' + this.props.suffix} type="hidden" id={this.props.id + '-primary-' + this.props.suffix}
                       className="dynamic-input-primary form-element" value={this.props.value['primary']} onChange={this.props.onChange} />
            </div>
        );
    }
}
