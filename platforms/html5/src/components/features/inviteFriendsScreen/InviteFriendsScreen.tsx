
import { useRef, useState } from 'preact/hooks';
import inviteFriendsScreenUi from '@/api/inviteFriendsScreenUi';
import Header from '@/components/ui/gameThemed/Header';
import Panel from '@/components/ui/gameThemed/Panel';
import session from '@/session';
import Button from '@/components/ui/gameThemed/Button';
import JoinLeaderboard from '@/components/features/JoinLeaderboard';
import InviteFriends from '@/components/features/inviteFriendsScreen/InviteFriends';
import { QRCode } from '@/components/ui/QRCode';
import utils from '@/utils';

interface Props {
  roomCode: string;
  onClickBack?: () => void;
}

export default function InviteFriendsScreen (props: Props) {
  // Screen state
  const shareUrlRef = useRef((() => {
    const keyword = Array.isArray(session.game?.keyword) 
      ? session.game?.keyword[ 0 ] 
      : session.game?.keyword;

    const url = new URL(`https://shockwave.com/gamelanding/${keyword}`);
    url.searchParams.set('play', 'true');
    url.searchParams.set('leaderboard', props.roomCode);
    url.searchParams.set('utm_platform', utils.getPlatform());
    // url.searchParams.set('utm_source', 'invite_friends_screen');

    return url.toString();
  })());

  // Animation state
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
      bgColor={session.game?.hex_color}
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
        <InviteFriends
          value={shareUrlRef.current}
        />
      </div>

      <div className='swag-gameThemed__qrCode'>
        <strong>QR Code</strong>
        <QRCode value={shareUrlRef.current} />
      </div>

      <hr />

      <div>
        <JoinLeaderboard />
      </div>
    </Panel>
  );
}
