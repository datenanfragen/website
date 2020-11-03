import { Component } from 'preact';

export default class Radio extends Component {
    render() {
        return (
            <label for={this.props.id} className={"radio-label" + (this.props.radio_variable === this.props.value ? " active" : "")}>
                <input type="radio" id={this.props.id} name={this.props.name} value={this.props.value} className="form-element" checked={this.props.radio_variable === this.props.value}
                       onChange={this.props.onChange} />
                {this.props.label}
            </label>
        );
    }
}
