import PropTypes from 'prop-types';
import { useEffect, useRef } from 'preact/hooks';

const Footnote = (props) => {
    const detailsRef = useRef(null);

    useEffect(() => {
        //Adapted after: https://usehooks.com/useOnClickOutside/
        const listener = (event) => {
            if (detailsRef.current?.open && !detailsRef.current?.contains(event.target)) {
                detailsRef.current.removeAttribute('open');
            }
        };
        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);

        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, []);

    return (
        <details className="footnote" id={props.id} ref={detailsRef}>
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
