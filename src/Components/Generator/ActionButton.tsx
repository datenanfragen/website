import { Text, IntlProvider } from 'preact-i18n';
import { useProceedingsStore } from '../../store/proceedings';
import { useGeneratorStore } from '../../store/generator';
import { MailtoDropdown, MailtoDropdownProps } from '../MailtoDropdown';
import type { Content } from '../../types/proceedings';
import { useAppStore } from '../../store/app';
import { useWebformModal } from './WebformModal';

export type ActionButtonProps = {
    onSuccess?: (res?: { content: ArrayBuffer; messageId: string } | Blob) => void;
    createContentBlob?: (emailOrPdfBlob: ArrayBuffer | Blob, filename?: string) => Promise<Content>;
    buttonText?: JSX.Element | JSX.Element[];
    mailtoDropdownProps?: Partial<MailtoDropdownProps>;
    dropup?: boolean;
};

export const ActionButton = (_props: ActionButtonProps) => {
    const email = useGeneratorStore((state) => state.request.email);
    const webform = useGeneratorStore((state) => state.current_company?.webform);
    const transportMedium = useGeneratorStore((state) => state.request.transport_medium);
    const letter = useGeneratorStore((state) => state.letter);
    const requestSent = useGeneratorStore((state) => state.request.sent);
    const ready = useGeneratorStore((state) => state.ready);
    const download_active = useGeneratorStore((state) => state.download_active);
    const download_url = useGeneratorStore((state) => state.download_url);
    const download_filename = useGeneratorStore((state) => state.download_filename);
    const getLetter = useGeneratorStore((state) => state.letter);
    const setSent = useGeneratorStore((state) => state.setSent);
    const getRequestForSaving = useGeneratorStore((state) => state.getRequestForSaving);
    const addRequest = useProceedingsStore((state) => state.addRequest);
    const saveRequestContent = useAppStore((state) => state.saveRequestContent);

    const [WebformModal, showWebformModal] = useWebformModal({ letter, webform });

    const props = {
        onSuccess: (res?: { content: ArrayBuffer; messageId: string } | Blob) => {
            if (saveRequestContent && res && props.createContentBlob)
                props
                    .createContentBlob(res instanceof Blob ? res : res.content, download_filename)
                    .then((content) =>
                        addRequest(
                            getRequestForSaving(),
                            content,
                            res instanceof Blob ? undefined : { emailId: res.messageId }
                        )
                    );
            else addRequest(getRequestForSaving());

            setSent(true);
        },
        ..._props,
    };

    const enabled = transportMedium === 'email' ? ready : download_active && ready;
    const className = 'button' + (enabled ? '' : ' disabled') + (requestSent ? ' button-secondary' : ' button-primary');

    return (
        <IntlProvider scope="generator" definition={window.I18N_DEFINITION}>
            <WebformModal />

            {transportMedium === 'email' ? (
                <MailtoDropdown
                    letter={getLetter()}
                    onSuccess={props.onSuccess}
                    email={email}
                    done={requestSent}
                    className={className}
                    buttonText={props.buttonText}
                    enabled={enabled}
                    dropup={props.dropup}
                    {...props.mailtoDropdownProps}
                />
            ) : transportMedium === 'webform' ? (
                <button
                    className={className}
                    onClick={() => {
                        showWebformModal();
                        props.onSuccess();
                    }}
                    disabled={!enabled}>
                    <Text id={requestSent ? 'show-webform-text-again' : 'show-webform-text'} />
                    &nbsp;&nbsp;
                    <span className={`icon ${requestSent ? 'icon-paper-plane' : 'icon-email'}`} />
                </button>
            ) : (
                <a
                    id="download-button"
                    className={className}
                    href={download_url}
                    download={download_filename}
                    onClick={(e) => {
                        if (!enabled) e.preventDefault();
                        else if (download_url)
                            fetch(download_url)
                                .then((r) => r.blob())
                                .then((blob) => props.onSuccess(blob));
                        else props.onSuccess();
                    }}>
                    {props.buttonText || <Text id={requestSent ? 'download-pdf-again' : 'download-pdf'} />}
                    &nbsp;&nbsp;
                    <span className={'icon ' + (requestSent ? 'icon-delivery-truck' : 'icon-download')} />
                </a>
            )}
        </IntlProvider>
    );
};
