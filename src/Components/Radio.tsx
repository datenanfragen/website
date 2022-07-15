import type { ComponentChildren } from 'preact';

type RadioProps = {
    id?: string;
    label: ComponentChildren;
    radioVariable?: string;
    value?: string;
    name?: string;
    onChange?: (value: string) => void;
    onClick?: (value: string) => void;
    addon?: ComponentChildren;
};

export const Radio = (props: RadioProps) => (
    <div className="radio-wrapper">
        <label
            for={props.id}
            className={`radio-label${props.radioVariable && props.radioVariable === props.value ? ' active' : ''}`}>
            <input
                type="radio"
                id={props.id}
                name={props.name}
                value={props.value}
                className="form-element"
                checked={props.radioVariable === props.value}
                onChange={(e) => props.onChange?.(e.currentTarget.value)}
                onClick={(e) => props.onClick?.(e.currentTarget.value)}
            />
            {props.label}
        </label>
        {props.addon && <div className="radio-addon">{props.addon}</div>}
    </div>
);
