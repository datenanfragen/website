import preact from 'preact';

export default class Accordion extends preact.Component {
    constructor(props) {
        super(props);

        this.state = {
            expanded: false
        }
    }

    render() {
        return <div className="accordion" id={this.props.id} style={this.props.style}>
            <a href="" onClick={e => {
                e.preventDefault();
                this.setState({expanded: !this.state.expanded});
            }} className="accordion-title-link"><h3 className="accordion-title">{this.props.title}<span className={'icon' + (this.state.expanded ? ' icon-arrow-up' : ' icon-arrow-down')} /></h3></a>
            {this.state.expanded ? this.props.children : ''}
        </div>;
    }
}
