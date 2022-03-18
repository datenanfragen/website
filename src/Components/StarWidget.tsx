import { useState } from 'preact/hooks';

type StarWidgetProps = {
    id: string;
    initial: number;
    readonly?: boolean;
    onChange?: (new_rating: number) => void;
};

// Adapted after https://jsfiddle.net/leaverou/CGP87/
export function StarWidget(props: StarWidgetProps) {
    const [rating, setRating] = useState(props.initial);
    const readonly = props.readonly || false;

    const numbers = Array.from({ length: 5 }, (_, i) => 5 - i);
    return (
        <fieldset id={props.id} className="rating">
            {/* TODO: No idea why the page jumps (in Chrome) when clicking on a star. */}
            {numbers.map((i) => [
                <input
                    type="radio"
                    id={props.id + '-star' + i}
                    name={props.id}
                    value={i}
                    checked={rating === i}
                    onChange={(e) => {
                        if (!readonly) {
                            const new_rating = parseInt((e.target as HTMLInputElement).value, 10);
                            setRating(new_rating);
                            if (props.onChange) props.onChange(new_rating);
                        }
                    }}
                    disabled={readonly}
                />,
                <label for={props.id + '-star' + i} className={readonly ? '' : 'editable'}>
                    {i} stars
                </label>,
            ])}
        </fieldset>
    );
}
