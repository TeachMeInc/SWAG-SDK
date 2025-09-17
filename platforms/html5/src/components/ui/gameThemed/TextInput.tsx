interface Props {
  value?: string;
  readOnly?: boolean;
}

export default function TextInput (props: Props) {
  return (
    <div className='swag-gameThemed-input swag-gameThemed-textInput'>
      <input 
        type='text' 
        value={props.value} 
        readOnly={props.readOnly} 
      />
    </div>
  );
}
