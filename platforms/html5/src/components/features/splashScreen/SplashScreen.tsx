// import inviteFriendsScreenUi from '@/api/inviteFriendsScreenUi';
// import leaderboardScreenUi from '@/api/leaderboardScreenUi';
// import messages from '@/api/messages';
import splashScreenUi from '@/api/splashScreenUi';
// import Button from '@/components/ui/gameThemed/Button';
// import OutlineButton from '@/components/ui/gameThemed/OutlineButton';
import Panel from '@/components/ui/gameThemed/Panel';
import session from '@/session';
import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import swStampWhite from '@/assets/sw-stamp-white.svg';
import utils from '@/utils';
import loaderUi from '@/api/loaderUi';

interface Props {
  isBeta?: boolean;
  onClickPlay?: () => void;
  hasLeaderboard?: boolean;
  waitForAssets?: Promise<void>;
}

export default function SplashScreen (props: Props) {
  // State
  const [ ready, setReady ] = useState(props.waitForAssets ? false : true);
  const [ img, setImg ] = useState<string | null>(null);

  // Wait for game icon to load
  useEffect(() => {
    if (img) return;

    const image = new Image();
    image.onload = () => {
      setImg(image.src);
      document.body.classList.remove('swag-splashScreen--open'); // show toolbar
    };
    image.onerror = () => {
      utils.error('Failed to load game icon:', session.game!.archive_icon);
      image.src = swStampWhite; // fallback
    };
    image.src = session.game!.archive_icon;

    return () => {
      image.onload = null;
    };
  }, [ img ]);

  // Wait for external assets to be ready, if provided
  useEffect(() => {
    if (ready) return;
    if (!props.waitForAssets) return;

    props.waitForAssets.then(() => {
      loaderUi.hide();
      setReady(true);
    });
  }, [ ready, props.waitForAssets ]);

  // Animation state
  const [ exiting, setExiting ] = useState(false);

  const onClickPlay = useCallback(() => {
    setExiting(true);
    props.onClickPlay?.();
    setTimeout(() => {
      splashScreenUi.hide();
    }, 400); // match animation duration
  }, [ props ]);

  const isFinishedRef = useRef(false);

  useEffect(() => {
    if (isFinishedRef.current) return;

    if (img && ready) {
      isFinishedRef.current = true;

      // Auto-play after short delay
      const timeout = setTimeout(() => {
        onClickPlay();
      }, 1000);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [ img, ready, onClickPlay ]);

  // const onClickArchive = () => {
  //   messages.trySendMessage('swag.navigateToArchive');
  // };

  // const onClickInviteFriends = () => {
  //   inviteFriendsScreenUi.show({
  //     source: 'splashScreen',
  //     onClickBack: () => {},
  //     onClickPlay: () => {
  //       splashScreenUi.hide();
  //       props.onClickPlay?.();
  //     }
  //   });
  // };

  // const onClickLeaderboard = () => {
  //   leaderboardScreenUi.show({
  //     onClickBack: () => {},
  //     onClickPlay: () => {
  //       props.onClickPlay?.();
  //     }
  //   });
  // };

  return (
    <Panel 
      className={`swag-splashScreen ${exiting ? 'swag-slide-out-down' : ''}`}
    >
      {
        (ready && img) ? (
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
            {/* <div className='swag-splashScreen__buttons'>
              <Button onClick={onClickPlay}>Play</Button>
              <Button onClick={onClickArchive}>Archive</Button>
              {
                props.hasLeaderboard ? (<>
                  <OutlineButton onClick={onClickInviteFriends}>Play with Friends</OutlineButton>
                  <OutlineButton onClick={onClickLeaderboard}>View Scores</OutlineButton>
                </>) : null
              }
            </div> */}
          </>
        ) : null
      }
    </Panel>
  );
}
