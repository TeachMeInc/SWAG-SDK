
import { useState } from 'preact/hooks';
import leaderboardScreenUi from '@/api/leaderboardScreenUi';
import Header from '@/components/ui/gameThemed/Header';
import Panel from '@/components/ui/gameThemed/Panel';
import session from '@/session';

interface Props {
  onClickBack?: () => void;
}

export default function LeaderboardScreen (props: Props) {
  const [ exiting, setExiting ] = useState(false);

  const handleBack = () => {
    setExiting(true);
    setTimeout(() => {
      leaderboardScreenUi.hide();
      props.onClickBack?.();
    }, 400); // match animation duration
  };

  return (
    <Panel
      bgColor={session.game?.hexColor}
      className={`swag-leaderboardScreen ${exiting ? 'swag-slide-out-right' : ''}`}
      header={
        <Header
          title='View Scores'
          onClickBack={handleBack}
        />
      }
    >
      Leaderboard Screen
    </Panel>
  );
}
