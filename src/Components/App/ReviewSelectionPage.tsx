import { Text } from 'preact-i18n';
import { useGeneratorStore } from '../../store/generator';
import { SetPageFunction } from './App';
import { CompanyResult } from './CompanyResult';
import t from '../../Utility/i18n';
import { ErrorException } from '../../Utility/errors';

type ReviewSelectionPageProps = {
    setPage: SetPageFunction;
};

export const ReviewSelectionPage = (props: ReviewSelectionPageProps) => {
    const batch = useGeneratorStore((state) => state.batch);
    const removeFromBatch = useGeneratorStore((state) => state.removeFromBatch);
    const resetRequestToDefault = useGeneratorStore((state) => state.resetRequestToDefault);

    if (!batch) throw new ErrorException('Got to review selection page without batch.');

    return (
        <>
            {Object.values(batch).map((c) => (
                <CompanyResult
                    company={c.company}
                    showDetails={true}
                    actionElement={
                        <button
                            className="company-remove button button-secondary button-small icon-trash"
                            onClick={() => removeFromBatch(c.company.slug)}
                            title={t('deselect-company', 'generator')}
                        />
                    }
                />
            ))}

            <button
                className="button button-primary app-cta"
                disabled={(Object.keys(batch || {}).length || 0) < 1}
                onClick={() => {
                    // This also advances the batch.
                    resetRequestToDefault(true);
                    props.setPage('fill_requests');
                }}>
                <Text id="continue-with-requests" />
            </button>
        </>
    );
};
