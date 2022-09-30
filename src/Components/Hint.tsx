import { IntlProvider, MarkupText } from 'preact-i18n';
import { useCallback, useState } from 'preact/hooks';
import { useAppStore } from '../store/app';
import t from '../Utility/i18n';

export type HintId = 'new-generator' | 'advanced-generator';

type HintProps = {
    id: HintId;
};

export const Hint = (props: HintProps) => {
    const [isDismissed, dismissHint] = useAppStore((state) => [
        state.dismissedHints.includes(props.id),
        state.dismissHint,
    ]);

    const [fadingOut, setFadingOut] = useState(false);

    const dismiss = useCallback(() => {
        setFadingOut(true);
        setTimeout(() => {
            dismissHint(props.id);
        }, 290);
    }, [dismissHint, props.id]);

    if (isDismissed) return <></>;

    return (
        <IntlProvider scope="hints" definition={window.I18N_DEFINITION}>
            <div className={`box box-info hint ${fadingOut ? ' fade-out' : ''}`}>
                <button
                    className="button-unstyled close-button icon-close"
                    onClick={dismiss}
                    title={t('dismiss-hint', 'hints')}
                />

                <MarkupText id={props.id} />
            </div>
        </IntlProvider>
    );
};
