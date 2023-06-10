import { IntlProvider, Text } from 'preact-i18n';
import { useMemo } from 'preact/hooks';
import { useAppStore } from '../store/app';
import { getGeneratedMessage, getNameFromMesssage, useProceedingsStore } from '../store/proceedings';
import t from '../Utility/i18n';

export const ReminderWidget = () => {
    const proceedings = useProceedingsStore((state) => state.proceedings);
    const setProceedingStatus = useProceedingsStore((state) => state.setProceedingStatus);
    const overdueProceedings = useMemo(
        () => Object.values(proceedings).filter((p) => p.status === 'overdue'),
        [proceedings]
    );

    const [country, savedLocale] = useAppStore((state) => [state.country, state.savedLocale]);

    if (overdueProceedings.length === 0) return <></>;

    return (
        <IntlProvider scope="my-requests" definition={window.I18N_DEFINITION}>
            <details className="reminder-widget">
                <summary>
                    <Text
                        id="reminder-widget-summary"
                        plural={overdueProceedings.length}
                        fields={{ proceedings: overdueProceedings.length }}
                    />
                </summary>
                <div className="reminder-widget-content">
                    <ul>
                        {overdueProceedings.map((p) => {
                            const originalRequest = getGeneratedMessage(p, 'request')!;
                            const dateLocale = country === 'all' ? savedLocale : `${savedLocale}-${country}`;

                            return (
                                <li>
                                    <div className="reminder-list-text">
                                        <Text
                                            id="request-summary-line"
                                            fields={{
                                                type: t(originalRequest.type, 'my-requests'),
                                                recipient: getNameFromMesssage(originalRequest),
                                                date: originalRequest?.date.toLocaleDateString(dateLocale, {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                }),
                                                reference: p.reference,
                                            }}
                                        />
                                    </div>
                                    <div className="reminder-list-buttons">
                                        <a
                                            className="button button-small icon icon-gavel"
                                            href={`${window.BASE_URL}generator?reference=${p.reference}`}
                                            title={t('message-react', 'my-requests')}>
                                            <span className="sr-only">
                                                <Text id="message-react" />
                                            </span>
                                        </a>{' '}
                                        <button
                                            className="button button-small icon icon-check-mark"
                                            onClick={() => setProceedingStatus(p.reference, 'done')}
                                            title={t('mark-completed', 'my-requests')}>
                                            <span className="sr-only">
                                                <Text id="mark-completed" />
                                            </span>
                                        </button>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <a href={`${window.BASE_URL}my-requests/`} className="reminder-widget-bottom-link">
                    <Text id="see-more-details" /> <span style="float: right;" className="icon-arrow-right" />
                </a>
            </details>
        </IntlProvider>
    );
};
