import preact from 'preact';
import { IntlProvider, Text, MarkupText } from 'preact-i18n';
import t from 'Utility/i18n';
import FlashMessage, { flash } from 'Components/FlashMessage';
import StarWidget from 'Components/StarWidget';
import { rethrow, WarningException } from '../Utility/errors';

const API_URL = 'https://backend.datenanfragen.de/comments';
const TARGET = LOCALE + '/' + document.location.pathname.replace(/^\s*\/*\s*|\s*\/*\s*$/gm, '');

export default class CommentsWidget extends preact.Component {
    constructor(props) {
        super(props);

        this.state.comments = [];

        const url = `${API_URL}/get/${TARGET}`;
        fetch(url)
            .then((res) => res.json())
            .then((comments) => {
                this.setState({ comments: comments.sort((a, b) => -a.added_at.localeCompare(b.added_at)) });
            })
            .catch((e) => {
                flash(
                    <FlashMessage type="warning" duration={10000}>
                        {t('warning-loading-failed', 'comments')}
                    </FlashMessage>
                );
                rethrow(WarningException.fromError(e), 'Loading the comments failed.', { url });
            });
    }

    render() {
        let ratingCount = 0;
        let ratingSum = 0;

        const comment_elements = this.state.comments.map((c) => {
            if (c.additional?.rating) {
                ratingCount++;
                ratingSum += Number(c.additional.rating);
            }

            return (
                <Comment id={c.id} author={c.author} message={c.message} date={c.added_at} additional={c.additional} />
            );
        });

        return (
            <IntlProvider scope="comments" definition={I18N_DEFINITION}>
                <div id="comments-widget">
                    <h2 style="position: relative;">
                        <Text id="comments" />
                        <a
                            href={API_URL + '/feed/' + TARGET}
                            className="icon icon-rss"
                            style="position: absolute; right: 0;"
                            title={t('rss-link', 'comments')}>
                            <span className="sr-only">
                                <Text id="rss-link" />
                            </span>
                        </a>
                    </h2>
                    {!comment_elements || comment_elements.length === 0 ? (
                        <p>
                            <Text id="no-comments" />
                        </p>
                    ) : (
                        <div>
                            <CommentSummary
                                ratingCount={ratingCount}
                                ratingSum={ratingSum}
                                reviewCount={this.state.comments.length}
                            />

                            {comment_elements}
                        </div>
                    )}

                    <CommentForm allow_rating={this.props.allow_rating} displayWarning={this.props.displayWarning} />
                </div>
            </IntlProvider>
        );
    }
}

export class Comment extends preact.Component {
    render() {
        return (
            <div className="comment box box-compact" style="margin-bottom: 15px; position: relative;">
                <span>
                    <strong>{this.props.author}</strong> ({new Date(this.props.date).toLocaleString()})
                </span>
                {this.props.additional.rating ? (
                    <div style="position: absolute; top: 0; right: 0; margin-top: 5px;">
                        <StarWidget
                            id={'stars-' + this.props.id}
                            initial={this.props.additional.rating}
                            readonly={true}
                        />
                    </div>
                ) : (
                    []
                )}
                <p>{this.props.message.split('\n').map(this.processLine).flat()}</p>
            </div>
        );
    }

    /**
     * Handle some very basic markup in comments, similar to what the generator allows.
     *
     * The following tags are supported:
     *   - <bold>This text will be bold.</bold>
     *   - <italic>This text will be italic.</italic>
     *   - <link url="https://example.org">This text will link to example.org.</link> Note that the URL can technically
     *       be missing, it will then produce a link without href. Also note that URLs are not checked at all.
     *
     * @param {string} line The line of text to process.
     * @returns {Array} An array of the elements to insert instead of the line.
     */
    processLine = (line) => {
        const processChunk = function (chunk) {
            let chunks = [];
            let remaining = chunk;
            let match;

            while (
                (match = remaining.match(
                    /<(?<tag>bold|italic|link)(?: url="(?<url>https?:\/\/.+?)")?>(?<content>.+?)<\/\1>/
                ))
            ) {
                // TODO: Get rid of all those stupid <span>s once we have <Fragment>s.
                chunks.push(<span>{remaining.slice(0, match.index)}</span>);
                const content = processChunk(match.groups.content);
                if (match.groups.tag === 'link') chunks.push(<a href={match.groups.url}>{content}</a>);
                else chunks.push(<span className={match.groups.tag}>{content}</span>);

                remaining = remaining.slice(match.index + match[0].length);
            }

            return [...chunks, <span>{remaining}</span>];
        };

        return [...processChunk(line), <br />];
    };
}

export class CommentForm extends preact.Component {
    constructor(props) {
        super(props);

        this.state = {
            author: '',
            message: '',
            rating: 0,
        };

        this.submitComment = this.submitComment.bind(this);
    }

    render() {
        return (
            <form id="comment-form">
                <h3 style="margin-bottom: 15px;">
                    <Text id="leave-comment" />
                </h3>

                {this.props.displayWarning && TARGET.indexOf('datenanfragen') === -1 ? (
                    <div className="box box-warning" style="margin-bottom: 15px;">
                        <MarkupText id="warning" />
                    </div>
                ) : (
                    []
                )}

                <div className="col25 col100-mobile">
                    <strong>
                        <Text id="author" />
                    </strong>{' '}
                    <Text id="optional" />
                </div>
                <div className="col75 col100-mobile">
                    <div className="form-group form-group-vertical">
                        <label htmlFor="new-comment-author" className="sr-only">
                            <Text id="author" />
                        </label>
                        <input
                            type="text"
                            id="new-comment-author"
                            className="form-element"
                            placeholder={t('author', 'comments')}
                            value={this.state.author}
                            onChange={(e) => this.setState({ author: e.target.value })}
                        />
                    </div>
                </div>
                <div className="clearfix" />

                <div className="col25 col100-mobile">
                    <strong>
                        <Text id="comment" />
                    </strong>
                </div>
                <div className="col75 col100-mobile">
                    <div className="form-group form-group-vertical">
                        <label htmlFor="new-comment-message" className="sr-only">
                            <Text id="comment" />
                        </label>
                        <textarea
                            id="new-comment-message"
                            className="form-element"
                            rows={4}
                            placeholder={t('comment', 'comments')}
                            required={true}
                            value={this.state.message}
                            onChange={(e) => this.setState({ message: e.target.value })}
                        />
                    </div>
                </div>
                <div className="clearfix" />

                {this.props.allow_rating
                    ? [
                          <div className="col25 col100-mobile">
                              <strong>
                                  <Text id="rating" />
                              </strong>{' '}
                              <Text id="optional" />
                          </div>,
                          <div className="col75 col100-mobile">
                              <div className="form-group form-group-vertical" style="margin-bottom: 0;">
                                  <label htmlFor="star-widget" className="sr-only">
                                      <Text id="rating" />
                                  </label>
                                  <StarWidget
                                      id="star-widget"
                                      onChange={(rating) => this.setState({ rating: rating })}
                                  />
                              </div>
                          </div>,
                          <div className="clearfix" />,
                      ]
                    : []}

                <button
                    id="submit-comment"
                    className="button button-secondary"
                    onClick={this.submitComment}
                    style="float: right;">
                    <Text id="submit" />
                </button>
                <div className="clearfix" />
            </form>
        );
    }

    submitComment(e) {
        e.preventDefault();

        if (!this.state.message) {
            flash(<FlashMessage type="error">{t('error-no-message', 'comments')}</FlashMessage>);
            return false;
        }

        let body = {
            author: this.state.author,
            message: this.state.message,
            target: TARGET,
        };
        if (this.props.allow_rating && this.state.rating) body['additional'] = { rating: this.state.rating };

        flash(<FlashMessage type="info">{t('sending', 'comments')}</FlashMessage>);
        fetch(API_URL, {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        })
            .then((response) => {
                if (!response.ok) throw new Error('Unexpected response from comments server.');

                flash(<FlashMessage type="success">{t('send-success', 'comments')}</FlashMessage>);
                this.setState({ message: '' });
            })
            .catch((err) => {
                rethrow(err);
                flash(<FlashMessage type="error">{t('send-error', 'comments')}</FlashMessage>);
            });
    }
}

export class CommentSummary extends preact.Component {
    componentDidMount() {
        const parts = TARGET.split('/');

        if (parts[1] !== 'company') {
            return;
        }

        const json = {
            '@context': 'http://schema.org',
            '@type': 'Organization',
            '@id': document.location.href + '#company',
            aggregateRating: {
                '@type': 'AggregateRating',
                ratingCount: this.props.ratingCount,
                ratingValue: this.averageRating,
                reviewCount: this.props.reviewCount,
            },
        };

        const script = document.createElement('script');

        script.type = 'application/ld+json';
        script.innerHTML = JSON.stringify(json);

        document.body.appendChild(script);
    }

    render() {
        if (this.props.reviewCount === 0) {
            return;
        }

        this.averageRating = (this.props.ratingSum / this.props.ratingCount).toFixed(2);

        return (
            <div className="comments-summary">
                <ol>
                    <li>
                        <h3>
                            <Text id="total" />
                        </h3>
                        <span className="primary-content">{this.props.reviewCount}</span>
                    </li>
                    <li>
                        <h3>
                            <Text id="average-rating" />
                        </h3>

                        {this.props.ratingCount > 0 ? (
                            <div>
                                <span className="primary-content">{this.averageRating}</span>

                                <Text
                                    id="from-x-reviewers"
                                    fields={{ count: this.props.ratingCount }}
                                    plural={this.props.ratingCount}
                                />
                            </div>
                        ) : (
                            <span className="primary-content">
                                <Text id="no-ratings" />
                            </span>
                        )}
                    </li>
                </ol>
            </div>
        );
    }
}
