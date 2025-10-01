import inviteFriendsScreenUi from '@/api/inviteFriendsScreenUi';
import leaderboardScreenUi from '@/api/leaderboardScreenUi';
import messages from '@/api/messages';
import splashScreenUi from '@/api/splashScreenUi';
import Button from '@/components/ui/gameThemed/Button';
import OutlineButton from '@/components/ui/gameThemed/OutlineButton';
import Panel from '@/components/ui/gameThemed/Panel';
import session from '@/session';
import { useEffect, useState } from 'preact/hooks';

interface Props {
  isBeta?: boolean;
  onClickPlay?: () => void;
  hasLeaderboard?: boolean;
}

export default function SplashScreen (props: Props) {
  // State
  const [ img, setImg ] = useState<string | null>(null);

  useEffect(() => {
    if (img) return;

    const image = new Image();
    image.onload = () => {
      setImg(image.src);
      document.body.classList.remove('swag-splashScreen--open'); // show toolbar
    };
    image.src = session.game!.icon_url;

    return () => {
      image.onload = null;
    };
  }, [ img ]);

  // Animation state
  const [ exiting, setExiting ] = useState(false);

  const onClickPlay = () => {
    setExiting(true);
    setTimeout(() => {
      splashScreenUi.hide();
      props.onClickPlay?.();
    }, 400); // match animation duration
  };

  const onClickArchive = () => {
    messages.trySendMessage('swag.navigateToArchive');
  };

  const onClickInviteFriends = () => {
    inviteFriendsScreenUi.show({
      exitDown: true,
      onClickBack: () => {},
      onClickPlay: () => {
        splashScreenUi.hide();
        props.onClickPlay?.();
      }
    });
  };

  const onClickLeaderboard = () => {
    leaderboardScreenUi.show({
      onClickBack: () => {}
    });
  };

  return (
    <Panel 
      className={`swag-splashScreen ${exiting ? 'swag-slide-out-down' : ''}`}
    >
      {
        img ? (
          <>
            <div className='swag-splashScreen__gameTitle'>
              <figure>
                <img src={img} alt={session.gameTitle} />
              </figure>
              <h1>{session.gameTitle}</h1>
              {
                props.isBeta ? (
                  <p>Beta</p>
                ) : null
              }
            </div>
            <div className='swag-splashScreen__buttons'>
              <Button onClick={onClickPlay}>Play</Button>
              <Button onClick={onClickArchive}>Archive</Button>
              {
                props.hasLeaderboard ? (<>
                  <OutlineButton onClick={onClickInviteFriends}>Play with Friends</OutlineButton>
                  <OutlineButton onClick={onClickLeaderboard}>View Scores</OutlineButton>
                </>) : null
              }
            </div>
          </>
        ) : null
      }
    </Panel>
  );
}
