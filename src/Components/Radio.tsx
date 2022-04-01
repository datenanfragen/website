import type { JSX } from 'preact';

type RadioProps = {
    id: string;
    label: string;
    radioVariable: string;
    value: string;
    name: string;
    onChange: JSX.EventHandler<JSX.TargetedEvent<HTMLInputElement, Event>>;
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
            onChange={props.onChange}
        />
        {props.label}
    </label>
);
