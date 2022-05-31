import { Highlight } from 'react-instantsearch-dom';
import t from '../../Utility/i18n';
import type { Hit } from 'react-instantsearch-core';
import type { JSX } from 'preact';
import type { Company } from '../../types/company';

type CompanyResultProps = {
    company: Company | Hit<Company>;
    actionElement: JSX.Element;

    onClick?: (company: Company) => void;
};

export const CompanyResult = (props: CompanyResultProps) => (
    // TODO!
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div className="box box-thin" style="margin-bottom: 10px;" onClick={() => props.onClick?.(props.company)}>
        {props.actionElement}
        <h4>
            {'_highlightResult' in props.company ? (
                <Highlight attribute="name" hit={props.company} tagName="mark" />
            ) : (
                props.company.name
            )}

            {props.company.quality === 'tested' ? (
                <>
                    &nbsp;
                    <span className="icon icon-check-badge color-green-800" title={t('quality-tested', 'search')} />
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

        {props.company.runs && props.company.runs.length > 0 && (
            <>
                <span>
                    {t('also-runs', 'search')}
                    {'_highlightResult' in props.company ? (
                        <Highlight attribute="runs" hit={props.company} tagName="mark" />
                    ) : (
                        props.company.runs.join(', ')
                    )}
                </span>
                <br />
            </>
        )}

        {props.company.categories && props.company.categories.length > 0 && (
            <>
                <span>
                    {t('categories', 'search')}
                    {'_highlightResult' in props.company ? (
                        <Highlight attribute="categories" hit={props.company} tagName="mark" />
                    ) : (
                        props.company.categories.join(', ')
                    )}
                </span>
                <br />
            </>
        )}
    </div>
);
