import PropTypes from 'prop-types';
import { Text, IntlProvider } from 'preact-i18n';
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
        <IntlProvider scope="blog" definition={I18N_DEFINITION}>
            <details className="footnote" id={props.id} ref={detailsRef}>
                <summary>
                    <span className="sr-only">
                        <Text id="footnote" />{' '}
                    </span>
                    <sup>{props.index}</sup>
                </summary>
                <div className="footnote-content">{props.children}</div>
            </details>
        </IntlProvider>
    );
};

Footnote.propTypes = {
    children: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
};

export default Footnote;
