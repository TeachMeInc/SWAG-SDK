interface Props {
  value?: string;
  readOnly?: boolean;
  placeholder?: string;
  button?: preact.ComponentChildren;
  textAlign?: 'left' | 'center' | 'right';
  onFocus?: (evt: FocusEvent) => void;
  onBlur?: (evt: FocusEvent) => void;
  onClick?: (evt: MouseEvent) => void;
  onReturn?: () => void;
  style?: preact.JSX.CSSProperties;
}

export default function TextInput (props: Props) {
  const onKeyDown = (evt: preact.JSX.TargetedKeyboardEvent<HTMLInputElement>) => {
    if (evt.key.toLowerCase() === 'enter' && props.onReturn) {
      props.onReturn();
    }
  };

  return (
    <div className='swag-gameThemed-input swag-gameThemed-textInput' style={props.style}>
      <input 
        type='text' 
        value={props.value} 
        readOnly={props.readOnly} 
        placeholder={props.placeholder}
        style={{ textAlign: props.textAlign || 'left' }}
        onFocus={props.onFocus}
        onBlur={props.onBlur}
        onClick={props.onClick}
        onKeyDown={onKeyDown}
      />
      {props.button && (
        <div className='swag-gameThemed-textInput__button'>
          {props.button}
        </div>
      )}
    </div>
  );
}
