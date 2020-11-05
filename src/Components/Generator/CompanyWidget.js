import { Component } from 'preact';
import t from '../../Utility/i18n';
import { Text, IntlProvider } from 'preact-i18n';
import Accordion from '../Accordion';
import PropTypes from 'prop-types';

export default class CompanyWidget extends Component {
    render() {
        let comments = [];
        if (this.props.company['comments']) {
            this.props.company['comments'].forEach((comment) => {
                comments.push(<p className="company-comments">{comment}</p>);
            });
        }

        let content = (
            <div className="company-info-content">
                <div className="company-info-params">
                    {this.props.company['address']
                        ? [
                              <br />,
                              <span className="company-info-label">
                                  <Text id="address-colon" />
                                  &nbsp;
                              </span>,
                              <span>{this.props.company['address'].split('\n').join(', ')}</span>,
                          ]
                        : []}
                    {this.props.company['fax']
                        ? [
                              <br />,
                              <span className="company-info-label">
                                  <Text id="fax-colon" />
                                  &nbsp;
                              </span>,
                              this.props.company['fax'],
                          ]
                        : []}
                    {this.props.company['email']
                        ? [
                              <br />,
                              <span className="company-info-label">
                                  <Text id="email-colon" />
                                  &nbsp;
                              </span>,
                              this.props.company['email'],
                          ]
                        : []}
                    {this.props.company['pgp-fingerprint']
                        ? [
                              <br />,
                              <span className="company-info-label">
                                  <Text id="pgp-fingerprint-colon" />
                                  &nbsp;
                              </span>,
                              <code>
                                  {this.props.company['pgp-url'] ? (
                                      <a href={this.props.company['pgp-url']}>
                                          {this.props.company['pgp-fingerprint']}
                                      </a>
                                  ) : (
                                      this.props.company['pgp-fingerprint']
                                  )}
                              </code>,
                          ]
                        : []}
                </div>
                {comments.length > 0
                    ? [
                          <br />,
                          <span className="company-info-label">
                              <Text id="current-company-comments-colon" />
                          </span>,
                          <br />,
                          comments,
                      ]
                    : []}
                <a
                    href={
                        BASE_URL +
                        (this.props.company['complaint-language'] ? 'supervisory-authority/' : 'company/') +
                        this.props.company['slug']
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
        );

        return (
            <IntlProvider scope="generator" definition={I18N_DEFINITION}>
                <aside className="company-info box">
                    <button
                        className="company-remove button button-primary button-small icon-trash"
                        onClick={this.props.onRemove}
                        title={t('deselect-company', 'generator')}
                    />
                    <Accordion title={this.props.company['name']} id="company-info" expanded={true}>
                        {content}
                    </Accordion>
                </aside>
            </IntlProvider>
        );
    }

    static propTypes = {
        company: PropTypes.shape({
            name: PropTypes.string.isRequired,
            comments: PropTypes.arrayOf(PropTypes.string.isRequired),
            address: PropTypes.string,
            fax: PropTypes.string,
            email: PropTypes.string,
            'pgp-fingerprint': PropTypes.string,
            'pgp-url': PropTypes.string,
            'complaint-language': PropTypes.string,
            slug: PropTypes.string.isRequired,
        }),
        onRemove: PropTypes.func.isRequired,
    };
}
