import TextInput from '@/components/ui/gameThemed/TextInput';

interface Props {
  value: string;
}

export default function InviteFriends (props: Props) {
  return (
    <div className='swag-gameThemed-inviteFriends'>
      <p>Invite Your Friends:</p>
      <div>
        <TextInput 
          value={props.value} 
          readOnly 
        />
      </div>
    </div>
  );
}
