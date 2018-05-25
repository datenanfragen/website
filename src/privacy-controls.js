import preact from 'preact';
import { IntlProvider, Text, MarkupText } from 'preact-i18n';
import t from 'i18n';
import Privacy, {PRIVACY_ACTIONS} from "./Privacy";
import UserRequests from "./my-requests";

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

        if(this.props.privacy_action === 'SAVE_MY_REQUESTS' && this.state.enabled === false) {
            if(confirm(t('confirm-delete-my-requests', 'privacy-controls'))) (new UserRequests()).clearRequests();
        }
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
                <MarkupText id="explanation" />

                <table>
                    {controls}
                </table>
                <button id="clear-cookies-button" onClick={PrivacyControls.clearCookies} style="float: right;"><Text id="clear-cookies" /></button>
                <button id="clear-requests-button" onClick={PrivacyControls.clearRequests} style="float: right; margin-right: 10px;"><Text id="clear-my-requests" /></button>
                <div className="clearfix" />
            </main>
        );
    }

    static clearRequests() {
        /* TODO: Indicate success. */
        (new UserRequests()).clearRequests();
    }

    static clearCookies() {
        Privacy.clearAllCookies();
        window.location.reload();
    }
}

preact.render((<IntlProvider scope="privacy-controls" definition={I18N_DEFINITION}><PrivacyControls/></IntlProvider>), null, document.querySelector('main'));
