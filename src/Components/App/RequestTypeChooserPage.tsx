import { IntlProvider, MarkupText, Text } from 'preact-i18n';
import { useGeneratorStore } from '../../store/generator';
import { SetPageFunction } from './App';
import { Radio } from '../../Components/Radio';
import { useModal } from '../../Components/Modal';
import { REQUEST_TYPES } from '../../Utility/requests';
import t from '../../Utility/i18n';
import { RequestType } from '../../types/request.d';

type RequestTypeChooserPageProps = {
    request_types?: RequestType[];

    setPage: SetPageFunction;
};

export const RequestTypeChooserPage = (props: RequestTypeChooserPageProps) => {
    const request_types = (props.request_types || REQUEST_TYPES).filter((r) => r !== 'custom');
    const setBatchRequestType = useGeneratorStore((state) => state.setBatchRequestType);
    const request_type = useGeneratorStore((state) => state.batchRequestType);

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
            <div className="col66 col100-mobile">
                <RequestTypeInfoModal />
                <Radio
                    id={`request-type-choice-${type}`}
                    radioVariable={request_type || ''}
                    value={type}
                    name="request-type"
                    onChange={(value) => setBatchRequestType(value as RequestType)}
                    onClick={() => props.setPage('company_search')}
                    label={<MarkupText id={`${type}-request-statement`} />}
                    addon={
                        <button
                            className="button button-secondary icon-question-mark"
                            onClick={showRequestTypeInfoModal}
                        />
                    }
                />
            </div>
        );
    };

    return (
        <IntlProvider definition={window.I18N_DEFINITION} scope="generator">
            <p>TODO: Quick introductory text.</p>
            <div className="radio-group radio-group-vertical radio-group-padded">
                {request_types.map((type) => (
                    <RadioWithModal type={type} />
                ))}
            </div>
            <div className="clearfix" />
        </IntlProvider>
    );
};
