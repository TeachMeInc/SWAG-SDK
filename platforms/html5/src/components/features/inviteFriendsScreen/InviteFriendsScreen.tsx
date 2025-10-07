
import { useRef, useState } from 'preact/hooks';
import inviteFriendsScreenUi from '@/api/inviteFriendsScreenUi';
import Header from '@/components/ui/gameThemed/Header';
import Panel from '@/components/ui/gameThemed/Panel';
import session from '@/session';
import Button from '@/components/ui/gameThemed/Button';
import JoinLeaderboard from '@/components/features/JoinLeaderboard';
import InviteFriends from '@/components/features/inviteFriendsScreen/InviteFriends';
import { QRCode } from '@/components/ui/QRCode';
import leaderboardScreenUi from '@/api/leaderboardScreenUi';
// import utils from '@/utils';

interface Props {
  roomCode: string;
  onClickBack?: () => void;
  onClickPlay?: () => void;
}

export default function InviteFriendsScreen (props: Props) {
  // Screen state
  const shareUrlRef = useRef((() => {
    const keyword = Array.isArray(session.game?.shockwave_keyword) 
      ? session.game?.shockwave_keyword[ 0 ] 
      : session.game?.shockwave_keyword;

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
    setExitingRight(true);
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

  const handleJoined = (roomCode: string) => {
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('leaderboard', roomCode);
    window.history.replaceState({}, '', newUrl.toString());

    leaderboardScreenUi.show({
      onClickBack: () => {},
    });
    setTimeout(() => {
      inviteFriendsScreenUi.hide();
    }, 400); // match animation duration
  };

  return (
    <Panel
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
          {props.onClickPlay ? 'Play Game' : 'Close'}
        </Button>
      </div>

      <div>
        <InviteFriends
          value={shareUrlRef.current}
        />
      </div>

      <div className='swag-gameThemed__qrCode'>
        <strong><code>{props.roomCode}</code></strong>
        <QRCode value={shareUrlRef.current} />
      </div>

      <hr />

      <div>
        <JoinLeaderboard 
          onJoined={handleJoined}
        />
      </div>
    </Panel>
  );
}
