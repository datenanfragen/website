import preact from 'preact';
import { IntlProvider, Text, MarkupText } from 'preact-i18n';
import Privacy, {PRIVACY_ACTIONS} from "./Privacy";

class PrivacyControl extends preact.Component {
    constructor(props) {
        super(props);

        this.meta = PRIVACY_ACTIONS[this.props.privacy_action];

        this.state = {
            enabled: Privacy.isAllowed(PRIVACY_ACTIONS[this.props.privacy_action])
        };

        this.onChange = this.onChange.bind(this);
    }

    onChange(event) {
        this.setState({
            enabled: event.target.checked
        });

        /* TODO: I think we need some kind of 'feedback' here to confirm to the user that the setting has indeed been saved. */
        Privacy.setAllowed(PRIVACY_ACTIONS[this.props.privacy_action], this.state.enabled);
    }

    render() {
        return <div className="privacy-control">
            <trow>
                <td><input id={this.meta.id + '-checkbox'} checked={this.state.enabled} type="checkbox" onChange={this.onChange} /></td>
                <td><label for="this.meta.id + '-checkbox'"><Text id={this.meta.id}/></label><br/>
                    <MarkupText id={this.meta.id + '-description'}/></td>
            </trow>
        </div>;
    }
}

class PrivacyControls extends preact.Component {
    render() {
        let controls = [];
        Object.keys(PRIVACY_ACTIONS).forEach(action => {
            controls.push(<PrivacyControl privacy_action={action} />);
        });

        return (
            <main>
                <h1><Text id="title" /></h1>
                <MarkupText id="explanation" />

                <table>
                    {controls}
                </table>
                <button id="clear-button" onClick={PrivacyControls.clearCookies} style="float: right;"><Text id="clear-cookies" /></button>
                <div className="clearfix" />
            </main>
        );
    }

    static clearCookies() {
        Privacy.clearAllCookies();
        window.location.reload();
    }
}

preact.render((<IntlProvider scope="privacy-controls" definition={I18N_DEFINITION}><PrivacyControls/></IntlProvider>), null, document.querySelector('main'));
