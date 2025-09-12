
import { useState } from 'preact/hooks';
import inviteFriendsScreenUi from '@/api/inviteFriendsScreenUi';
import Header from '@/components/ui/gameThemed/Header';
import Panel from '@/components/ui/gameThemed/Panel';
import session from '@/session';

interface Props {
  onClickBack?: () => void;
}

export default function InviteFriendsScreen (props: Props) {
  const [ exiting, setExiting ] = useState(false);

  const handleBack = () => {
    setExiting(true);
    setTimeout(() => {
      inviteFriendsScreenUi.hide();
      props.onClickBack?.();
    }, 400); // match animation duration
  };

  return (
    <Panel
      bgColor={session.game?.hexColor}
      className={`swag-inviteFriendsScreen ${exiting ? 'swag-slide-out-right' : ''}`}
      header={
        <Header
          title='Play With Friends'
          onClickBack={handleBack}
        />
      }
    >
      Invite Friends Screen
    </Panel>
  );
}
