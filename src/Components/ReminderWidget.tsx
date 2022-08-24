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
            <div className="box">
                <Text id="you-have-open-requests" />
                <ul>
                    {overdueProceedings.map((p) => {
                        const originalRequest = getGeneratedMessage(p, 'request')!;
                        const dateLocale = country === 'all' ? savedLocale : `${savedLocale}-${country}`;

                        return (
                            <li>
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
                                <br />
                                <a
                                    className="button button-small"
                                    href={`${window.BASE_URL}app?reference=${p.reference}`}>
                                    <Text id="message-react" />
                                </a>{' '}
                                <button
                                    className="button button-small"
                                    onClick={() =>
                                        confirm(t('mark-completed-are-you-sure', 'my-requests')) &&
                                        setProceedingStatus(p.reference, 'done')
                                    }>
                                    <Text id="mark-completed" />
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </IntlProvider>
    );
};
