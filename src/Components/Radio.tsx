import type { JSX } from 'preact';

type RadioProps = {
    id: string;
    label: JSX.Element | string;
    radioVariable: string;
    value: string;
    name: string;
    onChange: (value: string) => void;
};

export const Radio = (props: RadioProps) => (
    <label for={props.id} className={`radio-label${props.radioVariable === props.value ? ' active' : ''}`}>
        <input
            type="radio"
            id={props.id}
            name={props.name}
            value={props.value}
            className="form-element"
            checked={props.radioVariable === props.value}
            onChange={(e) => props.onChange(e.currentTarget.value)}
        />
        {props.label}
    </label>
);
