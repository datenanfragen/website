import preact from 'preact';
import t from '../Utility/i18n';
import { Text } from 'preact-i18n';
import Accordion from '../Components/Accordion';

export default class CompanyWidget extends preact.Component {
    constructor(props) {
        super(props);

        this.state = {
            expanded: true
        };
    }

    render() {
        let comments = [];
        if (this.props.company['comments']) {
            this.props.company['comments'].forEach(comment => {
                comments.push(<p className="company-comments">{comment}</p>);
            });
        }

        let content = (
            <div className="company-info-content">
                <div className="company-info-params">
                    {this.props.company['fax']
                        ? [
                              <br />,
                              <span className="company-info-label">
                                  <Text id="fax" />
                                  :&nbsp;
                              </span>,
                              this.props.company['fax']
                          ]
                        : []}
                    {this.props.company['email']
                        ? [
                              <br />,
                              <span className="company-info-label">
                                  <Text id="email" />
                                  :&nbsp;
                              </span>,
                              this.props.company['email']
                          ]
                        : []}
                    {this.props.company['pgp-fingerprint']
                        ? [
                              <br />,
                              <span className="company-info-label">
                                  <Text id="pgp-fingerprint" />
                                  :&nbsp;
                              </span>,
                              <code>
                                  {this.props.company['pgp-url'] ? (
                                      <a href={this.props.company['pgp-url']}>
                                          {this.props.company['pgp-fingerprint']}
                                      </a>
                                  ) : (
                                      this.props.company['pgp-fingerprint']
                                  )}
                              </code>
                          ]
                        : []}
                </div>
                {comments.length > 0
                    ? [
                          <br />,
                          <span className="company-info-label">
                              <Text id="current-company-comments" />:
                          </span>,
                          <br />,
                          comments
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
            <aside className="company-info box">
                <button
                    className="company-remove button button-primary button-small icon-trash"
                    onClick={this.props.onRemove}
                    title={t('deselect-company', 'generator')}
                />
                <Accordion title={this.props.company['name']} id="company-info">
                    {content}
                </Accordion>
            </aside>
        );
    }
}
