interface Props {
  children?: preact.ComponentChildren
}

export default function Button (props: Props) {
  return (
    <button className='swag-gameThemed-input swag-gameThemed-button'>
      {props.children}
    </button>
  );
}
