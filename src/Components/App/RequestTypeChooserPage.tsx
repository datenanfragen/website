import { Text } from 'preact-i18n';
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

// TODO: Isn't "<x> request" an implementation detail? Shouldn't we rather ask "What do you want to do?", with answers
// like "Find out what data companies have on me".

export const RequestTypeChooserPage = (props: RequestTypeChooserPageProps) => {
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
                    onClick={() => props.setPage('company_search')}
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
};
