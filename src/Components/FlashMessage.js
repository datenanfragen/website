import { render, Component } from 'preact';
import PropTypes from 'prop-types';
import t from '../Utility/i18n';

export default class FlashMessage extends Component {
    constructor(props) {
        super(props);
        if (!this.props.duration) this.props.duration = 5000;
        if (!this.props.type) this.props.type = 'info';
        this.state = {
            shown: true,
            fading_out: false,
        };
        this.dismiss = this.dismiss.bind(this);
    }

    componentDidMount() {
        if (this.props.duration !== -1) {
            setTimeout(this.dismiss, this.props.duration);
        }
    }

    dismiss() {
        this.setState({ fading_out: true });
        setTimeout(() => {
            this.setState({ shown: false });
        }, 290);
    }

    render() {
        return this.state.shown ? (
            <div className={'flash-message flash-' + this.props.type + (this.state.fading_out ? ' fade-out' : '')}>
                <button
                    className="button-unstyled close-button icon-close"
                    onClick={this.dismiss}
                    title={t('cancel', 'generator')}
                />
                <div className="inner">{this.props.children}</div>
            </div>
        ) : null;
    }

    static propTypes = {
        duration: PropTypes.number,
        type: PropTypes.oneOf(['info', 'error', 'warning', 'success']),
        children: PropTypes.node.isRequired,
    };
}

let flash_messages_el = document.getElementById('flash-messages');
let flash_messages = [];

export function flash(flash_message) {
    flash_messages.push(flash_message);
    render(<>{flash_messages}</>, flash_messages_el);
}
