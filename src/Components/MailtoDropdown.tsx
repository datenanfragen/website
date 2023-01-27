import type { JSX } from 'preact';
import { Text, IntlProvider } from 'preact-i18n';
import { useAppStore, Country } from '../store/app';
import { useModal } from './Modal';
import t, { t_r } from '../Utility/i18n';
import { RequestLetter } from '../DataType/RequestLetter';
import { useInputSelectAll } from '../hooks/useInputSelectAll';

export type EmailData = { to: string; subject: string; text: string };
type MailtoHandler = (
    | { link: (data: EmailData) => string }
    | {
          onClick: (
              data: EmailData,
              showCopyManuallyModal: () => void
          ) => void | Promise<void | { content: ArrayBuffer; messageId: string }>;
      }
) & { countries: Country[] };

export type MailtoDropdownProps = {
    letter: RequestLetter;
    handlers?: (keyof typeof mailto_handlers)[];
    email: string;
    onSuccess: (result?: { content: ArrayBuffer; messageId: string }) => void;
    done?: boolean;
    className: string;
    enabled: boolean;
    buttonText?: JSX.Element | JSX.Element[];
    dropup?: boolean;
    additionalHandlers?: Record<string, MailtoHandler>;
};

// TS Helper to type `Record` values but keep strong key type without having to hardcode key values, see:
// https://stackoverflow.com/a/49539369
const createMailtoHandlers = <T extends Record<string, MailtoHandler>>(handlers: T) => handlers;
export const mailto_handlers = createMailtoHandlers({
    mailto: {
        link: (d) => `mailto:${d.to}?subject=${encodeURIComponent(d.subject)}&body=${encodeURIComponent(d.text)}`,
        countries: ['all'],
    },
    gmail: {
        link: (d) =>
            `https://mail.google.com/mail/?view=cm&fs=1&to=${d.to}&su=${encodeURIComponent(
                d.subject
            )}&body=${encodeURIComponent(d.text)}`,
        countries: ['all'],
    },
    yahoo: {
        link: (d) =>
            `https://compose.mail.yahoo.com/?to=${d.to}&subject=${encodeURIComponent(
                d.subject
            )}&body=${encodeURIComponent(d.text)}`,
        countries: ['all'],
    },
    yandex: {
        link: (d) =>
            `https://mail.yandex.com/#compose?to=${d.to}&subject=${encodeURIComponent(
                d.subject
            )}&body=${encodeURIComponent(d.text)}`,
        countries: ['all'],
    },
    copymanually: {
        onClick: (d, showCopyManuallyModal) => showCopyManuallyModal(),
        countries: ['all'],
    },
});

export const MailtoDropdown = (props: MailtoDropdownProps) => {
    const country = useAppStore((state) => state.country);

    const availableHandlers = { ...mailto_handlers, ...props.additionalHandlers };

    const my_ref_text = `${t_r('my-reference', props.letter.language)}: ${props.letter.reference}`;
    const data = {
        to: props.email,
        subject: props.letter.props.subject ? `${props.letter.props.subject} (${my_ref_text})` : my_ref_text,
        text: props.letter.toEmailString(),
    };

    const [onCopyManuallyInputClick, unsetCopyManuallyPreviousActiveElement] = useInputSelectAll();

    const [CopyManuallyModal, showCopyManuallyModal, dismissCopyManuallyModal] = useModal(
        <IntlProvider scope="generator" definition={window.I18N_DEFINITION}>
            <Text id="copymanually-explanation" />

            <div className="form-group">
                <strong>
                    <label htmlFor="mailto-dropdown-copymanually-subject">{t('subject', 'generator')}</label>
                </strong>
                <input
                    type="text"
                    id="mailto-dropdown-copymanually-subject"
                    className="form-element"
                    value={decodeURIComponent(data.subject)}
                    onClick={onCopyManuallyInputClick}
                    readOnly
                />
                <strong>
                    <label htmlFor="mailto-dropdown-copymanually-recipient">{t('recipient', 'generator')}</label>
                </strong>
                <input
                    type="text"
                    id="mailto-dropdown-copymanually-recipient"
                    className="form-element"
                    value={data.to}
                    onClick={onCopyManuallyInputClick}
                    readOnly
                />
                <strong>
                    <label htmlFor="mailto-dropdown-copymanually-body">{t('body', 'generator')}</label>
                </strong>
                <textarea
                    id="mailto-dropdown-copymanually-body"
                    className="form-element"
                    rows={10}
                    onClick={onCopyManuallyInputClick}
                    readOnly>
                    {decodeURIComponent(data.text)}
                </textarea>
            </div>
        </IntlProvider>,
        {
            onPositiveFeedback: () => {
                dismissCopyManuallyModal();
            },
            onDismiss: unsetCopyManuallyPreviousActiveElement,
            positiveText: t('ok', 'generator'),
        }
    );

    const handlers =
        props.handlers ||
        (Object.keys(mailto_handlers) as (keyof typeof mailto_handlers)[]).filter((h) =>
            mailto_handlers[h].countries.some((c) => ['all', country].includes(c))
        );

    const handler_buttons = handlers.map((h) => {
        const handler = availableHandlers[h];

        const common_props: Omit<JSX.HTMLAttributes, 'ref'> = {
            onClick: (e) => {
                if (!props.letter) e.preventDefault();
                else {
                    let result: Promise<{ content: ArrayBuffer; messageId: string }> | void;
                    if ('onClick' in handler) result = handler.onClick(data, showCopyManuallyModal);
                    if (result) result.then((result) => props.onSuccess?.(result));
                    else props.onSuccess?.();
                }
            },
            className: 'button button-secondary button-full-width',
            style: 'margin-top: 10px; text-align: left;',
        };
        return 'link' in handler ? (
            <a {...common_props} href={handler.link(data)} target="_blank" rel="noreferrer noopener">
                {t(h, 'mailto')}
            </a>
        ) : (
            <button {...common_props}>{t(h, 'mailto')}</button>
        );
    });

    return (
        <IntlProvider scope="generator" definition={window.I18N_DEFINITION}>
            <CopyManuallyModal />

            <div
                className={`${props.dropup ? 'dropup' : 'dropdown'}-container${!props.enabled ? ' disabled' : ''}`}
                style="display: inline-block;">
                <button disabled={!props.enabled} className={props.className}>
                    {props.buttonText || <Text id={props.done ? 'send-email-again' : 'send-email'} />}
                    &nbsp;&nbsp;
                    <span className={`icon ${props.done ? 'icon-paper-plane' : 'icon-email'}`} />
                </button>
                {props.enabled && (
                    <div
                        className={props.dropup ? 'dropup' : 'dropdown'}
                        style="padding: 15px; width: 270px; max-width: 90vw;">
                        <Text id="mailto-dropdown-explanation" />

                        {handler_buttons}

                        <small>
                            <Text id="mailto-dropdown-warning" />
                        </small>
                    </div>
                )}
            </div>
        </IntlProvider>
    );
};
