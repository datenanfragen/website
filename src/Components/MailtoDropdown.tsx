import type { JSX } from 'preact';
import { useRef, useCallback } from 'preact/hooks';
import { Text, IntlProvider } from 'preact-i18n';
import { useModal } from './Modal';
import t, { t_r } from '../Utility/i18n';

type EmailData = { email: string; subject: string; body: string };
type MailtoHandler = (
    | { link: (data: EmailData) => string }
    | { onClick: (data: EmailData, showCopyManuallyModal: () => void) => void }
) & { countries: typeof window.globals.country[] };

type MailtoDropdownProps = {
    // TODO: @zner0L is working on that right now.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    letter?: any;
    handlers?: (keyof typeof mailto_handlers)[];
    email: string;
    onSuccess: () => void;
    done?: boolean;
    className: string;
    enabled: boolean;
    buttonText: JSX.Element | JSX.Element[];
};

// TS Helper to type `Record` values but keep strong key type without having to hardcode key values, see:
// https://stackoverflow.com/a/49539369
const createMailtoHandlers = <T extends Record<string, MailtoHandler>>(handlers: T) => handlers;
const mailto_handlers = createMailtoHandlers({
    mailto: {
        link: (d) => `mailto:${d.email}?subject=${d.subject}&body=${d.body}`,
        countries: ['all'],
    },
    gmail: {
        link: (d) => `https://mail.google.com/mail/?view=cm&fs=1&to=${d.email}&su=${d.subject}&body=${d.body}`,
        countries: ['all'],
    },
    yahoo: {
        link: (d) => `https://compose.mail.yahoo.com/?to=${d.email}&subject=${d.subject}&body=${d.body}`,
        countries: ['all'],
    },
    yandex: {
        link: (d) => `https://mail.yandex.com/#compose?to=${d.email}&subject=${d.subject}&body=${d.body}`,
        countries: ['all'],
    },
    copymanually: {
        onClick: (d, showCopyManuallyModal) => showCopyManuallyModal(),
        countries: ['all'],
    },
});

export const MailtoDropdown = (props: MailtoDropdownProps) => {
    // We only want to select everything in the copymanually inputs if they aren't yet focused. That way, the user can still
    // make an individual selection if they prefer.
    // However, the event we get in the onclick handler means that the focus has already been changed to the element the
    // user clicked, so we need to remember the previous one for the check to make any sense at all.
    const previous_active_element_id = useRef<string>();

    const my_ref_text = `${t_r('my-reference', props.letter.props.language)}: ${props.letter.props.reference}`;
    const data = {
        email: props.email,
        subject: encodeURIComponent(
            props.letter.props.subject ? `${props.letter.props.subject} (${my_ref_text})` : my_ref_text
        ),
        body: encodeURIComponent(props.letter.toEmailString()),
    };

    const onCopyManuallyInputClick = useCallback(
        (e: JSX.TargetedMouseEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            if (previous_active_element_id.current === e.currentTarget.id) return;

            e.currentTarget.select();
            e.currentTarget.focus();
            previous_active_element_id.current = e.currentTarget.id;
        },
        [previous_active_element_id]
    );

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
                    value={data.email}
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
                    {decodeURIComponent(data.body)}
                </textarea>
            </div>
        </IntlProvider>,
        {
            onPositiveFeedback: () => {
                dismissCopyManuallyModal();
            },
            onDismiss: () => {
                previous_active_element_id.current = undefined;
            },
            positiveText: t('ok', 'generator'),
        }
    );

    const handlers =
        props.handlers ||
        (Object.keys(mailto_handlers) as (keyof typeof mailto_handlers)[]).filter((h) =>
            mailto_handlers[h].countries.some((c) => ['all', window.globals.country].includes(c))
        );

    const handler_buttons = handlers.map((h) => {
        const handler = mailto_handlers[h];

        const common_props: Omit<JSX.HTMLAttributes, 'ref'> = {
            onClick: (e) => {
                if (!props.letter) e.preventDefault();
                else {
                    if ('onClick' in handler) handler.onClick(data, showCopyManuallyModal);

                    props.onSuccess?.();
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

            <div className={`dropdown-container${!props.enabled ? ' disabled' : ''}`} style="display: inline-block;">
                <button disabled={!props.enabled} className={props.className}>
                    {props.buttonText || <Text id={props.done ? 'send-email-again' : 'send-email'} />}
                    &nbsp;&nbsp;
                    <span className={`icon ${props.done ? 'icon-paper-plane' : 'icon-email'}`} />
                </button>
                {props.enabled && (
                    <div className="dropdown" style="padding: 15px; width: 270px; max-width: 90vw;">
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
