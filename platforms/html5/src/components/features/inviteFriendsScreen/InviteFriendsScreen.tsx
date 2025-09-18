
import { useRef, useState } from 'preact/hooks';
import inviteFriendsScreenUi from '@/api/inviteFriendsScreenUi';
import Header from '@/components/ui/gameThemed/Header';
import Panel from '@/components/ui/gameThemed/Panel';
import session from '@/session';
import Button from '@/components/ui/gameThemed/Button';
import JoinLeaderboard from '@/components/features/JoinLeaderboard';
import InviteFriends from '@/components/features/inviteFriendsScreen/InviteFriends';
import { QRCode } from '@/components/ui/QRCode';
// import utils from '@/utils';

interface Props {
  roomCode: string;
  onClickBack?: () => void;
  onClickPlay?: () => void;
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
    // url.searchParams.set('utm_source_platform', utils.getPlatform());
    // url.searchParams.set('utm_source', 'invite_friends_screen');

    return url.toString();
  })());

  // Animation state
  const [ exitingRight, setExitingRight ] = useState(false);
  const [ exitingDown, setExitingDown ] = useState(false);

  const handleBack = () => {
    if (props.onClickBack) {
      setExitingRight(true);
    } else {
      setExitingDown(true);
    }
    props.onClickBack?.();
    setTimeout(() => {
      inviteFriendsScreenUi.hide();
    }, 400); // match animation duration
  };

  const handleOnClickPlay = () => {
    setExitingDown(true);
    props.onClickPlay?.();
    setTimeout(() => {
      inviteFriendsScreenUi.hide();
    }, 400); // match animation duration
  };

  return (
    <Panel
      bgColor={session.game?.hex_color}
      className={`swag-inviteFriendsScreen ${exitingRight ? 'swag-slide-out-right' : ''} ${exitingDown ? 'swag-slide-out-down' : ''}`}
      header={
        <Header
          title='Play With Friends'
          onClickBack={handleBack}
        />
      }
    >
      <div>
        <Button onClick={handleOnClickPlay}>
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
