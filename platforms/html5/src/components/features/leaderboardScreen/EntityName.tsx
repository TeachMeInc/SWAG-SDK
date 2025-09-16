import Icon from '@/components/ui/Icon';

interface Props {
  name: string;
  isGuest?: boolean;
}

export default function EntityName (props: Props) {
  return (
    <div className='swag-gameThemed-entityName'>
      <div>Name</div>
      {
        props.isGuest ? (
          <strong>
            {props.name}
          </strong>
        ) : (
          <strong>
            {props.name}
            <Icon icon='settings' />
          </strong>
        )
      }
    </div>
  );
}
