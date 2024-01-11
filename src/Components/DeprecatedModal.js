import { render, Component } from 'preact';
import { createPortal } from 'preact/compat';
import t from '../Utility/i18n';

// TODO: Get rid of this once we've moved everything to the new modal hook.
export default class DeprecatedModal extends Component {
    render() {
        const positiveButton =
            this.props.positiveButton ||
            (this.props.positiveText ? (
                <button
                    className={`button ${this.props.positiveDefault ? 'button-primary' : 'button-secondary'}`}
                    onClick={this.props.onPositiveFeedback}
                    style={'float: right'}>
                    {this.props.positiveText}
                </button>
            ) : (
                ''
            ));
        const negativeButton =
            this.props.negativeButton ||
            (this.props.negativeText ? (
                <button
                    className={`button ${!this.props.positiveDefault ? 'button-primary' : 'button-secondary'}`}
                    onClick={this.props.onNegativeFeedback}
                    style={'float: left'}>
                    {this.props.negativeText}
                </button>
            ) : (
                ''
            ));
        /* eslint-disable jsx-a11y/no-noninteractive-tabindex */
        return createPortal(
            <div className="modal">
                <div
                    className="backdrop"
                    onClick={this.props.onDismiss}
                    onKeyDown={(e) => {
                        if (e.key === 'Escape') this.props.onDismiss();
                    }}
                    role="presentation"
                    tabIndex="0"
                />
                <div className="inner" style={this.props.innerStyle}>
                    {this.props.onDismiss ? (
                        <button
                            className="button-unstyled close-button icon-close"
                            onClick={this.props.onDismiss}
                            title={t('cancel', 'generator')}
                        />
                    ) : (
                        []
                    )}
                    {this.props.children}
                    <div className="button-group">
                        {positiveButton}
                        {negativeButton}
                    </div>
                </div>
            </div>,
            document.body
        );
        /* eslint-enable */
    }
}

export function showModal(modal) {
    return render(modal, document.body);
}
export function dismissModal(node) {
    render('', document.body, node);
}
