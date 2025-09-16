
import { useState } from 'preact/hooks';
import inviteFriendsScreenUi from '@/api/inviteFriendsScreenUi';
import Header from '@/components/ui/gameThemed/Header';
import Panel from '@/components/ui/gameThemed/Panel';
import session from '@/session';
import Button from '@/components/ui/gameThemed/Button';
import JoinLeaderboard from '@/components/features/JoinLeaderboard';
import InviteFriends from '@/components/features/inviteFriendsScreen/InviteFriends';

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
      <div>
        <Button>
          Play Game
        </Button>
      </div>

      <div>
        <InviteFriends />
      </div>

      <div className='swag-gameThemed__qrCode'>
        <strong>QR Code</strong>
        <figure></figure>
      </div>

      <hr />

      <div>
        <JoinLeaderboard />
      </div>
    </Panel>
  );
}
