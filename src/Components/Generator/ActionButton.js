import preact from 'preact';
import PropTypes from 'prop-types';
import { Text, IntlProvider } from 'preact-i18n';

export default class ActionButton extends preact.Component {
    render() {
        const class_name =
            'button' +
            (this.props.blob_url ? '' : ' disabled') +
            (this.props.done ? ' button-secondary' : ' button-primary');

        const button =
            this.props.transport_medium === 'email' ? (
                <a
                    id="sendmail-button"
                    className={class_name}
                    href={this.props.mailto_link}
                    onClick={e => {
                        if (!this.props.blob_url) e.preventDefault();
                        else this.props.onSuccess();
                    }}>
                    <Text id={this.props.done ? 'send-email-again' : 'send-email'} />
                    &nbsp;&nbsp;
                    <span className={'icon ' + (this.props.done ? 'icon-paper-plane' : 'icon-email')} />
                </a>
            ) : (
                <a
                    id="download-button"
                    className={class_name}
                    href={this.props.blob_url}
                    download={this.props.download_filename}
                    onClick={e => {
                        if (!this.props.download_active) e.preventDefault();
                        else this.props.onSuccess();
                    }}>
                    <Text id={this.props.done ? 'download-pdf-again' : 'download-pdf'} />
                    &nbsp;&nbsp;
                    <span className={'icon ' + (this.props.done ? 'icon-delivery-truck' : 'icon-download')} />
                </a>
            );

        return (
            <IntlProvider scope="generator" definition={I18N_DEFINITION}>
                {button}
            </IntlProvider>
        );
    }

    static get defaultProps() {
        return {
            transport_medium: 'email',
            blob_url: undefined,
            mailto_link: '',
            download_filename: '',
            download_active: false,
            done: false
        };
    }

    // Note: This is not currently being checked but will be starting with Preact X.
    static propTypes = {
        onSuccess: PropTypes.func.isRequired
    };
}
