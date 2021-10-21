import { Component } from 'preact';
import { IntlProvider, Text, MarkupText } from 'preact-i18n';
import { default as t_unbound } from '../Utility/i18n';
import FlashMessage, { flash } from './FlashMessage';
import StarWidget from './StarWidget';
import { rethrow, WarningException } from '../Utility/errors';
import PropTypes from 'prop-types';
import { Comment } from './Comment';

const BROWSER_MODE = typeof window !== 'undefined';

const API_URL = 'https://backend.datenanfragen.de/comments';

export default class CommentsWidget extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: props?.comments ? props.comments : [],
            target: BROWSER_MODE
                ? LOCALE + '/' + document.location.pathname.replace(/^\s*\/*\s*|\s*\/*\s*$/gm, '')
                : props.target,
            i18n_definition: BROWSER_MODE ? I18N_DEFINITION : props.i18n_definition,
        };
        this.t = (id, scope = '', fields = {}, plural = null, fallback = '') => {
            t_unbound(id, scope, props.i18n_definition, fields, plural, fallback);
        };
    }

    async componentDidMount() {
        if (!BROWSER_MODE) return;
        const url = `${API_URL}/get/${this.state.target}`;
        fetch(url)
            .then((res) => res.json())
            .then((c) => this.processComments(c))
            .catch((e) => {
                flash(
                    <FlashMessage type="warning" duration={10000}>
                        {this.t('warning-loading-failed', 'comments')}
                    </FlashMessage>
                );
                rethrow(WarningException.fromError(e), 'Loading the comments failed.', { url });
            });
    }
    processComments(comments) {
        this.setState({ comments: comments.sort((a, b) => -a.added_at.localeCompare(b.added_at)) }, () => {
            const parts = this.state.target.split('/');
            if (parts[1] !== 'company') return;

            const { rating_count, average_rating } = this.ratingDetails();
            if (rating_count === 0) return;

            //TODO move to preact-helmet or sth similar
            this.writeLdJson(rating_count, average_rating);
        });
    }

    writeLdJson(rating_count, average_rating) {
        const ldjson = {
            '@context': 'http://schema.org',
            '@type': 'Organization',
            '@id': document.location.href + '#company',
            aggregateRating: {
                '@type': 'AggregateRating',
                ratingCount: rating_count,
                ratingValue: average_rating,
                reviewCount: this.state.comments.length,
            },
        };

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.innerHTML = JSON.stringify(ldjson);

        document.body.appendChild(script);
    }

    ratingDetails() {
        if (!this.props.allow_rating) return { rating_count: 0, rating_sum: 0, average_rating: NaN };

        const [rating_count, rating_sum] = this.state.comments.reduce(
            ([acc_count, acc_sum], c) =>
                c.additional?.rating ? [acc_count + 1, acc_sum + Number(c.additional.rating)] : [acc_count, acc_sum],
            [0, 0]
        );
        const average_rating = (rating_sum / rating_count).toFixed(1);

        return { rating_count, rating_sum, average_rating };
    }

    render() {
        const { rating_count, average_rating } = this.ratingDetails();

        const comment_elements = this.state.comments.map((c) => (
            <Comment id={c.id} author={c.author} message={c.message} date={c.added_at} additional={c.additional} />
        ));

        return (
            <IntlProvider scope="comments" definition={this.state.i18n_definition}>
                <div id="comments-widget">
                    <h2>
                        <Text id="comments" />
                        <div style="float: right;">
                            {this.props.allow_rating && rating_count > 0 && (
                                <div
                                    style="margin: 0 25px -20px 0; font-size: 16px; display: inline-block;"
                                    title={this.t(
                                        'average-rating-title',
                                        'comments',
                                        { count: rating_count, rating: average_rating },
                                        rating_count
                                    )}>
                                    {/* TODO: At the moment, the StarWidget can only render integer ratings. */}
                                    <StarWidget
                                        id={'stars-aggregate'}
                                        initial={average_rating}
                                        // On the first render, we don't have any comments and thus the average rating
                                        // will be `NaN`. We force a rerender after the comments have been fetched by
                                        // setting a different `key.`
                                        key={average_rating}
                                        readonly={true}
                                    />
                                </div>
                            )}
                            <a
                                href={API_URL + '/feed/' + this.state.target}
                                className="icon icon-rss"
                                title={this.t('rss-link', 'comments')}>
                                <span className="sr-only">
                                    <Text id="rss-link" />
                                </span>
                            </a>
                        </div>
                        <div className="clearfix" />
                    </h2>
                    {!comment_elements || comment_elements.length === 0 ? (
                        <p>
                            <Text id="no-comments" />
                        </p>
                    ) : (
                        comment_elements
                    )}

                    <CommentForm
                        allow_rating={this.props.allow_rating}
                        displayWarning={this.props.displayWarning}
                        i18n_definition={this.state.i18n_definition}
                    />
                </div>
            </IntlProvider>
        );
    }

    static propTypes = {
        displayWarning: PropTypes.bool,
        allow_rating: PropTypes.bool,
        comments: PropTypes.array,
        target: PropTypes.string,
        i18n_definition: PropTypes.object,
    };
}

export class CommentForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            author: '',
            message: '',
            rating: 0,
            target: BROWSER_MODE
                ? LOCALE + '/' + document.location.pathname.replace(/^\s*\/*\s*|\s*\/*\s*$/gm, '')
                : props.target,
            i18n_definition: BROWSER_MODE ? I18N_DEFINITION : props.i18n_definition,
        };

        this.t = (id, scope = '', fields = {}, plural = null, fallback = '') => {
            t_unbound(id, scope, props.i18n_definition, fields, plural, fallback);
        };

        this.submitComment = this.submitComment.bind(this);
    }

    render() {
        return (
            <>
                {/*TODO: styling? */}
                <noscript Class="noscript noscript-comments">
                    <Text id="noscript-comments" />
                </noscript>
                <form id="comment-form">
                    <h3 style="margin-bottom: 15px;">
                        <Text id="leave-comment" />
                    </h3>

                    {this.props.displayWarning && this.state.target.indexOf('datenanfragen') === -1 ? (
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
                                placeholder={this.t('author', 'comments')}
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
                                placeholder={this.t('comment', 'comments')}
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
                    {/**TODO: Disable button for noscript? */}
                    <button
                        id="submit-comment"
                        className="button button-secondary"
                        onClick={this.submitComment}
                        style="float: right;">
                        <Text id="submit" />
                    </button>
                    <div className="clearfix" />
                </form>
            </>
        );
    }

    submitComment(e) {
        e.preventDefault();

        if (!this.state.message) {
            flash(<FlashMessage type="error">{this.t('error-no-message', 'comments')}</FlashMessage>);
            return false;
        }

        let body = {
            author: this.state.author,
            message: this.state.message,
            target: this.state.target,
        };
        if (this.props.allow_rating && this.state.rating) body['additional'] = { rating: this.state.rating };

        flash(<FlashMessage type="info">{this.t('sending', 'comments')}</FlashMessage>);
        fetch(API_URL, {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        })
            .then((response) => {
                if (!response.ok) throw new Error('Unexpected response from comments server.');

                flash(<FlashMessage type="success">{this.t('send-success', 'comments')}</FlashMessage>);
                this.setState({ message: '' });
            })
            .catch((err) => {
                err.no_side_effects = true;
                rethrow(err);
                flash(<FlashMessage type="error">{this.t('send-error', 'comments')}</FlashMessage>);
            });
    }

    static propTypes = {
        displayWarning: PropTypes.bool,
        allow_rating: PropTypes.bool,
        target: PropTypes.string,
        i18n_definition: PropTypes.object,
    };
}
