import type { ComponentChildren } from 'preact';
import { useState } from 'preact/hooks';

type AccordionProps = {
    id: string;
    title: string;
    expandedInitially: boolean;
    style?: string;

    children: ComponentChildren;
};

export const Accordion = (props: AccordionProps) => {
    const [expanded, setExpanded] = useState(props.expandedInitially);

    // TODO: Consider using `<details>` (https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details) instead.
    return (
        <div className="accordion" id={props.id} style={props.style}>
            <button
                onClick={(e) => {
                    e.preventDefault();
                    setExpanded(!expanded);
                }}
                className="accordion-title-link button-unstyled"
                aria-expanded={expanded}
                aria-controls={`accordion-content-${props.id}`}>
                <h3 className="accordion-title">
                    {props.title}
                    <span className={`icon ${expanded ? 'icon-arrow-up' : 'icon-arrow-down'}`} />
                </h3>
            </button>
            <div id={`accordion-content-${props.id}`}>{expanded ? props.children : ''}</div>
        </div>
    );
};
