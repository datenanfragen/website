import PropTypes from 'prop-types';

const Footnote = (props) => {
    return (
        <details className="footnote" id={props.id}>
            <summary>[{props.index}]</summary>
            <div className="footnote-content">{props.content}</div>
        </details>
    );
};

Footnote.propTypes = {
    content: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
};

export default Footnote;
