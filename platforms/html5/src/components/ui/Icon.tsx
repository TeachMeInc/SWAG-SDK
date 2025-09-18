interface Props {
  icon: string;
  toggled?: boolean;
  onClick?: () => void;
}

export default function Icon (props: Props) {
  return (
    <i 
      aria-hidden='true'
      className={`swag-icon ${props.icon}-${props.toggled ? 'line' : 'fill'}`}
      onClick={props.onClick}
    />
  );
}
