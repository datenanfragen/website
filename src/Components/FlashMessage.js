import { render, Component } from 'preact';
import { createPortal } from 'preact/compat';
import t from '../Utility/i18n';

export default class FlashMessage extends Component {
    constructor(props) {
        super(props);

        if (!this.props.duration) this.props.duration = 5000;
        if (!this.props.type) this.props.type = 'info';
        this.state = {
            shown: true,
            fading_out: false
        };
        this.dismiss = this.dismiss.bind(this);
    }

    componentDidMount() {
        setTimeout(this.dismiss, this.props.duration);
    }

    dismiss() {
        this.setState({ fading_out: true });
        setTimeout(() => {
            this.setState({ shown: false });
        }, 290);
    }

    render() {
        return this.state.shown ? (
            createPortal(
                <div className={'flash-message flash-' + this.props.type + (this.state.fading_out ? ' fade-out' : '')}>
                    <button
                        className="button-unstyled close-button icon-close"
                        onClick={this.dismiss}
                        title={t('cancel', 'generator')}
                    />
                    <div className="inner">{this.props.children}</div>
                </div>
                , document.getElementById('flash-messages'))
        ) : (
            []
        );
    }
}

export function flash(flash_message) {
    render(flash_message, document.body);
}
