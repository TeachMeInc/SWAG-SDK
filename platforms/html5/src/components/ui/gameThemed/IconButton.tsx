import Icon from '@/components/ui/Icon';

interface Props {
  icon: string;
  iconStyle?: 'line' | 'fill';
  onClick?: () => void;
  delete?: boolean;
}

export default function IconButton (props: Props) {
  return (
    <button 
      onClick={props.onClick}
      className='swag-gameThemed-input swag-gameThemed-iconButton'
    >
      <span>
        <Icon 
          icon={props.icon} 
          iconStyle={props.iconStyle} 
          style={props.delete ? { color: 'var(--swag-error)' } : {}}
        />
      </span>
    </button>
  );
}
