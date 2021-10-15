import PropTypes from 'prop-types';

const Footnote = (props) => {
    return (
        <details className="footnote" id={props.id}>
            <summary>
                <sup>{props.index}</sup>
            </summary>
            <div className="footnote-content">{props.children}</div>
        </details>
    );
};

Footnote.propTypes = {
    children: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
};

export default Footnote;
