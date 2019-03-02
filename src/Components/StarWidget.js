import preact from 'preact';

// Adapted after https://jsfiddle.net/leaverou/CGP87/
export default class StarWidget extends preact.Component {
    constructor(props) {
        super(props);

        this.state = {
            rating: this.props.initial
        };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        if (!this.props.readonly) {
            this.setState({ rating: e.target.value });
            if (typeof this.props.onChange == 'function') this.props.onChange(e.target.value);
        }
    }

    render() {
        let radios = [];
        for (let i = 5; i >= 1; i--)
            radios.push([
                <input
                    type="radio"
                    id={this.props.id + '-star' + i}
                    name={this.props.id}
                    value={i}
                    checked={this.state.rating == i}
                    onChange={this.handleChange}
                    disabled={this.props.readonly}
                />,
                <label for={this.props.id + '-star' + i} className={this.props.readonly ? '' : 'editable'}>
                    {i} stars
                </label>
            ]);

        return (
            <fieldset id={this.props.id} className="rating">
                {/* TODO: No idea why the page jumps (in Chrome) when clicking on a star. */}
                {radios}
            </fieldset>
        );
    }

    static get defaultProps() {
        return {
            initial: 0,
            readonly: false
        };
    }
}
