interface Props {
  children?: preact.ComponentChildren
}

export default function OutlineButton (props: Props) {
  return (
    <button className='swag-gameThemed-outlineButton'>
      {props.children}
    </button>
  );
}
