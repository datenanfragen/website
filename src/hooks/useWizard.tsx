import type { JSX } from 'preact';
import { useCallback, useState } from 'preact/hooks';

type UseWizardProps<PageId extends string, InitialPageId extends PageId> = {
    initialPageId: InitialPageId;
    onPageChange?: (old_page: PageId, new_page: PageId) => void;
};

export const useWizard = <PageId extends string, InitialPageId extends PageId>(
    pages: Record<PageId, JSX.Element>,
    props: UseWizardProps<PageId, InitialPageId>
) => {
    const [pageId, setPageId] = useState<PageId>(props.initialPageId);
    const [history, setHistory] = useState<PageId[]>([props.initialPageId]);
    const { onPageChange } = props;

    const set = useCallback(
        (newPageId: PageId) => {
            onPageChange?.(pageId, newPageId);
            setHistory(history.concat([newPageId]));
            setPageId(newPageId);
        },
        [pageId, history, onPageChange]
    );

    const back = useCallback(() => {
        history.pop();
        const newPageId = history[history.length - 1];
        if (newPageId) {
            setHistory(history);
            setPageId(newPageId);
        }
    }, [history]);

    return {
        Wizard: () => <section data-page-id={pageId}>{pages[pageId]}</section>,
        set,
        back,
        pageId,
        canGoBack: history.length > 1,
    };
};
