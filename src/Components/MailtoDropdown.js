import { render, Component } from 'preact';
import { Text, IntlProvider } from 'preact-i18n';
import PropTypes from 'prop-types';
import t, { t_r } from '../Utility/i18n';
import Modal from './Modal';

// We only want to select everything in the copymanually inputs if they aren't yet focused. That, the user can still
// an individual selection if they prefer.
// However, the event we get in the onclick handler means that the focus has already been changed to the element the
// user clicked, so we need to remember the previous one for the check to make any sense at all.
let previous_active_element = document.body;

// TODO: I would like to extend this with country-specific services in the future. Unfortunately, I did not find a way
// to produce links for GMX and Web.de.
export const MAILTO_HANDLERS = {
    mailto: {
        link: (d) => `mailto:${d.email}?subject=${d.subject}&body=${d.body}`,
        countries: ['all'],
    },
    gmail: {
        link: (d) => `https://mail.google.com/mail/?view=cm&fs=1&to=${d.email}&su=${d.subject}&body=${d.body}`,
        countries: ['all'],
    },
    // TODO: Outlook doesn't work. I think our body may be too long. :(
    // Reference: https://blogs.msdn.microsoft.com/carloshm/2016/01/16/how-to-compose-a-new-message-or-event-and-populate-fields-in-office365/
    // outlook: {
    //     link: d =>
    //         `https://outlook.live.com/owa/?path=/mail/action/compose&to=${d.email}&subject=${d.subject}&body=${d.body}`,
    //     countries: ['all']
    // },
    yahoo: {
        link: (d) => `https://compose.mail.yahoo.com/?to=${d.email}&subject=${d.subject}&body=${d.body}`,
        countries: ['all'],
    },
    yandex: {
        link: (d) => `https://mail.yandex.com/#compose?to=${d.email}&subject=${d.subject}&body=${d.body}`,
        countries: ['all'],
    },
    copymanually: {
        onClick: (d) => {
            const dismiss = () => render('', document.body, modal);
            const onInputClick = (e) => {
                if (previous_active_element.id === e.target.id) return;

                e.target.select();
                e.target.focus();
                previous_active_element = e.target;
            };
            const modal = render(
                <IntlProvider scope="generator" definition={I18N_DEFINITION}>
                    <Modal
                        positiveText={<Text id="ok" />}
                        onPositiveFeedback={dismiss}
                        positiveDefault={true}
                        onDismiss={dismiss}>
                        <Text id="copymanually-explanation" />

                        <div className="form-group">
                            <strong>
                                <label htmlFor="mailto-dropdown-copymanually-subject">
                                    {t('subject', 'generator')}
                                </label>
                            </strong>
                            <input
                                type="text"
                                id="mailto-dropdown-copymanually-subject"
                                className="form-element"
                                value={decodeURIComponent(d.subject)}
                                onClick={onInputClick}
                                readOnly
                            />
                            <strong>
                                <label htmlFor="mailto-dropdown-copymanually-recipient">
                                    {t('recipient', 'generator')}
                                </label>
                            </strong>
                            <input
                                type="text"
                                id="mailto-dropdown-copymanually-recipient"
                                className="form-element"
                                value={d.email}
                                onClick={onInputClick}
                                readOnly
                            />
                            <strong>
                                <label htmlFor="mailto-dropdown-copymanually-body">{t('body', 'generator')}</label>
                            </strong>
                            <textarea
                                id="mailto-dropdown-copymanually-body"
                                className="form-element"
                                rows="10"
                                onClick={onInputClick}
                                readOnly>
                                {decodeURIComponent(d.body)}
                            </textarea>
                        </div>
                    </Modal>
                </IntlProvider>,
                document.body
            );
        },
        countries: ['all'],
    },
};

export default class MailtoDropdown extends Component {
    render(props) {
        const handlers =
            this.props.handlers ||
            Object.keys(MAILTO_HANDLERS).filter((h) =>
                MAILTO_HANDLERS[h].countries.some((c) => ['all', globals.country].includes(c))
            );

        const my_ref_text = `${t_r('my-reference', props.letter.props.language)}: ${props.letter.props.reference}`;
        const data = {
            email: props.email,
            subject: encodeURIComponent(
                props.letter.props.subject ? `${props.letter.props.subject} (${my_ref_text})` : my_ref_text
            ),
            body: encodeURIComponent(props.letter.toEmailString()),
        };
        const handler_buttons = handlers.map((h) => (
            // eslint-disable-next-line jsx-a11y/anchor-is-valid
            <a
                href={MAILTO_HANDLERS[h].link?.(data)}
                onClick={(e) => {
                    if (!props.letter) e.preventDefault();
                    else {
                        if (MAILTO_HANDLERS[h].onClick) MAILTO_HANDLERS[h].onClick(data);
                        props.onSuccess();
                    }
                }}
                className="button button-secondary button-full-width"
                target="_blank"
                rel="noreferrer noopener"
                style="margin-top: 10px;">
                {t(h, 'mailto')}
            </a>
        ));

        return (
            <IntlProvider scope="generator" definition={I18N_DEFINITION}>
                <div
                    className={'dropdown-container' + (!props.enabled ? ' disabled' : '')}
                    style="display: inline-block;">
                    <button disabled={!props.enabled} className={props.className}>
                        {this.props.buttonText || <Text id={props.done ? 'send-email-again' : 'send-email'} />}
                        &nbsp;&nbsp;
                        <span className={'icon ' + (props.done ? 'icon-paper-plane' : 'icon-email')} />
                    </button>
                    {props.enabled ? (
                        <div className="dropdown" style="padding: 15px; width: 270px; max-width: 90vw;">
                            <Text id="mailto-dropdown-explanation" />

                            {handler_buttons}

                            <small>
                                <Text id="mailto-dropdown-warning" />
                            </small>
                        </div>
                    ) : (
                        ''
                    )}
                </div>
            </IntlProvider>
        );
    }

    static propTypes = {
        letter: PropTypes.object,
        handlers: PropTypes.array,
        email: PropTypes.string.isRequired,
        onSuccess: PropTypes.func.isRequired,
        done: PropTypes.bool.isRequired,
        className: PropTypes.string.isRequired,
        enabled: PropTypes.bool.isRequired,
        buttonText: PropTypes.oneOfType([PropTypes.elementType, PropTypes.arrayOf(PropTypes.elementType)]),
    };
}
