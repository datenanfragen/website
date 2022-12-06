import type { JSX } from 'preact';
import { useCallback, useState } from 'preact/hooks';

type UseWizardProps<PageId extends string, InitialPageId extends PageId> = {
    initialPageId?: InitialPageId;
    onPageChange?: (old_page: PageId | undefined, new_page: PageId) => void;
};

export type WizardPages<PageId extends string> = Record<
    PageId,
    { component: JSX.Element; title?: string; canGoBack?: boolean }
>;

export const useWizard = <PageId extends string, InitialPageId extends PageId>(
    pages: WizardPages<PageId>,
    props?: UseWizardProps<PageId, InitialPageId>
) => {
    const [pageId, setPageId] = useState<PageId | undefined>(props?.initialPageId);
    const [history, setHistory] = useState<PageId[]>(props?.initialPageId ? [props.initialPageId] : []);
    const { onPageChange } = props || {};

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
        Wizard: () => <section data-page-id={pageId}>{pageId ? pages[pageId].component : <></>}</section>,
        set,
        back,
        pageId,
        canGoBack: history.length > 1 && pageId && pages[pageId].canGoBack,
        pageTitle: pageId ? pages[pageId].title : '',
    };
};
