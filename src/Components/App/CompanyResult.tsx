import { Highlight, connectHighlight } from 'react-instantsearch-dom';
import t from '../../Utility/i18n';
import type { HighlightProps, Hit } from 'react-instantsearch-core';
import type { JSX } from 'preact';
import type { Company } from '../../types/company';
import { useEffect, useRef } from 'preact/hooks';

type CompanyResultProps = {
    company: Company | Hit<Company>;
    actionElement?: JSX.Element;
    active?: boolean;
    focussed?: boolean;
    id?: string;

    onClick?: (company: Company) => void;
};

// see https://www.algolia.com/doc/api-reference/widgets/snippet/react/#full-example
const RunsSnippet = connectHighlight(({ highlight, hit }: HighlightProps<Company>) => {
    const highlights = (
        highlight({
            highlightProperty: '_snippetResult',
            attribute: 'runs',
            hit,
        }) as unknown as { value: string; isHighlighted: boolean }[][]
    ).filter((h) => h.reduce((acc: boolean, part) => acc || part.isHighlighted, false));

    return (
        highlights.length > 0 && (
            <>
                {t('also-runs', 'search')}
                {highlights.map((part, index) => (
                    <span className="ais-Highlight">
                        {index > 0 && ', '}
                        {part.map((p) => (p.isHighlighted ? <mark>{p.value}</mark> : p.value))}
                    </span>
                ))}
                <br />
            </>
        )
    );
});

export const CompanyResult = (props: CompanyResultProps) => {
    const listElement = useRef<HTMLLIElement>(null);

    useEffect(() => {
        if (listElement.current && props.focussed) listElement.current.focus();
    }, [listElement, props.focussed]);

    return (
        // Key events are handled in the parent component
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events
        <li
            id={props.id}
            role="option"
            aria-selected={props.active}
            aria-labelledby={`company-result-${props.company.slug}-label`}
            className={`box box-thin company-result${props.active ? ' company-result-active' : ''}${
                props.focussed ? ' company-result-focussed' : ''
            }`}
            style="margin-bottom: 10px;"
            onClick={() => props.onClick?.(props.company)}
            ref={listElement}>
            {props.actionElement !== undefined && <div className="company-result-action">{props.actionElement}</div>}
            <div className="company-result-content">
                <h4 id={`company-result-${props.company.slug}-label`}>
                    {'_highlightResult' in props.company ? (
                        <Highlight attribute="name" hit={props.company} tagName="mark" />
                    ) : (
                        props.company.name
                    )}

                    {props.company.quality === 'tested' ? (
                        <>
                            &nbsp;
                            <span
                                className="icon icon-check-badge color-green-800"
                                title={t('quality-tested', 'search')}
                            />
                        </>
                    ) : (
                        props.company.quality !== 'verified' && (
                            <>
                                &nbsp;
                                <span
                                    className="icon icon-question-badge color-orange-800"
                                    title={t('quality-unverified', 'search')}
                                />
                            </>
                        )
                    )}
                </h4>

                {'_snippetResult' in props.company && <RunsSnippet hit={props.company} />}
            </div>
        </li>
    );
};
