import { Component } from 'preact';
import PropTypes from 'prop-types';

export default class Radio extends Component {
    render() {
        return (
            <label
                for={this.props.id}
                className={'radio-label' + (this.props.radio_variable === this.props.value ? ' active' : '')}>
                <input
                    type="radio"
                    id={this.props.id}
                    name={this.props.name}
                    value={this.props.value}
                    className="form-element"
                    checked={this.props.radio_variable === this.props.value}
                    onChange={this.props.onChange}
                />
                {this.props.label}
            </label>
        );
    }

    static propTypes = {
        id: PropTypes.string.isRequired,
        radio_variable: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired,
        label: PropTypes.node.isRequired,
    };
}
