import { render, Component } from 'preact';
import { IntlProvider, Text, MarkupText } from 'preact-i18n';
import t from 'Utility/i18n';
import Privacy, { PRIVACY_ACTIONS } from 'Utility/Privacy';
import UserRequests from './my-requests';
import Modal from './Components/Modal';
import SavedIdData from './Utility/SavedIdData';
import { SavedCompanies } from './Components/Wizard';
import FlashMessage, { flash } from 'Components/FlashMessage';
import PropTypes from 'prop-types';

class PrivacyControl extends Component {
    constructor(props) {
        super(props);

        this.meta = PRIVACY_ACTIONS[this.props.privacy_action];

        this.state = {
            enabled: Privacy.isAllowed(PRIVACY_ACTIONS[this.props.privacy_action]),
        };

        this.onChange = this.onChange.bind(this);
    }

    onChange(event) {
        this.setState(
            {
                enabled: event.target.checked,
            },
            () => {
                // setState is async
                Privacy.setAllowed(PRIVACY_ACTIONS[this.props.privacy_action], this.state.enabled);
                flash(<FlashMessage type="success">{t('cookie-change-success', 'privacy-controls')}</FlashMessage>);

                if (this.state.enabled === false) {
                    switch (this.props.privacy_action) {
                        case 'SAVE_ID_DATA':
                            this.clearModal(
                                'clear-id_data',
                                'confirm-delete-id_data',
                                PrivacyControls.clearSavedIdData
                            );
                            break;
                        case 'SAVE_MY_REQUESTS':
                            this.clearModal(
                                'confirm-clear-requests',
                                'confirm-delete-my-requests',
                                PrivacyControls.clearRequests
                            );
                            break;
                        case 'SAVE_WIZARD_ENTRIES':
                            this.clearModal(
                                'confirm-clear-save_wizard_entries',
                                'confirm-delete-save_wizard_entries',
                                PrivacyControls.clearSavedCompanies
                            );
                            break;
                    }
                }
            }
        );
    }

    render() {
        return (
            <div className="privacy-control">
                <trow>
                    <td>
                        <input
                            id={this.meta.id + '-checkbox'}
                            checked={this.state.enabled}
                            type="checkbox"
                            className="form-element"
                            onChange={this.onChange}
                        />
                    </td>
                    <td>
                        <label htmlFor={this.meta.id + '-checkbox'}>
                            <Text id={this.meta.id} />
                        </label>
                        <br />
                        <MarkupText id={this.meta.id + '-description'} />
                    </td>
                </trow>
            </div>
        );
    }

    clearModal(button_text_id, body_text_id, clear_function) {
        this.props.showModal(
            <Modal
                positiveText={t(button_text_id, 'privacy-controls')}
                negativeText={t('cancel', 'privacy-controls')}
                onNegativeFeedback={this.props.hideModal}
                onPositiveFeedback={() => {
                    this.props.hideModal();
                    clear_function();
                }}
                positiveDefault={true}
                onDismiss={this.props.hideModal}>
                <Text id={body_text_id} />
            </Modal>
        );
    }

    static propTypes = {
        privacy_action: PropTypes.oneOf(Object.keys(PRIVACY_ACTIONS)).isRequired,
        showModal: PropTypes.func.isRequired,
        hideModal: PropTypes.func.isRequired,
    };
}

class PrivacyControls extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modal: '',
        };

        this.clearRequestsButton = this.clearRequestsButton.bind(this);
        this.clearSavedCompaniesButton = this.clearSavedCompaniesButton.bind(this);
        this.clearSavedIdDataButton = this.clearSavedIdDataButton.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.showModal = this.showModal.bind(this);
    }

    render() {
        let controls = [];
        Object.keys(PRIVACY_ACTIONS).forEach((action) => {
            controls.push(
                <PrivacyControl privacy_action={action} showModal={this.showModal} hideModal={this.hideModal} />
            );
        });

        return (
            <main>
                {this.state.modal}
                <MarkupText id="explanation" />

                <table>{controls}</table>
                <div id="privacy-controls-buttons">
                    <button
                        id="clear-requests-button"
                        className="button button-secondary"
                        onClick={this.clearRequestsButton}>
                        <Text id="clear-my-requests" />
                    </button>
                    <button
                        id="clear-id_data-button"
                        className="button button-secondary"
                        onClick={this.clearSavedIdDataButton}>
                        <Text id="clear-id_data" />
                    </button>
                    <button
                        id="clear-saved_wizard_entries-button"
                        className="button button-secondary"
                        onClick={this.clearSavedCompaniesButton}>
                        <Text id="clear-save_wizard_entries" />
                    </button>
                    <button
                        id="clear-cookies-button"
                        className="button button-secondary"
                        onClick={PrivacyControls.clearCookies}>
                        <Text id="clear-cookies" />
                    </button>
                </div>
                <div className="clearfix" />
            </main>
        );
    }

    static successFlash() {
        flash(<FlashMessage type="success">{t('clear-success', 'privacy-controls')}</FlashMessage>);
    }

    clearRequestsButton() {
        this.showModal(
            <Modal
                positiveText={t('confirm-clear-requests', 'privacy-controls')}
                negativeText={t('cancel', 'privacy-controls')}
                onNegativeFeedback={this.hideModal}
                onPositiveFeedback={(e) => {
                    this.hideModal();
                    PrivacyControls.clearRequests();
                }}
                positiveDefault={true}
                onDismiss={this.hideModal}>
                <Text id="modal-clear-requests" />
            </Modal>
        );
    }

    clearSavedIdDataButton() {
        this.showModal(
            <Modal
                positiveText={t('clear-id_data', 'privacy-controls')}
                negativeText={t('cancel', 'privacy-controls')}
                onNegativeFeedback={this.hideModal}
                onPositiveFeedback={(e) => {
                    this.hideModal();
                    PrivacyControls.clearSavedIdData();
                }}
                positiveDefault={true}
                onDismiss={this.hideModal}>
                <Text id="modal-clear-id_data" />
            </Modal>
        );
    }

    clearSavedCompaniesButton() {
        this.showModal(
            <Modal
                positiveText={t('confirm-clear-save_wizard_entries', 'privacy-controls')}
                negativeText={t('cancel', 'privacy-controls')}
                onNegativeFeedback={this.hideModal}
                onPositiveFeedback={(e) => {
                    this.hideModal();
                    PrivacyControls.clearSavedCompanies();
                }}
                positiveDefault={true}
                onDismiss={this.hideModal}>
                <Text id="modal-clear-save_wizard_entries" />
            </Modal>
        );
    }

    static clearRequests() {
        new UserRequests().clearRequests();
        PrivacyControls.successFlash();
    }

    static clearSavedIdData() {
        new SavedIdData().clear(false);
        PrivacyControls.successFlash();
    }

    static clearSavedCompanies() {
        new SavedCompanies().clearAll();
        PrivacyControls.successFlash();
    }

    showModal(modal) {
        this.setState({ modal: modal });
    }

    hideModal() {
        this.setState({ modal: '' });
    }

    static clearCookies() {
        Privacy.clearAllCookies();
        window.location.reload();
    }
}

let main = document.querySelector('main');
render(
    <IntlProvider scope="privacy-controls" definition={I18N_DEFINITION}>
        <PrivacyControls />
    </IntlProvider>,
    main.parentElement,
    main
);
