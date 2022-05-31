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

    if (!batch) throw new ErrorException('Got to review selection page without batch.');

    return (
        <>
            {Array.from(batch.values()).map((c) => (
                <CompanyResult
                    company={c}
                    actionElement={
                        <button
                            className="company-remove button button-primary button-small icon-trash"
                            onClick={() => removeFromBatch(c.slug)}
                            title={t('deselect-company', 'generator')}
                        />
                    }
                />
            ))}

            <button
                className="button button-secondary button-small"
                disabled={(batch?.size || 0) < 1}
                onClick={() => props.setPage('fill_requests')}>
                <Text id="continue-with-requests" />
            </button>
        </>
    );
};
