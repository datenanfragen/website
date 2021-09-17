import { Component } from 'preact';
import PropTypes from 'prop-types';
import { Text, IntlProvider } from 'preact-i18n';
import MailtoDropdown from '../MailtoDropdown';

export default class ActionButton extends Component {
    render(props) {
        const enabled =
            (props.transport_medium === 'email' ? !!props.letter && props.ready : props.download_active) && props.ready;
        const class_name =
            'button' + (enabled ? '' : ' disabled') + (props.done ? ' button-secondary' : ' button-primary');

        const button =
            props.transport_medium === 'email' ? (
                <MailtoDropdown
                    letter={props.letter}
                    onSuccess={props.onSuccess}
                    email={props.email}
                    done={props.done}
                    className={class_name}
                    buttonText={this.props.buttonText}
                    enabled={enabled}
                />
            ) : (
                <a
                    id="download-button"
                    className={class_name}
                    href={props.blob_url}
                    download={props.download_filename}
                    onClick={(e) => {
                        if (!enabled) e.preventDefault();
                        else props.onSuccess();
                    }}>
                    {this.props.buttonText || <Text id={props.done ? 'download-pdf-again' : 'download-pdf'} />}
                    &nbsp;&nbsp;
                    <span className={'icon ' + (props.done ? 'icon-delivery-truck' : 'icon-download')} />
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
            email: '',
            letter: undefined,
            blob_url: undefined,
            download_filename: '',
            download_active: false,
            done: false,
        };
    }

    // Note: This is not currently being checked but will be starting with Preact X.
    static propTypes = {
        transport_medium: PropTypes.oneOf(['fax', 'email', 'letter', 'custom']),
        email: PropTypes.string,
        letter: PropTypes.object,
        blob_url: PropTypes.string,
        download_filename: PropTypes.string,
        download_active: PropTypes.bool,
        onSuccess: PropTypes.func.isRequired,
        done: PropTypes.bool,
        ready: PropTypes.bool,
        buttonText: PropTypes.oneOfType([PropTypes.elementType, PropTypes.arrayOf(PropTypes.elementType)]),
    };
}
