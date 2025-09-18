interface Props {
  icon: string;
  iconStyle?: 'line' | 'fill';
  onClick?: () => void;
  style?: preact.JSX.CSSProperties;
}

export default function Icon (props: Props) {
  const iconStyle = props.iconStyle || 'fill';
  return (
    <i 
      aria-hidden='true'
      className={`swag-icon ${props.icon}-${iconStyle}`}
      onClick={props.onClick}
      style={props.style}
    />
  );
}
