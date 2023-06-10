import { IntlProvider } from 'preact-i18n';
import { t_a, useProceedingsStore } from '../../index';
import { useMemo } from 'preact/hooks';
import type { ComponentChildren } from 'preact';

type AppMenuProps<PageId extends string> = {
    setPage: (newPage: PageId) => void;
    activePage: PageId | undefined;
};

export const AppMenu = <PageId extends string>(props: AppMenuProps<PageId>) => {
    const proceedings = useProceedingsStore((state) => state.proceedings);
    const overdueProceedings = useMemo(
        () => Object.values(proceedings).filter((p) => p.status === 'overdue'),
        [proceedings]
    );

    const menuItems: Array<{ title: string; pageId: PageId; icon: string; badge?: ComponentChildren }> = useMemo(
        () => [
            {
                title: t_a('new-requests', 'app'),
                pageId: 'newRequests' as PageId,
                icon: 'plus-circle',
            },
            {
                title: t_a('proceedings', 'app'),
                pageId: 'proceedings' as PageId,
                icon: 'conversation',
                badge:
                    overdueProceedings.length > 0 ? (
                        <>
                            {overdueProceedings.length}{' '}
                            <span className="sr-only">{t_a('overdue-requests', 'proceedings')}</span>
                        </>
                    ) : undefined,
            },
            { title: t_a('settings', 'app'), pageId: 'settings' as PageId, icon: 'settings' },
        ],
        [overdueProceedings]
    );

    return (
        <IntlProvider definition={window.I18N_DEFINITION_APP} scope="app">
            <nav id="main-menu">
                <ul>
                    {menuItems.map((item) => (
                        <li className={item.pageId === props.activePage ? ' menu-item-active' : ''}>
                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                            <a
                                href=""
                                className={`menu-link icon icon-${item.icon} has-badge`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    props.setPage(item.pageId);
                                }}
                                title={item.title}>
                                {item.badge && <span className="badge">{item.badge}</span>}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </IntlProvider>
    );
};
