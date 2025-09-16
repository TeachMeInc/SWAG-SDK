import Icon from '@/components/ui/Icon';

interface Props {
  icon: string;
}

export default function IconButton (props: Props) {
  return (
    <button 
      className='swag-gameThemed-input swag-gameThemed-iconButton'
    >
      <span>
        <Icon icon={props.icon} />
      </span>
    </button>
  );
}
