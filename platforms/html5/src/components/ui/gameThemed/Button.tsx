interface Props {
  children?: preact.ComponentChildren
  onClick?: () => void
}

export default function Button (props: Props) {
  return (
    <button 
      className='swag-gameThemed-input swag-gameThemed-button'
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}
