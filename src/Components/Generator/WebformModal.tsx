import { IntlProvider, Text } from 'preact-i18n';
import type { RequestLetter } from '../../DataType/RequestLetter';
import { useInputSelectAll } from '../../hooks/useInputSelectAll';
import { useModal } from '../Modal';

type WebformModalProps = {
    letter: () => RequestLetter;
    webform: string | undefined;
};

export const useWebformModal = (props: WebformModalProps) => {
    const [onCopyManuallyInputClick, unsetCopyManuallyPreviousActiveElement] = useInputSelectAll();

    const [WebformModal, showWebformModal, dismissWebformModal] = useModal(
        <IntlProvider scope="generator" definition={window.I18N_DEFINITION}>
            <Text id="webform-modal-explanation" />

            <div className="form-group">
                <strong>
                    <label htmlFor="webform-modal-subject">
                        <Text id="subject" />
                    </label>
                </strong>
                <input
                    type="text"
                    id="webform-modal-subject"
                    className="form-element"
                    value={props.letter().props.subject}
                    onClick={onCopyManuallyInputClick}
                    readOnly
                />
                <strong>
                    <label htmlFor="webform-modal-body">
                        <Text id="body" />
                    </label>
                </strong>
                <textarea
                    id="webform-modal-body"
                    className="form-element"
                    rows={10}
                    onClick={onCopyManuallyInputClick}
                    readOnly>
                    {props.letter().toEmailString()}
                </textarea>
            </div>
        </IntlProvider>,
        {
            onPositiveFeedback: () => {
                dismissWebformModal();
            },
            onDismiss: unsetCopyManuallyPreviousActiveElement,
            positiveButton: (
                <a
                    className="button button-primary"
                    style="float: right;"
                    target="_blank"
                    rel="noreferrer"
                    href={props.webform}>
                    <Text id="open-webform" />
                </a>
            ),
        }
    );

    return [WebformModal, showWebformModal, dismissWebformModal] as const;
};
