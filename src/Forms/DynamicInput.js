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
                input = <AddressControl key={this.props.id} id={this.props.id} required={!this.props.optional} onChange={this.props.onChange} primary={this.props.primary} />;
                control = (
                    <div class="col50">
                        <button id={this.props.id + '-primaryButton'} rel={this.props.id} className="dynamic-input-primaryButton" data-isprimary={this.props.primary} onClick={this.props.onPrimaryChange}>Hauptadresse</button>
                    </div>
                );
                break;
            case 'textarea':
                input = <TextareaControl key={this.props.id} id={this.props.id} required={!this.props.optional} onChange={this.props.onChange} />;
                break;
            case 'name':
            case 'input':
            default:
                input = <InputControl key={this.props.id} id={this.props.id} required={!this.props.optional} onChange={this.props.onChange} />;
                break;
        }
        return (
            <div className="dynamic-input dynamic-input-textarea" id={'dynamic-input-' + this.props.id}>
                <div className="col40">
                    <div className="form-group" style="width: 100%; display: table;">
                        <div style="display: table-cell">
                            <button id={this.props.id + '-delete'} rel={this.props.id} className="dynamic-input-delete" onClick={this.props.removeHandler}>
                                <img src="/img/trash.svg" style="height: 16px;" />
                            </button>
                        </div>
                        <div style="display: table-cell;">
                            <label for={this.props.id + '-desc'} className="sr-only">Beschreibung</label>
                            <input key={this.props.id} type="text" id={this.props.id + '-desc'} className="form-element" value={this.props.desc} placeholder="Beschreibung" style="margin-left: 5px;" required onChange={this.props.onChange} />
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
                <label for={this.props.id + '-value'} className="sr-only">{this.props.desc}</label>
                <textarea key={this.props.id} id={this.props.id + '-value'} className="form-element" placeholder="Wert" required={this.props.required} onChange={this.props.onChange} />
            </div>
        );
    }
}

export class InputControl extends preact.Component {
    render() {
        return (
            <div className="form-group">
                <label for={this.props.id + '-value'} className="sr-only">{this.props.desc}</label>
                <input key={this.props.id} type="text" id={this.props.id + '-value'} className="form-element" placeholder="Wert" required={this.props.required} onChange={this.props.onChange} />
            </div>
        );
    }
}

export class AddressControl extends preact.Component {
    render() {
        return (
            <div>
                <div className="form-group fancy-fg">
                    <input key={this.props.id + '-street_1'} type="text" id={this.props.id + '-street_1'} placeholder="Adresszeile 1" className="form-element" required={this.props.required} onChange={this.props.onChange} />
                    <label className="fancy-label" for={this.props.id + '-street_1'}>Adresszeile 1</label>
                </div>
                <div className="form-group fancy-fg">
                    <input key={this.props.id + '-street_2'} type="text" id={this.props.id + '-street_2'} placeholder="Adresszeile 2" className="form-element" onChange={this.props.onChange} />
                    <label className="fancy-label" for={this.props.id + '-street_2'}>Adresszeile 2</label>
                </div>
                <div className="form-group fancy-fg">
                    <input key={this.props.id + '-place'} type="text" id={this.props.id + '-place'} placeholder="Ort" className="form-element" required={this.props.required} onChange={this.props.onChange} />
                    <label className="fancy-label" for={this.props.id + '-place'}>Ort</label>
                </div>
                <div className="form-group fancy-fg">
                    <input key={this.props.id + '-country'} type="text" id={this.props.id + '-country'} placeholder="Land" className="form-element" onChange={this.props.onChange} />
                    <label className="fancy-label" for={this.props.id + '-country'}>Land</label>
                </div>
                <input key={this.props.id + '-primary'} type="hidden" id={this.props.id + '-primary'} className="dynamic-input-primary form-element" value={this.props.primary} onChange={this.props.onChange} />
            </div>
        );
    }
}