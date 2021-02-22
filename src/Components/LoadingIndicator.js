import { Component } from 'preact';
import PropTypes from 'prop-types';

export default class LoadingIndicator extends Component {
    render() {
        if (!this.props.shown) return '';

        return (
            <div className="loading-indicator" style={this.props.style}>
                <div className="sk-folding-cube">
                    <div className="sk-cube1 sk-cube"></div>
                    <div className="sk-cube2 sk-cube"></div>
                    <div className="sk-cube4 sk-cube"></div>
                    <div className="sk-cube3 sk-cube"></div>
                </div>
            </div>
        );
    }

    static propTypes = {
        shown: PropTypes.bool,
        style: PropTypes.string,
    };

    static get defaultProps() {
        return {
            shown: true,
        };
    }
}
