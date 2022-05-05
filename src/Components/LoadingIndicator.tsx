import { Fragment } from 'preact';

type LoadingIndicatorProps = {
    shown: boolean;
    style?: string;
};

export const LoadingIndicator = (props: LoadingIndicatorProps) => {
    if (!props.shown) return <Fragment />;
    return (
        <div className="loading-indicator" style={props.style}>
            <div className="sk-folding-cube">
                <div className="sk-cube1 sk-cube" />
                <div className="sk-cube2 sk-cube" />
                <div className="sk-cube4 sk-cube" />
                <div className="sk-cube3 sk-cube" />
            </div>
        </div>
    );
};
