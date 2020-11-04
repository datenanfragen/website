import { render, Component } from 'preact';
import { createPortal } from 'preact/compat';
import t from '../Utility/i18n';
import PropTypes from 'prop-types';

export default class Modal extends Component {
    render() {
        const positiveButton =
            this.props.positiveButton ||
            (this.props.positiveText ? (
                <button
                    className={'button ' + (this.props.positiveDefault ? 'button-primary' : 'button-secondary')}
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
                    className={'button ' + (!this.props.positiveDefault ? 'button-primary' : 'button-secondary')}
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

    static propTypes = {
        positiveButton: PropTypes.element,
        positiveText: PropTypes.string,
        positiveDefault: PropTypes.bool,
        onPositiveFeedback: PropTypes.func,

        negativeButton: PropTypes.element,
        negativeText: PropTypes.string,
        negativeDefault: PropTypes.bool,
        onNegativeFeedback: PropTypes.func,

        onDismiss: PropTypes.func,
        innerStyle: PropTypes.string,

        children: PropTypes.node.isRequired,
    };
}

export function showModal(modal) {
    return render(modal, document.body);
}
export function dismissModal(node) {
    render('', document.body, node);
}
