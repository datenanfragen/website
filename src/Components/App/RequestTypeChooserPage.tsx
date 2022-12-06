import { IntlProvider, MarkupText, Text } from 'preact-i18n';
import { useGeneratorStore } from '../../store/generator';
import { SetPageFunction } from './App';
import { useModal } from '../../Components/Modal';
import { REQUEST_TYPES } from '../../Utility/requests';
import t from '../../Utility/i18n';
import { RequestType } from '../../types/request.d';

type RequestTypeChooserPageProps = {
    request_types?: RequestType[];

    setPage: SetPageFunction;
};

export const RequestTypeChooserPage = (props: RequestTypeChooserPageProps) => {
    const requestTypes = (props.request_types || REQUEST_TYPES).filter((r) => r !== 'custom') as Exclude<
        RequestType,
        'custom'
    >[];
    const setBatchRequestType = useGeneratorStore((state) => state.setBatchRequestType);
    const batchLength = useGeneratorStore((state) => Object.keys(state.batch || {}).length);

    const RequestButtonWithModal = ({ type }: { type: Exclude<RequestType, 'custom'> }) => {
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
            <div className="request-type-chooser-page">
                <RequestTypeInfoModal />
                <div id={`request-type-choice-${type}`} className="request-type-button-group">
                    <button
                        name="request-type"
                        className="button button-secondary"
                        onClick={() => {
                            setBatchRequestType(type);
                            if (window.PARAMETERS.company && batchLength === 1) props.setPage('fill_requests');
                            else if (window.PARAMETERS.companies && batchLength > 0) props.setPage('review_selection');
                            else props.setPage('company_search');
                        }}>
                        <MarkupText id={`${type}-request-statement`} />
                    </button>
                    <button
                        className="button button-secondary icon-question-mark request-type-help-button"
                        onClick={showRequestTypeInfoModal}
                        title={t(`${type}-request-explanation-button`, 'generator')}
                    />
                </div>
            </div>
        );
    };

    return (
        <IntlProvider definition={window.I18N_DEFINITION} scope="generator">
            <p>
                <Text id="app-introduction" />
            </p>
            <div className="col66 col100-mobile">
                <div className="request-type-chooser-vertical">
                    {requestTypes.map((type) => (
                        <RequestButtonWithModal type={type} />
                    ))}
                </div>
            </div>

            <div className="clearfix" />
        </IntlProvider>
    );
};
