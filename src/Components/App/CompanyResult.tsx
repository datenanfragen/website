import { Highlight, connectHighlight } from 'react-instantsearch-dom';
import t from '../../Utility/i18n';
import type { HighlightProps, Hit } from 'react-instantsearch-core';
import type { JSX } from 'preact';
import type { Company } from '../../types/company';
import { useEffect, useRef, useState } from 'preact/hooks';
import { useGeneratorStore } from '../../store/generator';
import { Text } from 'preact-i18n';

type CompanyResultProps = {
    company: Company | Hit<Company>;
    actionElement?: JSX.Element;
    active?: boolean;
    focussed?: boolean;
    id?: string;
    showDetails?: boolean;

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

type CompanyInfoIconsProps = { company: Company };
const CompanyInfoIcons = (props: CompanyInfoIconsProps) => (
    <>
        {props.company.quality === 'tested' ? (
            <span className="icon-check-badge company-info-icon" title={t('quality-tested', 'search')} />
        ) : (
            props.company.quality !== 'verified' && (
                <span className="icon-question-badge company-info-icon" title={t('quality-unverified', 'search')} />
            )
        )}
        {props.company['needs-id-document'] && (
            <span className="icon-id-card company-info-icon" title={t('needs-id-document', 'generator')} />
        )}
        {!props.company.email && props.company.address && (
            <span className="icon-post-person company-info-icon" title={t('only-snail-mail', 'generator')} />
        )}
        {!props.company.email && props.company.fax && (
            <span className="icon-fax company-info-icon" title={t('only-fax', 'generator')} />
        )}
    </>
);

export const CompanyResult = (props: CompanyResultProps) => {
    const listElement = useRef<HTMLLIElement>(null);
    const [detailsShown, setDetailsShown] = useState(false);
    const selectBatchCompanyRuns = useGeneratorStore((state) => state.selectBatchCompanyRuns);

    const detailsAvailable = props.showDetails && props.company.runs;

    useEffect(() => {
        if (listElement.current && props.focussed) listElement.current.focus();
    }, [listElement, props.focussed]);

    const heading = (
        <h4 id={`company-result-${props.company.slug}-label`}>
            {'_highlightResult' in props.company ? (
                <Highlight attribute="name" hit={props.company} tagName="mark" />
            ) : (
                props.company.name
            )}
            <CompanyInfoIcons company={props.company} />
        </h4>
    );

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
            }${props.onClick ? ' company-result-clickable' : ''}`}
            style="margin-bottom: 10px;"
            onClick={() => props.onClick?.(props.company)}
            ref={listElement}>
            {props.actionElement !== undefined && <div className="company-result-action">{props.actionElement}</div>}
            <div className="company-result-content">
                {detailsAvailable ? (
                    <header>
                        <button
                            className={`icon icon-arrow-${
                                detailsShown ? 'down' : 'right'
                            } button button-unstyled button-hoverless`}
                            onClick={() => detailsAvailable && setDetailsShown(!detailsShown)}
                            title={t('choose-runs', 'generator')}
                            aria-expanded={detailsShown}
                            aria-controls={`company-result-details-${props.company.slug}`}>
                            {heading}
                        </button>
                    </header>
                ) : (
                    <header>{heading}</header>
                )}

                {!props.showDetails && '_snippetResult' in props.company && <RunsSnippet hit={props.company} />}

                {detailsAvailable && (
                    <div
                        className="company-result-details"
                        id={`company-result-details-${props.company.slug}`}
                        hidden={!detailsShown}>
                        <Text id="also-runs-choose" />
                        <ul className="unstyled-list">
                            {props.company.runs?.map((runs_entry, index) => {
                                const checked = props.company.runs_selected?.includes(runs_entry);
                                return (
                                    <li>
                                        <input
                                            type="checkbox"
                                            className="form-element"
                                            checked={checked}
                                            onClick={() =>
                                                checked
                                                    ? selectBatchCompanyRuns(
                                                          props.company.slug,
                                                          props.company.runs_selected?.filter(
                                                              (item) => item !== runs_entry
                                                          ) || []
                                                      )
                                                    : selectBatchCompanyRuns(
                                                          props.company.slug,
                                                          (props.company.runs_selected ?? []).concat([runs_entry])
                                                      )
                                            }
                                            id={`runs-${props.company.slug}-${index}`}
                                        />
                                        <label for={`runs-${props.company.slug}-${index}`}>{runs_entry}</label>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
            </div>
        </li>
    );
};
