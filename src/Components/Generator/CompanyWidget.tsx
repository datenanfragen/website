import t from '../../Utility/i18n';
import { Text, IntlProvider } from 'preact-i18n';
import { Accordion } from '../Accordion';
import { useGeneratorStore } from '../../store/generator';

export const CompanyWidget = () => {
    const company = useGeneratorStore((state) => state.current_company);
    const removeCompany = useGeneratorStore((state) => state.removeCompany);

    if (company === undefined) return <></>;

    const comments = company.comments?.map((comment) => <p className="company-comments">{comment}</p>);

    return (
        <IntlProvider scope="generator" definition={window.I18N_DEFINITION}>
            <aside className="company-info box">
                <button
                    className="company-remove button button-primary button-small icon-trash"
                    onClick={removeCompany}
                    title={t('deselect-company', 'generator')}
                />
                <Accordion title={company.name} id="company-info" expandedInitially={true}>
                    <div className="company-info-content">
                        <div className="company-info-params">
                            {company.address && (
                                <>
                                    <br />
                                    <span className="company-info-label">
                                        <Text id="address-colon" />
                                        &nbsp;
                                    </span>
                                    <span>{company.address.split('\n').join(', ')}</span>
                                </>
                            )}
                            {company.fax && (
                                <>
                                    <br />
                                    <span className="company-info-label">
                                        <Text id="fax-colon" />
                                        &nbsp;
                                    </span>
                                    {company.fax}
                                </>
                            )}
                            {company.email && (
                                <>
                                    <br />
                                    <span className="company-info-label">
                                        <Text id="email-colon" />
                                        &nbsp;
                                    </span>
                                    {company.email}
                                </>
                            )}
                            {company['pgp-fingerprint'] && (
                                <>
                                    <br />
                                    <span className="company-info-label">
                                        <Text id="pgp-fingerprint-colon" />
                                        &nbsp;
                                    </span>
                                    <code>
                                        {company['pgp-url'] ? (
                                            <a href={company['pgp-url']}>{company['pgp-fingerprint']}</a>
                                        ) : (
                                            company['pgp-fingerprint']
                                        )}
                                    </code>
                                </>
                            )}
                        </div>
                        {comments && comments.length > 0 && (
                            <>
                                <br />
                                <span className="company-info-label">
                                    <Text id="current-company-comments-colon" />
                                </span>
                                <br />
                                {comments}
                            </>
                        )}
                        <a
                            href={
                                window.BASE_URL +
                                (company['complaint-language'] ? 'supervisory-authority/' : 'company/') +
                                company.slug
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="button button-secondary button-small company-read-more">
                            <Text id="company-read-more" />
                            &nbsp;
                            <span className="icon icon-arrow-right" />
                        </a>
                        <div className="clearfix" />
                    </div>
                </Accordion>
            </aside>
        </IntlProvider>
    );
};
