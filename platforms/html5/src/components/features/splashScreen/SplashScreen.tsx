import Button from '@/components/ui/gameThemed/Button';
import OutlineButton from '@/components/ui/gameThemed/OutlineButton';
import Panel from '@/components/ui/gameThemed/Panel';
import session from '@/session';
import { useEffect, useState } from 'preact/hooks';

interface Props {
  isBeta?: boolean;
}

export default function SplashScreen (props: Props) {
  const [ img, setImg ] = useState<string | null>(null);

  useEffect(() => {
    if (img) return;

    const image = new Image();
    image.onload = () => {
      setImg(image.src);
    };
    image.src = 'https://placecats.com/300/200';

    return () => {
      image.onload = null;
    };
  }, [ img ]);

  return (
    <Panel 
      bgColor='#FFA801'
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
              <Button>Play</Button>
              <Button>Archive</Button>
              <OutlineButton>Play with Friends</OutlineButton>
              <OutlineButton>View Scores</OutlineButton>
            </div>
          </>
        ) : null
      }
    </Panel>
  );
}
