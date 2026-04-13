import { Fragment, JSX } from 'preact';
import { useState, useEffect, useCallback } from 'preact/hooks';
import { IntlProvider, Text, MarkupText } from 'preact-i18n';
import { FlashMessage, flash } from '../Components/FlashMessage';
import t from '../Utility/i18n';
import { ErrorException, rethrow, WarningException } from '../Utility/errors';
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
/**
 * We regularly receive comments from people who actually want to reach a company in our database instead of posting
 * a public message. This function uses a basic heuristic to try and detect those comments.
 *
 * @remarks `CommentForm` uses this to warn the user in those cases.
 *
 * @returns A "suspiciousness score", where `0` means that no indicators were found. The number is higher the more
 * suspicious indicators were found.
 */
function calculateMessageSusScore(message: string) {
    const heuristics = [
        {
            // Common email providers for private users.
            regex: /@gmail\.com|@web\.de|@gmx\.de|@gmx\.net|@hotmail\.com|@me\.com|@mail\.com|@yahoo\.com|@aol\.com/gi,
            score: 2,
        },
        {
            // Common keywords referring to orders, parcel tracking, etc. (those need to be translated).
            regex: new RegExp(t('regex-sus-words', 'comments'), 'ig'),
            score: 1,
        },
        {
            // Currencies. While this might happen in intended comments (for example to complain that the company tried
            // to charge you for the request), multiple occurrences are suspicious.
            regex: /\$|€|£|chf|euro|pound|dollar/gi,
            score: 0.5,
        },
    ];

    return heuristics
        .map((h) => {
            const matches = message.match(h.regex);
            return matches ? matches.length * h.score : 0;
        })
        .reduce((a, b) => a + b, 0);
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

        // Names are not allowed to contain email addresses.
        if (author.includes('@')) {
            flash(<FlashMessage type="error">{t('no-email-in-name', 'comments')}</FlashMessage>);
            return;
        }
        // Warn users who probably want to send a message to the company instead of posting a public comment.
        if (document.location.pathname.startsWith('/company/')) {
            const susScore = calculateMessageSusScore(message) + calculateMessageSusScore(author);

            if (susScore >= 1) {
                const confirmation_result = confirm(t('confirm-private-data', 'comments'));
                if (!confirmation_result) return;
            }

            // Temporary hack: We have received a lot of French comments from people trying to object to Facebook using
            // their data for "AI" training. Since this is a current event, we'll try to direct them to the right place
            // here until July 26, 2025.
            const slug = document.location.pathname.split('/')[2];
            if (
                savedLocale === 'fr' &&
                ['facebook', 'instagram', 'whatsapp'].includes(slug) &&
                new Date() < new Date('2025-07-26T00:00:00Z')
            ) {
                const confirmationResult = confirm(
                    `Il semble que tu essaies de contacter Meta concernant tes données Facebook, Instagram ou WhatsApp. Les messages que tu soumets ici N'atteindront PAS Meta. Utilise plutôt les formulaires suivants si tu souhaites t'opposer à l'utilisation de tes données pour l'« IA » :

- https://fr-fr.facebook.com/help/contact/712876720715583
- https://help.instagram.com/contact/767264225370182`
                );
                if (!confirmationResult) return;
            }
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
            .then(async (res) => {
                const payload = await res.json();

                if (payload.message?.includes('length must be less than')) {
                    flash(<FlashMessage type="error">{t('send-too-long', 'comments')}</FlashMessage>);
                } else if (!res.ok) throw new ErrorException('Unexpected response from comments server.', payload);

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
                <Text id="publish-comment" />
            </button>
            <div className="clearfix" />
        </form>
    );
}
