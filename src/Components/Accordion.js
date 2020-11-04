import { Component } from 'preact';
import PropTypes from 'prop-types';

export default class Accordion extends Component {
    constructor(props) {
        super(props);

        this.state = {
            expanded: props.expanded,
        };
    }

    render() {
        // TODO: Consider using `<details>` (https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details) instead.
        return (
            <div className="accordion" id={this.props.id} style={this.props.style}>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        this.setState({ expanded: !this.state.expanded });
                    }}
                    className="accordion-title-link button-unstyled"
                    aria-expanded={this.state.expanded}
                    aria-controls={'accordion-content-' + this.props.id}>
                    <h3 className="accordion-title">
                        {this.props.title}
                        <span className={'icon' + (this.state.expanded ? ' icon-arrow-up' : ' icon-arrow-down')} />
                    </h3>
                </button>
                <div id={'accordion-content-' + this.props.id}>{this.state.expanded ? this.props.children : ''}</div>
            </div>
        );
    }

    static propTypes = {
        id: PropTypes.string.isRequired,
        style: PropTypes.string,
        title: PropTypes.string.isRequired,
        expanded: PropTypes.bool.isRequired,

        children: PropTypes.node.isRequired,
    };
}
