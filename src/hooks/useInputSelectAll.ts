import type { JSX } from 'preact';
import { useCallback, useRef } from 'preact/hooks';

/**
 * Returns a function that can be passed as the `onClick` handler of an input or textarea element to select all text in
 * the element on first click. If the element is clicked again, the text will not be selected again.
 *
 * @returns `[onInputClick, unsetPreviousActiveElement]`, where:
 *  - `onInputClick` is a function that should be passed to the onClick event of an input or textarea element to select
 *    all text in the element on click
 *  - `unsetPreviousActiveElement` is a function that can be used to unset the previous active element, which is useful
 *    when the input or textarea element is removed from the DOM
 */
export const useInputSelectAll = () => {
    const previousActiveElement = useRef<HTMLElement>();

    const onInputClick = useCallback(
        (e: JSX.TargetedMouseEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            if (previousActiveElement.current === e.currentTarget) return;

            e.currentTarget.select();
            e.currentTarget.focus();
            previousActiveElement.current = e.currentTarget;
        },
        [previousActiveElement]
    );

    const unsetPreviousActiveElement = useCallback(() => {
        previousActiveElement.current = undefined;
    }, [previousActiveElement]);

    return [onInputClick, unsetPreviousActiveElement] as const;
};
