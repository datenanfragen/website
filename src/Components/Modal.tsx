import { Fragment, ComponentChildren, JSX } from 'preact';
import { useState, useCallback, useMemo, useEffect } from 'preact/hooks';
import type { MergeExclusive } from 'type-fest';
import t from '../Utility/i18n';

type ModalOptions = Partial<
    {
        shownInitially: boolean;
        defaultButton: 'positive' | 'negative';
        hasDismissButton: boolean;
        backdropDismisses: boolean;
        escDismisses: boolean;

        innerStyle: string;

        onShow: () => void;
        onDismiss: () => void;
        onPositiveFeedback: () => void;
        onNegativeFeedback: () => void;
    } & MergeExclusive<{ positiveButton: JSX.Element }, { positiveText: string | JSX.Element }> &
        MergeExclusive<{ negativeButton: JSX.Element }, { negativeText: string | JSX.Element }>
>;
const default_options = {
    shownInitially: false,
    defaultButton: 'positive' as 'positive' | 'negative',
    hasDismissButton: true,
    backdropDismisses: true,
    escDismisses: true,
};

export const useModal = (children: ComponentChildren, _options?: ModalOptions) => {
    const options: typeof default_options & ModalOptions = useMemo(
        () => ({ ...default_options, ..._options }),
        [_options]
    );

    const { onShow, onDismiss } = options;

    const [shown, setShown] = useState(options.shownInitially);

    const show = useCallback(() => {
        setShown(true);
        onShow?.();
    }, [onShow]);

    const dismiss = useCallback(() => {
        setShown(false);
        onDismiss?.();
    }, [onDismiss]);

    useEffect(() => {
        if (!options.escDismisses || !shown) return;

        const listener = (e: KeyboardEvent) => e.key === 'Escape' && dismiss();
        document.body.addEventListener('keydown', listener);

        return () => document.body.removeEventListener('keydown', listener);
    }, [dismiss, shown, options.escDismisses]);

    const Modal = useCallback(() => {
        if (!shown) return <Fragment />;

        return (
            <div className="modal">
                <div className="backdrop" onClick={() => options.backdropDismisses && dismiss()} role="presentation" />

                <div className="inner" style={options.innerStyle}>
                    {options.hasDismissButton && (
                        <button
                            className="button-unstyled close-button icon-close"
                            onClick={dismiss}
                            title={t('cancel', 'generator')}
                        />
                    )}
                    {children}

                    <div className="button-group">
                        {options.positiveButton ||
                            (options.positiveText && (
                                <button
                                    className={`button ${
                                        options.defaultButton === 'positive' ? 'button-primary' : 'button-secondary'
                                    }`}
                                    onClick={options.onPositiveFeedback}
                                    style={'float: right'}>
                                    {options.positiveText}
                                </button>
                            ))}

                        {options.negativeButton ||
                            (options.negativeText && (
                                <button
                                    className={`button ${
                                        options.defaultButton === 'negative' ? 'button-primary' : 'button-secondary'
                                    }`}
                                    onClick={options.onNegativeFeedback}
                                    style={'float: left'}>
                                    {options.negativeText}
                                </button>
                            ))}
                    </div>
                </div>
            </div>
        );
    }, [options, dismiss, children, shown]);

    return [Modal, show, dismiss, shown] as const;
};
