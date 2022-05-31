import { ComponentChildren, Fragment, render, VNode } from 'preact';
import { useCallback, useEffect, useState } from 'preact/hooks';
import t from '../Utility/i18n';

type FlashMessageProps = {
    duration?: number;
    type?: 'info' | 'error' | 'warning' | 'success';
    children: ComponentChildren;
};

export const FlashMessage = (props: FlashMessageProps) => {
    if (!props.duration) props.duration = 5000;
    if (!props.type) props.type = 'info';

    const [shown, setShown] = useState(true);
    const [fadingOut, setFadingOut] = useState(false);

    const dismiss = useCallback(() => {
        setFadingOut(true);
        setTimeout(() => {
            setShown(false);
        }, 290);
    }, []);

    useEffect(() => {
        if (props.duration !== -1) {
            setTimeout(dismiss, props.duration);
        }
    }, [props.duration, dismiss]);

    if (!shown) return <Fragment />;
    return (
        <div className={`flash-message flash-${props.type}${fadingOut ? ' fade-out' : ''}`}>
            <button
                className="button-unstyled close-button icon-close"
                onClick={dismiss}
                title={t('cancel', 'generator')}
            />
            <div className="inner">{props.children}</div>
        </div>
    );
};

const flash_messages: VNode<FlashMessageProps>[] = [];
export const flash = (flash_message: VNode<FlashMessageProps>) => {
    flash_messages.push(flash_message);
    render(<Fragment>{flash_messages}</Fragment>, document.getElementById('flash-messages')!);
};
