import { Component } from 'preact';
import StarWidget from './StarWidget';
import PropTypes from 'prop-types';

export class Comment extends Component {
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

    static propTypes = {
        id: PropTypes.string.isRequired,
        author: PropTypes.string.isRequired,
        message: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
        additional: PropTypes.shape({
            rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        }).isRequired,
    };
}
