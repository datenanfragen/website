import { useEffect } from 'preact/hooks';
import { MarkupText } from 'preact-i18n';
import { useGeneratorStore } from '../../store/generator';
import { SetPageFunction } from './App';
import { StatefulDynamicInputContainer } from '../Generator/DynamicInputContainer';
import { SendRequestButton } from '../App/SendRequestButton';
import { ErrorException } from '../../Utility/errors';

type FillRequestsPageProps = {
    setPage: SetPageFunction;
};

export const FillRequestsPage = (props: FillRequestsPageProps) => {
    const [batch, current_company] = useGeneratorStore((state) => [state.batch, state.current_company]);
    const resetRequestToDefault = useGeneratorStore((state) => state.resetRequestToDefault);

    useEffect(() => {
        if (!current_company) resetRequestToDefault(true);
    }, [current_company, resetRequestToDefault]);

    if (!batch) throw new ErrorException('Got to fill requests page without batch.');
    if (!current_company) return <></>;

    return (
        <>
            <h2>{current_company.name}</h2>
            {/* TODO: Better explanation. */}
            <MarkupText id="id-data-explanation" />
            {/* TODO: Maybe the "add new input" stuff should be more like the fill fields dropdown? That thing currently takes up a lot of space and is confusing, especially since ideally, users should even need it. We could even combine it with the fill fields dropdown! */}
            <StatefulDynamicInputContainer allowAddingFields={false} />
            {/* TODO: Don't we need to call `renderLetter()`? (From a quick investigation: Emails don't need it (even though it does something for emails…) but PDFs do.) */}
            <SendRequestButton />
        </>
    );
};
