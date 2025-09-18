import Icon from '@/components/ui/Icon';

interface Props {
  icon: string;
  onClick?: () => void;
}

export default function IconButton (props: Props) {
  return (
    <button 
      onClick={props.onClick}
      className='swag-gameThemed-input swag-gameThemed-iconButton'
    >
      <span>
        <Icon icon={props.icon} />
      </span>
    </button>
  );
}
