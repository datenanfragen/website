import preact from 'preact';
import { IntlProvider, Text } from 'preact-i18n';
import t from 'Utility/i18n';
import FlashMessage, { flash } from 'Components/FlashMessage';
import { rethrow } from '../Utility/errors';

const API_URL = 'https://comments.datenanfragen.de';
const TARGET = LOCALE + '/' + document.location.pathname.replace(/^\s*\/*\s*|\s*\/*\s*$/gm, '');

export default class CommentsWidget extends preact.Component {
    constructor(props) {
        super(props);

        this.state.comments = [];

        fetch(API_URL + '/get/' + TARGET)
            .then(function(res) {
                return res.json();
            })
            .then(comments => {
                this.setState({ comments: comments.sort((a, b) => -a.added_at.localeCompare(b.added_at)) });
            });
    }

    render() {
        let comment_elements = [];

        this.state.comments.forEach(c => {
            comment_elements.push(<Comment author={c.author} message={c.message} date={c.added_at} />);
        });

        return (
            <IntlProvider scope="comments" definition={I18N_DEFINITION}>
                <div id="comments-widget">
                    <h2>
                        <Text id="comments" />
                    </h2>
                    {!comment_elements || comment_elements.length === 0 ? <Text id="no-comments" /> : comment_elements}
                    <CommentForm />
                </div>
            </IntlProvider>
        );
    }
}

export class Comment extends preact.Component {
    render() {
        return (
            <div className="comment box box-compact" style="margin-bottom: 15px;">
                <span>
                    <strong>{this.props.author}</strong> ({new Date(this.props.date).toLocaleString()})
                </span>
                <p>
                    {this.props.message.split('\n').map((item, key) => {
                        return (
                            <span key={key}>
                                {item}
                                <br />
                            </span>
                        );
                    })}
                </p>
            </div>
        );
    }
}

export class CommentForm extends preact.Component {
    constructor(props) {
        super(props);

        this.state = {
            author: '',
            message: ''
        };

        this.submitComment = this.submitComment.bind(this);
    }

    render() {
        return (
            <form id="comment-form">
                <h3 style="margin-bottom: 15px;">
                    <Text id="leave-comment" />
                </h3>

                <div className="col25">
                    <strong>
                        <Text id="author" />
                    </strong>
                </div>
                <div className="col75">
                    <div className="form-group">
                        <label for="new-comment-author" className="sr-only">
                            <Text id="author" />
                        </label>
                        <input
                            type="text"
                            id="new-comment-author"
                            className="form-element"
                            placeholder={t('author', 'comments')}
                            value={this.state.author}
                            onChange={e => this.setState({ author: e.target.value })}
                        />
                    </div>
                </div>

                <div className="col25">
                    <strong>
                        <Text id="comment" />
                    </strong>
                </div>
                <div className="col75">
                    <div className="form-group">
                        <label for="new-comment-message" className="sr-only">
                            <Text id="comment" />
                        </label>
                        <textarea
                            id="new-comment-message"
                            className="form-element"
                            rows={4}
                            placeholder={t('comment', 'comments')}
                            required={true}
                            value={this.state.message}
                            onChange={e => this.setState({ message: e.target.value })}
                        />
                    </div>
                </div>

                <button id="submit-comment" onClick={this.submitComment} style="float: right;">
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

        fetch(API_URL, {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                author: this.state.author,
                message: this.state.message,
                target: TARGET
            })
        })
            .then(() => {
                flash(<FlashMessage type="success">{t('send-success', 'comments')}</FlashMessage>);
                this.setState({ author: '', message: '' });
            })
            .catch(err => {
                rethrow(err);
                flash(<FlashMessage type="error">{t('send-error', 'comments')}</FlashMessage>);
            });
    }
}
