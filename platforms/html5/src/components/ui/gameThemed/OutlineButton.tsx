interface Props {
  children?: preact.ComponentChildren
  onClick?: () => void
}

export default function OutlineButton (props: Props) {
  return (
    <button 
      className='swag-gameThemed-outlineButton' 
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}
