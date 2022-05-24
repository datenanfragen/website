import { render } from 'preact';
import { useWizard } from './hooks/useWizard';
import { createGeneratorStore, RequestGeneratorProvider, useGeneratorStore } from './store/generator';
import t from './Utility/i18n';
import { Radio } from './Components/Radio';
import { RequestType, REQUEST_TYPES } from './types/request.d';
import { IntlProvider, Text } from 'preact-i18n';
import { useModal } from './Components/Modal';

type RequestTypeChooserPageProps = {
    request_types?: RequestType[];
};

const App = () => {
    const {
        Wizard,
        set: setPage,
        back,
        canGoBack,
    } = useWizard(
        {
            request_type_chooser: <RequestTypeChooserPage />,
            company_chooser: <></>,
        },
        { initialPageId: 'request_type_chooser' }
    );

    function RequestTypeChooserPage(props: RequestTypeChooserPageProps) {
        const request_types = (props.request_types || REQUEST_TYPES).filter((r) => r !== 'custom');
        const setRequestType = useGeneratorStore((state) => state.setRequestType);
        const request_type = useGeneratorStore((state) => state.request.type);

        const RadioWithModal = ({ type }: { type: RequestType }) => {
            const [RequestTypeInfoModal, showRequestTypeInfoModal, dismissRequestTypeInfoModal] = useModal(
                <>
                    <Text id={`request-type-info-${type}`} />
                    <br />
                    {/* TODO: Improve that blog post. */}
                    <a href={t('request-type-info-learn-more-url', 'generator')} target="_blank" rel="noreferrer">
                        <Text id="request-type-info-learn-more" />
                    </a>
                </>,
                {
                    positiveText: t('ok', 'generator'),
                    onPositiveFeedback: () => dismissRequestTypeInfoModal(),
                }
            );

            return (
                <>
                    <RequestTypeInfoModal />
                    <Radio
                        id={`request-type-choice-${type}`}
                        radioVariable={request_type}
                        value={type}
                        name="request-type"
                        onChange={(value) => setRequestType(value as RequestType)}
                        onClick={() => setPage('company_chooser')}
                        label={t(`${type}-request`, 'generator')}
                        addon={
                            <button
                                className="button button-secondary icon-question-mark"
                                onClick={showRequestTypeInfoModal}
                            />
                        }
                    />
                </>
            );
        };

        return (
            <>
                {t('request-type', 'generator')}
                <br />
                <div className="col60">
                    <div className="radio-group radio-group-vertical radio-group-padded">
                        {request_types.map((type) => (
                            <RadioWithModal type={type} />
                        ))}
                    </div>
                </div>
                <div className="clearfix" />
            </>
        );
    }

    return (
        <IntlProvider definition={window.I18N_DEFINITION} scope="generator">
            <div>
                <Wizard />
                <button
                    onClick={back}
                    disabled={!canGoBack}
                    className="button button-secondary button-small icon icon-arrow-left">
                    <Text id="back" />
                </button>
            </div>
        </IntlProvider>
    );
};

const elem = document.querySelector('main');
render(
    <RequestGeneratorProvider createStore={createGeneratorStore}>
        <App />
    </RequestGeneratorProvider>,
    elem!
);
