import { useEffect, useRef } from 'react';

export const HtmlRenderer = (props: { html: string }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref.current) {
            if (ref.current.setHTML) {
                ref.current.setHTML(props.html);
            } else {
                // support uncool browsers
                // remove this when setHTML hits the baseline
                ref.current.innerHTML = props.html;
            }
        }
    }, [props.html]);

    return <div ref={ref} />;
};
