import type { JSX } from 'preact';
import { Text, IntlProvider } from 'preact-i18n';
import { useProceedingsStore } from '../../store/proceedings';
import { useGeneratorStore } from '../../store/generator';
import { MailtoDropdown, MailtoDropdownProps } from '../MailtoDropdown';

type ActionButtonProps = {
    onSuccess?: () => void;
    buttonText?: JSX.Element | JSX.Element[];
    mailtoDropdownProps?: Partial<MailtoDropdownProps>;
    dropup?: boolean;
};

export const ActionButton = (_props: ActionButtonProps) => {
    const email = useGeneratorStore((state) => state.request.email);
    const transport_medium = useGeneratorStore((state) => state.request.transport_medium);
    const request_sent = useGeneratorStore((state) => state.request.sent);
    const ready = useGeneratorStore((state) => state.ready);
    const download_active = useGeneratorStore((state) => state.download_active);
    const download_url = useGeneratorStore((state) => state.download_url);
    const download_filename = useGeneratorStore((state) => state.download_filename);
    const getLetter = useGeneratorStore((state) => state.letter);
    const setSent = useGeneratorStore((state) => state.setSent);
    const getRequestForSaving = useGeneratorStore((state) => state.getRequestForSaving);
    const addRequest = useProceedingsStore((state) => state.addRequest);

    const props = {
        onSuccess: () => {
            addRequest(getRequestForSaving());
            setSent(true);
        },
        ..._props,
    };

    const enabled = transport_medium === 'email' ? ready : download_active && ready;
    const class_name =
        'button' + (enabled ? '' : ' disabled') + (request_sent ? ' button-secondary' : ' button-primary');

    return (
        <IntlProvider scope="generator" definition={window.I18N_DEFINITION}>
            {transport_medium === 'email' ? (
                <MailtoDropdown
                    letter={getLetter()}
                    onSuccess={props.onSuccess}
                    email={email}
                    done={request_sent}
                    className={class_name}
                    buttonText={props.buttonText}
                    enabled={enabled}
                    dropup={props.dropup}
                    {...props.mailtoDropdownProps}
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
            )}
        </IntlProvider>
    );
};
