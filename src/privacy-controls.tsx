import { render } from 'preact';
import { IntlProvider, Text, MarkupText } from 'preact-i18n';
import t from './Utility/i18n';
import { Privacy, PRIVACY_ACTIONS } from './Utility/Privacy';
import { UserRequests } from './DataType/UserRequests';
import { SavedIdData } from './DataType/SavedIdData';
import { SavedCompanies } from './DataType/SavedCompanies';
import { FlashMessage, flash } from './Components/FlashMessage';
import { useModal } from './Components/Modal';
import { useState } from 'preact/hooks';
import { useProceedingsStore } from './store/proceedings';

const successFlash = () => flash(<FlashMessage type="success">{t('clear-success', 'privacy-controls')}</FlashMessage>);

type PrivacyControlProps = {
    privacyAction: keyof typeof PRIVACY_ACTIONS;
    showModal?: () => void;
};
const PrivacyControl = (props: PrivacyControlProps) => (
    <div className="privacy-control">
        <tr>
            <td>
                <input
                    id={PRIVACY_ACTIONS[props.privacyAction].id + '-checkbox'}
                    checked={Privacy.isAllowed(PRIVACY_ACTIONS[props.privacyAction])}
                    type="checkbox"
                    className="form-element"
                    onChange={(event) => {
                        Privacy.setAllowed(PRIVACY_ACTIONS[props.privacyAction], event.currentTarget.checked);
                        flash(
                            <FlashMessage type="success">{t('cookie-change-success', 'privacy-controls')}</FlashMessage>
                        );

                        if (!event.currentTarget.checked && props.showModal) props.showModal();
                    }}
                />
            </td>
            <td>
                <label htmlFor={PRIVACY_ACTIONS[props.privacyAction].id + '-checkbox'}>
                    <Text id={PRIVACY_ACTIONS[props.privacyAction].id} />
                </label>
                <br />
                <MarkupText id={PRIVACY_ACTIONS[props.privacyAction].id + '-description'} />
            </td>
        </tr>
    </div>
);

const clearCookies = () => {
    Privacy.clearAllCookies();
    window.location.reload();
};

const PrivacyControls = () => {
    const [clickFromButton, setClickFromButton] = useState(false);
    const clearProceedings = useProceedingsStore((state) => state.clearProceedings);

    const [ClearIdDataModal, showClearIdDataModal, dismissClearIdDataModal] = useModal(
        <Text id={clickFromButton ? 'modal-clear-id_data' : 'confirm-delete-id_data'} />,
        {
            positiveText: <Text id="clear-id_data" />,
            negativeText: <Text id="cancel" />,
            onNegativeFeedback: () => dismissClearIdDataModal(),
            onPositiveFeedback: () => {
                new SavedIdData().clear();
                successFlash();
                dismissClearIdDataModal();
            },
            onDismiss: () => setClickFromButton(false),
        }
    );

    const [ClearMyRequestsModal, showClearMyRequestsModal, dismissClearMyRequestsModal] = useModal(
        <Text id={clickFromButton ? 'modal-clear-requests' : 'confirm-delete-my-requests'} />,
        {
            positiveText: <Text id="confirm-clear-requests" />,
            negativeText: <Text id="cancel" />,
            onNegativeFeedback: () => dismissClearMyRequestsModal(),
            onPositiveFeedback: () => {
                new UserRequests().clearRequests();
                clearProceedings();
                successFlash();
                dismissClearMyRequestsModal();
            },
            onDismiss: () => setClickFromButton(false),
        }
    );

    const [ClearWizardEntriesModal, showClearWizardEntriesModal, dismissClearWizardEntriesModal] = useModal(
        <Text id={clickFromButton ? 'modal-clear-save_wizard_entries' : 'confirm-delete-save_wizard_entries'} />,
        {
            positiveText: <Text id="confirm-clear-save_wizard_entries" />,
            negativeText: <Text id="cancel" />,
            onNegativeFeedback: () => dismissClearWizardEntriesModal(),
            onPositiveFeedback: () => {
                new SavedCompanies().clearAll();
                successFlash();
                dismissClearWizardEntriesModal();
            },
            onDismiss: () => setClickFromButton(false),
        }
    );

    return (
        <main>
            <ClearIdDataModal />
            <ClearMyRequestsModal />
            <ClearWizardEntriesModal />
            <MarkupText id="explanation" />

            <table>
                {Object.keys(PRIVACY_ACTIONS).map((action) => (
                    <PrivacyControl
                        privacyAction={action}
                        showModal={
                            action === 'SAVE_ID_DATA'
                                ? showClearIdDataModal
                                : action === 'SAVE_MY_REQUESTS'
                                ? showClearMyRequestsModal
                                : action === 'SAVE_WIZARD_ENTRIES'
                                ? showClearWizardEntriesModal
                                : undefined
                        }
                    />
                ))}
            </table>
            <div id="privacy-controls-buttons">
                <button
                    id="clear-requests-button"
                    className="button button-secondary"
                    onClick={() => {
                        setClickFromButton(true);
                        showClearMyRequestsModal();
                    }}>
                    <Text id="clear-my-requests" />
                </button>
                <button
                    id="clear-id_data-button"
                    className="button button-secondary"
                    onClick={() => {
                        setClickFromButton(true);
                        showClearIdDataModal();
                    }}>
                    <Text id="clear-id_data" />
                </button>
                <button
                    id="clear-saved_wizard_entries-button"
                    className="button button-secondary"
                    onClick={() => {
                        setClickFromButton(true);
                        showClearWizardEntriesModal();
                    }}>
                    <Text id="clear-save_wizard_entries" />
                </button>
                <button id="clear-cookies-button" className="button button-secondary" onClick={clearCookies}>
                    <Text id="clear-cookies" />
                </button>
            </div>
            <div className="clearfix" />
        </main>
    );
};

const main = document.querySelector('main');
render(
    <IntlProvider scope="privacy-controls" definition={window.I18N_DEFINITION}>
        <PrivacyControls />
    </IntlProvider>,
    main!.parentElement!,
    main!
);
