import Icon from '@/components/ui/Icon';

interface Props {
  name: string;
}

export default function EntityName (props: Props) {
  return (
    <div className='swag-gameThemed-entityName'>
      <div>Hello,</div>
      <strong className={props.name ? '' : '--noName'}>
        <span>{props.name || 'Pick a Name'}</span>
        <Icon icon='settings' />
      </strong>
    </div>
  );
}
