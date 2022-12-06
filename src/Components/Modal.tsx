import { Fragment, ComponentChildren, JSX } from 'preact';
import { useState, useCallback, useMemo, useEffect, useRef, useLayoutEffect } from 'preact/hooks';
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

type Modal = () => JSX.Element;
type dismissModal = () => void;
type showModal = () => void;
type shown = boolean;

export const useModal = (
    children: ComponentChildren,
    _options?: ModalOptions
): readonly [Modal, showModal, dismissModal, shown] => {
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
            <div className={`modal${document.getElementsByClassName('modal').length > 0 ? ' no-animation' : ''}`}>
                <div className="backdrop" onClick={() => options.backdropDismisses && dismiss()} role="presentation" />

                <div className="inner" style={options.innerStyle}>
                    <FocusAnchor />
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

const FocusAnchor = () => {
    const focusAnchor = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        focusAnchor.current?.focus();
    }, [focusAnchor]);

    return <div ref={focusAnchor} tabIndex={-1} className="focus-anchor" />;
};
