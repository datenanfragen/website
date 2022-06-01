import type { ComponentChildren } from 'preact';
import { IntlProvider, Text } from 'preact-i18n';
import { useEffect, useRef } from 'preact/hooks';

type FootnoteProps = {
    index: number;
    id: string;
    children: ComponentChildren;
};

const Footnote = (props: FootnoteProps) => {
    const detailsRef = useRef<HTMLDetailsElement>(null);

    useEffect(() => {
        // Adapted after: https://usehooks.com/useOnClickOutside/
        const listener = (event: MouseEvent | TouchEvent) => {
            const details_el = detailsRef.current;
            if (details_el?.open && !details_el?.contains(event.target as Element)) {
                details_el?.removeAttribute('open');
            }
        };
        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);

        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, []);

    return (
        <IntlProvider scope="blog" definition={window.I18N_DEFINITION}>
            <details className="footnote" id={props.id} ref={detailsRef}>
                <summary>
                    <span className="sr-only">
                        <Text id="footnote" />{' '}
                    </span>
                    <sup>{props.index}</sup>
                </summary>
                <div className="footnote-content">{props.children}</div>
            </details>
        </IntlProvider>
    );
};

export default Footnote;
