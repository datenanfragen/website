import { useEffect, useMemo } from 'preact/hooks';
import { useProceedingsStore } from '../store/proceedings';
import t from '../Utility/i18n';

type ProceedingsBadgeProps = {
    /**
     * Element that is the visual parent of the badge that the class 'has-batch' should be added to.
     */
    visualParent?: Element;
};

export const ProceedingsBadge = (props: ProceedingsBadgeProps) => {
    const proceedings = useProceedingsStore((state) => state.proceedings);

    const overdueProceedingsCount = useMemo(
        () => Object.values(proceedings).filter((p) => p.status === 'overdue').length,
        [proceedings]
    );

    useEffect(
        () => void props.visualParent?.classList.toggle('has-batch', overdueProceedingsCount > 0),
        [overdueProceedingsCount, props.visualParent]
    );

    if (overdueProceedingsCount == 0) return <></>;

    return (
        <span
            className="badge badge-error"
            title={`${overdueProceedingsCount} ${t(
                'overdue-proceedings',
                'my-requests',
                undefined,
                overdueProceedingsCount
            )}`}>
            {overdueProceedingsCount}
            <span className="sr-only">
                {' '}
                {t('overdue-proceedings', 'my-requests', undefined, overdueProceedingsCount)}
            </span>
        </span>
    );
};
