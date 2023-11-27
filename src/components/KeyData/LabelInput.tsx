export function LabelInput(props: {label: string, value: string | undefined | number, onChange: (value: string) => void}) {
    return <div>
        <label>
        {props.label}
        <input type="text" value={props.value === undefined ? "" : props.value} onChange={(event) => props.onChange(event.target.value)}/>
    </label>
    </div>;
}
  
