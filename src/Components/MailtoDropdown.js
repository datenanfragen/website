import preact from 'preact';
import { Text, IntlProvider } from 'preact-i18n';
import PropTypes from 'prop-types';
import t, { t_r } from '../Utility/i18n';

// TODO: I would like to extend this with country-specific services in the future. Unfortunately, I did not find a way
// to produce links for GMX and Web.de.
export const MAILTO_HANDLERS = {
    mailto: {
        link: d => `mailto:${d.email}?subject=${d.subject}&body=${d.body}`,
        countries: ['all']
    },
    gmail: {
        link: d => `https://mail.google.com/mail/?view=cm&fs=1&to=${d.email}&su=${d.subject}&body=${d.body}`,
        countries: ['all']
    },
    // TODO: Outlook doesn't work. I think our body may be too long. :(
    // Reference: https://blogs.msdn.microsoft.com/carloshm/2016/01/16/how-to-compose-a-new-message-or-event-and-populate-fields-in-office365/
    // outlook: {
    //     link: d =>
    //         `https://outlook.live.com/owa/?path=/mail/action/compose&to=${d.email}&subject=${d.subject}&body=${d.body}`,
    //     countries: ['all']
    // },
    yahoo: {
        link: d => `https://compose.mail.yahoo.com/?to=${d.email}&subject=${d.subject}&body=${d.body}`,
        countries: ['all']
    }
};

export default class MailtoDropdown extends preact.Component {
    render(props) {
        const handlers =
            this.props.handlers ||
            Object.keys(MAILTO_HANDLERS).filter(h =>
                MAILTO_HANDLERS[h].countries.some(c => ['all', globals.country].includes(c))
            );

        const data = {
            email: props.email,
            subject: encodeURIComponent(
                props.letter.props.subject +
                    ' (' +
                    t_r('my-reference', props.letter.props.language) +
                    ': ' +
                    props.letter.props.reference +
                    ')'
            ),
            body: encodeURIComponent(props.letter.toEmailString())
        };
        const handler_buttons = handlers.map(h => (
            <a
                href={MAILTO_HANDLERS[h].link(data)}
                onClick={e => {
                    if (!props.letter) e.preventDefault();
                    else props.onSuccess();
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
                <div className="dropdown-container" style="display: inline-block;">
                    <button className={props.className}>
                        {this.props.buttonText || <Text id={props.done ? 'send-email-again' : 'send-email'} />}
                        &nbsp;&nbsp;
                        <span className={'icon ' + (props.done ? 'icon-paper-plane' : 'icon-email')} />
                    </button>
                    {props.letter ? (
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
        buttonText: PropTypes.oneOf([PropTypes.string, PropTypes.element, PropTypes.arrayOf(PropTypes.element)])
    };
}
