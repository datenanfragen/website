import type { JSX } from 'preact';
import { Text, IntlProvider } from 'preact-i18n';
import { useGeneratorStore } from '../../store/generator';
import { MailtoDropdown } from '../MailtoDropdown';

type ActionButtonProps = {
    onSuccess: () => void;
    buttonText: JSX.Element | JSX.Element[];
};

export const ActionButton = (props: ActionButtonProps) => {
    const email = useGeneratorStore((state) => state.request.email);
    const transport_medium = useGeneratorStore((state) => state.request.transport_medium);
    const request_sent = useGeneratorStore((state) => state.request.sent);
    const ready = useGeneratorStore((state) => state.ready);
    const download_active = useGeneratorStore((state) => state.download_active);
    const download_url = useGeneratorStore((state) => state.download_url);
    const download_filename = useGeneratorStore((state) => state.download_filename);
    const getLetter = useGeneratorStore((state) => state.letter);

    const enabled = transport_medium === 'email' ? ready : download_active && ready;
    const class_name =
        'button' + (enabled ? '' : ' disabled') + (request_sent ? ' button-secondary' : ' button-primary');

    const button =
        transport_medium === 'email' ? (
            <MailtoDropdown
                letter={getLetter()}
                onSuccess={props.onSuccess}
                email={email}
                done={request_sent}
                className={class_name}
                buttonText={props.buttonText}
                enabled={enabled}
            />
        ) : (
            <a
                id="download-button"
                className={class_name}
                href={download_url}
                download={download_filename}
                onClick={(e) => {
                    if (!enabled) e.preventDefault();
                    else props.onSuccess();
                }}>
                {props.buttonText || <Text id={request_sent ? 'download-pdf-again' : 'download-pdf'} />}
                &nbsp;&nbsp;
                <span className={'icon ' + (request_sent ? 'icon-delivery-truck' : 'icon-download')} />
            </a>
        );

    return (
        <IntlProvider scope="generator" definition={window.I18N_DEFINITION}>
            {button}
        </IntlProvider>
    );
};
