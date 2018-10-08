import preact from 'preact';
import Portal from 'preact-portal';
import t from '../Utility/i18n';

export default class FlashMessage extends preact.Component {
    constructor(props) {
        super(props);

        if(!this.props.duration) this.props.duration = 5000;
        if(!this.props.type) this.props.type = 'info';
        this.state = {
            shown: true,
            fading_out: false
        };
        this.dismiss = this.dismiss.bind(this);

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
            <Portal into="#flash-messages">
                <div className={'flash-message flash-' + this.props.type + (this.state.fading_out ? ' fade-out' : '')}>
                    <a className="close-button icon-close" onClick={this.dismiss} title={t('cancel', 'generator')} />
                    <div className="inner">{this.props.children}</div>
                </div>
            </Portal>
        ) : (
            []
        );
    }
}

export function flash(flash_message) {
    preact.render(flash_message, null);
}
