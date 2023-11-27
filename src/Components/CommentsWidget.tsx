import { Fragment, JSX } from 'preact';
import { useState, useEffect, useCallback } from 'preact/hooks';
import { IntlProvider, Text, MarkupText } from 'preact-i18n';
import { FlashMessage, flash } from '../Components/FlashMessage';
import t from '../Utility/i18n';
import { rethrow, WarningException } from '../Utility/errors';
import { useAppStore } from '../store/app';

const api_url = 'https://backend.datenanfragen.de/comments';

type CommentType = {
    id: string;
    author: string;
    message: string;
    added_at: string;
};

type CommentsWidgetProps = {
    displayWarning: boolean;
};
type CommentProps = CommentType;
type CommentFormProps = {
    displayWarning: boolean;
};

export function CommentsWidget(props: CommentsWidgetProps) {
    const [comments, setComments] = useState<CommentType[]>([]);
    const savedLocale = useAppStore((state) => state.savedLocale);

    const target = `${savedLocale}/${document.location.pathname.replace(/^\s*\/*\s*|\s*\/*\s*$/gm, '')}`;

    useEffect(() => {
        const url = `${api_url}/get/${target}`;
        fetch(url)
            .then((res) => res.json())
            .then((new_comments: CommentType[]) =>
                setComments(new_comments.sort((a, b) => -a.added_at.localeCompare(b.added_at)))
            )
            .catch((e) => {
                flash(
                    <FlashMessage type="warning" duration={10000}>
                        {t('warning-loading-failed', 'comments')}
                    </FlashMessage>
                );
                rethrow(WarningException.fromError(e), 'Loading the comments failed.', { url });
            });
    }, [target]);

    const comment_elements = comments.map((c) => (
        <Comment id={c.id} author={c.author} message={c.message} added_at={c.added_at} />
    ));

    return (
        <IntlProvider scope="comments" definition={window.I18N_DEFINITION}>
            <div id="comments-widget">
                <h2>
                    <Text id="comments" />
                    <div style="float: right;">
                        <a
                            href={`${api_url}/feed/${target}`}
                            className="icon icon-rss"
                            title={t('rss-link', 'comments')}>
                            <span className="sr-only">
                                <Text id="rss-link" />
                            </span>
                        </a>
                    </div>
                    <div className="clearfix" />
                </h2>
                {comment_elements.length === 0 ? (
                    <p>
                        <Text id="no-comments" />
                    </p>
                ) : (
                    comment_elements
                )}

                <CommentForm displayWarning={props.displayWarning} />
            </div>
        </IntlProvider>
    );
}

/**
 * Handle some very basic markup in comments, similar to what the generator allows.
 *
 * The following tags are supported:
 *   - `<bold>This text will be bold.</bold>`
 *   - `<italic>This text will be italic.</italic>`
 *   - `<link url="https://example.org">This text will link to example.org.</link>` Note that the URL can technically be
 *       missing, it will then produce a link without href. Also note that URLs are not checked at all.
 *
 * @param line The line of text to process.
 * @returns An array of the elements to insert instead of the line.
 */
const processLine = (line: string) => {
    const processChunk = function (chunk: string) {
        const chunks: JSX.Element[] = [];
        let remaining = chunk;
        let match: RegExpMatchArray | null;

        while (
            (match = remaining.match(
                /<(?<tag>bold|italic|link)(?: url="(?<url>https?:\/\/.+?)")?>(?<content>.+?)<\/\1>/
            ))
        ) {
            chunks.push(<Fragment>{remaining.slice(0, match.index)}</Fragment>);
            const content = processChunk(match.groups?.content || '');
            if (match.groups?.tag === 'link') chunks.push(<a href={match.groups.url}>{content}</a>);
            else chunks.push(<span className={match.groups?.tag}>{content}</span>);

            remaining = remaining.slice((match.index || 0) + match[0].length);
        }

        return [...chunks, <Fragment>{remaining}</Fragment>];
    };

    return [...processChunk(line), <br />];
};
export function Comment(props: CommentProps) {
    return (
        <div className="comment box box-compact" style="margin-bottom: 15px; position: relative;">
            <span>
                <strong>{props.author}</strong> ({new Date(props.added_at).toLocaleString()})
            </span>

            <p>{props.message.split('\n').map(processLine).flat()}</p>
        </div>
    );
}

export function CommentForm(props: CommentFormProps) {
    const [author, setAuthor] = useState('');
    const [message, setMessage] = useState('');
    const savedLocale = useAppStore((state) => state.savedLocale);

    const target = `${savedLocale}/${document.location.pathname.replace(/^\s*\/*\s*|\s*\/*\s*$/gm, '')}`;

    const submitComment = useCallback(() => {
        if (!message) {
            flash(<FlashMessage type="error">{t('error-no-message', 'comments')}</FlashMessage>);
            return false;
        }

        flash(<FlashMessage type="info">{t('sending', 'comments')}</FlashMessage>);

        fetch(api_url, {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                author,
                message,
                target,
            }),
        })
            .then((res) => {
                if (!res.ok) throw new Error('Unexpected response from comments server.');

                flash(<FlashMessage type="success">{t('send-success', 'comments')}</FlashMessage>);
                setMessage('');
            })
            .catch((err) => {
                err.no_side_effects = true;
                rethrow(err);
                flash(<FlashMessage type="error">{t('send-error', 'comments')}</FlashMessage>);
            });
    }, [message, author, target]);

    return (
        <form id="comment-form">
            <h3 style="margin-bottom: 15px;">
                <Text id="leave-comment" />
            </h3>

            {props.displayWarning && !target.includes('datenanfragen') && (
                <div className="box box-warning" style="margin-bottom: 15px;">
                    <MarkupText id="warning" />
                </div>
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
                        value={author}
                        onChange={(e) => setAuthor(e.currentTarget.value)}
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
                        value={message}
                        onChange={(e) => setMessage(e.currentTarget.value)}
                    />
                </div>
            </div>
            <div className="clearfix" />

            <button
                id="submit-comment"
                className="button button-secondary"
                onClick={(e) => {
                    e.preventDefault();
                    submitComment();
                }}
                style="float: right;">
                <Text id="submit" />
            </button>
            <div className="clearfix" />
        </form>
    );
}
