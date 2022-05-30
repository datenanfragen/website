import { useGeneratorStore } from '../../store/generator';
import { SetPageFunction } from './App';

type ReviewSelectionPageProps = {
    setPage: SetPageFunction;
};

export const ReviewSelectionPage = (props: ReviewSelectionPageProps) => {
    const batch = useGeneratorStore((state) => state.batch);

    return <>{batch}</>;
};
