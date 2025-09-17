import { useEffect, useState } from 'preact/hooks';
import leaderboardScreenUi from '@/api/leaderboardScreenUi';
import Header from '@/components/ui/gameThemed/Header';
import Panel from '@/components/ui/gameThemed/Panel';
import session from '@/session';
import LeaderboardTable from '@/components/features/leaderboardScreen/LeaderboardTable';
import EntityName from '@/components/features/leaderboardScreen/EntityName';
import JoinLeaderboard from '@/components/features/JoinLeaderboard';
import Select from '@/components/ui/gameThemed/Select';
import IconButton from '@/components/ui/gameThemed/IconButton';
import { makeDefaultState, useLeaderboardScreenState } from '@/components/features/leaderboardScreen/leaderboardScreenState';
import { LeaderboardData } from '@/api/data';

interface Props {
  onClickBack?: () => void;
  initialRoomCode: string | null;
  initialLeaderboardData: LeaderboardData[] | null;
}

export default function LeaderboardScreen (props: Props) {
  // Screen state
  const [ state, dispatch ] = useLeaderboardScreenState(
    makeDefaultState({
      leaderboardData: props.initialLeaderboardData,
      currentRoom: props.initialRoomCode 
        ? { key: props.initialRoomCode, label: `Room: ${props.initialRoomCode}` } 
        : null,
    })
  );

  useEffect(() => {
  }, []);

  // Animation state
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
      bgColor={session.game?.hex_color}
      className={`swag-leaderboardScreen ${exiting ? 'swag-slide-out-right' : ''}`}
      header={
        <Header
          title='View Scores'
          onClickBack={handleBack}
        />
      }
    >
      <div>
        <EntityName 
          name={state.userDisplayName}
        />
      </div>

      <div className='swag-leaderboardScreen__tableContainer'>
        <div>
          <span className='--fit'>
            <Select
              options={state.rooms}
            />
          </span>
          <span>
            <IconButton 
              icon='settings' 
            />
          </span>
          <span>
            <IconButton 
              icon='settings' 
            />
          </span>
        </div>
        <div>
          <span className='--fit'>
            <Select
              options={state.days}
            />
          </span>
        </div>
        <div>
          <span className='--fit'>
            <LeaderboardTable />
          </span>
        </div>
      </div>

      <div>
        <JoinLeaderboard />
      </div>
    </Panel>
  );
}
