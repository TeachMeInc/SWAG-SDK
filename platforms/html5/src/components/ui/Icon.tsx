export default function Icon (props: { icon: string, toggled?: boolean }) {
  const icon = props.icon;

  return (
    <i 
      aria-hidden='true'
      className={`swag-icon ${icon}-${props.toggled ? 'line' : 'fill'}`}
    />
  );
}
