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
  showOptions?: any;
}

export default function SplashScreen (props: Props) {
  const [ img, setImg ] = useState<string | null>(null);

  useEffect(() => {
    if (img) return;

    const image = new Image();
    image.onload = () => {
      setImg(image.src);
    };
    image.src = session.game!.iconUrl;

    return () => {
      image.onload = null;
    };
  }, [ img ]);

  const onClickPlay = () => {
    splashScreenUi.hide();
    props.onClickPlay?.();
  };

  const onClickArchive = () => {
    messages.trySendMessage('swag.navigateToArchive');
  };

  const onClickInviteFriends = () => {
    // splashScreenUi.hide();
    inviteFriendsScreenUi.show({
      onClickBack: () => {
        splashScreenUi.show({ ...props.showOptions });
      }
    });
  };

  const onClickLeaderboard = () => {
    // splashScreenUi.hide();
    leaderboardScreenUi.show({
      onClickBack: () => {
        splashScreenUi.show({ ...props.showOptions });
      }
    });
  };

  return (
    <Panel 
      bgColor={session.game?.hexColor}
      className='swag-splashScreen'
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
              <OutlineButton onClick={onClickInviteFriends}>Play with Friends</OutlineButton>
              <OutlineButton onClick={onClickLeaderboard}>View Scores</OutlineButton>
            </div>
          </>
        ) : null
      }
    </Panel>
  );
}
