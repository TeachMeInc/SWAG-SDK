import { useState } from 'preact/hooks';
import leaderboardScreenUi from '@/api/leaderboardScreenUi';
import Header from '@/components/ui/gameThemed/Header';
import Panel from '@/components/ui/gameThemed/Panel';
import session from '@/session';
import LeaderboardTable, { LeaderboardTableEmpty, LeaderboardTableRow } from '@/components/features/leaderboardScreen/LeaderboardTable';
import EntityName from '@/components/features/leaderboardScreen/EntityName';
import JoinLeaderboard from '@/components/features/JoinLeaderboard';
import Select from '@/components/ui/gameThemed/Select';
import IconButton from '@/components/ui/gameThemed/IconButton';
import { makeDefaultState, useLeaderboardScreenState } from '@/components/features/leaderboardScreen/leaderboardScreenState';
import { LeaderboardData } from '@/api/data';
import inviteFriendsScreenUi from '@/api/inviteFriendsScreenUi';
import splashScreenUi from '@/api/splashScreenUi';
import dataApi from '@/api/data';
import utils from '@/utils';
import { DateString } from '@/types/DateString';
import loaderUi from '@/api/loaderUi';
import Button from '@/components/ui/gameThemed/Button';
import privateLeaderboardApi from '@/api/privateLeaderboard';

interface Props {
  onClickBack?: () => void;
  levelKey: string;
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

  const onClickLeaveLeaderboard = async () => {
    try {
      await dataApi.postUserLeaderboardLeave(state.currentRoom!.key);
      session.entity!.leaderboards = session.entity!.leaderboards?.filter(r => r !== state.currentRoom!.key);
      dispatch({ type: 'leaveRoom', payload: state.currentRoom!.key });
    } catch (err: any) {
      utils.error('Error leaving leaderboard room:', err.message || err);
    }
  };

  const onClickShareLeaderboard = async () => {
    inviteFriendsScreenUi.show({
      roomCode: state.currentRoom?.key,
      onClickBack: () => {},
      onClickPlay: () => {
        splashScreenUi.hide();
        leaderboardScreenUi.hide();
      }
    });
  };

  const onClickCreateLeaderboard = async () => {
    inviteFriendsScreenUi.show({
      onClickBack: () => {},
      onClickPlay: () => {
        splashScreenUi.hide();
        leaderboardScreenUi.hide();
      },
      onRoomCodeAllocated: async (code: string) => {
        await privateLeaderboardApi.submitPendingScore();
        onJoinedLeaderboard(code);
      }
    });
  };

  const onChangeRoom = async (roomCode: string) => {
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('leaderboard', roomCode);
    window.history.replaceState({}, '', newUrl.toString());

    try {
      loaderUi.show(350);
      const leaderboardData = await dataApi.getScores({
        level_key: props.levelKey,
        leaderboard: roomCode,
        day: state.currentDay.key,
        type: 'daily',
      });
      loaderUi.hide();
      dispatch({ type: 'setCurrentRoom', payload: roomCode });
      dispatch({ type: 'setLeaderboardData', payload: leaderboardData });
    } catch (err: any) {
      utils.error('Error changing leaderboard room:', err.message || err);
    }
  };

  const onChangeDay = async (day: string) => {
    try {
      loaderUi.show(350);
      const leaderboardData = await dataApi.getScores({
        level_key: props.levelKey,
        leaderboard: state.currentRoom!.key,
        day: day as DateString,
        type: 'daily',
      });
      loaderUi.hide();
      dispatch({ type: 'setCurrentDay', payload: day as DateString });
      dispatch({ type: 'setLeaderboardData', payload: leaderboardData });
    } catch (err: any) {
      utils.error('Error changing leaderboard day:', err.message || err);
    }
  };

  const onJoinedLeaderboard = (roomCode: string) => {
    dispatch({ type: 'addRoom', payload: roomCode });
    onChangeRoom(roomCode);
  };

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
        <EntityName />
      </div>

      <div className='swag-leaderboardScreen__tableContainer'>
        <div className={state.currentRoom ? '' : '--disabled'}>
          <span className='--fit'>
            {
              state.rooms.length ? (
                <Select
                  options={state.rooms}
                  value={state.currentRoom?.key}
                  onChange={onChangeRoom}
                />
              ) : (
                <Select
                  options={[ { key: '', label: 'No leaderboards' } ]}
                />
              )
            }
          </span>
          <span>
            <IconButton 
              icon='delete'
              iconStyle='line' 
              onClick={onClickLeaveLeaderboard}
              delete
            />
          </span>
          <span>
            <IconButton 
              icon='share'
              iconStyle='line' 
              onClick={onClickShareLeaderboard}
            />
          </span>
        </div>
        <div className={state.currentRoom ? '' : '--disabled'}>
          <span className='--fit'>
            <Select
              options={state.days}
              value={state.currentDay.key}
              onChange={onChangeDay}
            />
          </span>
        </div>
        <div>
          <span className='--fit'>
            <LeaderboardTable>
              {
                state.leaderboardData ? (
                  state.leaderboardData.length ? (
                    state.leaderboardData?.map((item, i) => (
                      <LeaderboardTableRow key={i}>
                        <div>{i + 1}</div>
                        <div>{item.leaderboard_name || item.screen_name || 'Guest'}</div>
                        <div>{item.value}</div>
                      </LeaderboardTableRow>
                    ))
                  ) : (
                    <LeaderboardTableEmpty>
                      No scores have been posted yet.
                    </LeaderboardTableEmpty>
                  )
                ) : (
                  <>
                    {
                      state.rooms.length ? (
                        <LeaderboardTableEmpty>
                          Loading scores...
                        </LeaderboardTableEmpty>
                      ) : (
                        <LeaderboardTableEmpty>
                          {
                            privateLeaderboardApi.getPendingScore() ? (
                              <>
                                <p style={{ marginBottom: '0.25rem' }}>
                                  You completed this puzzle in <strong>{privateLeaderboardApi.getPendingScore()?.displayValue || privateLeaderboardApi.getPendingScore()?.value || '--'}</strong>! 
                                </p>
                                <p style={{ marginTop: '0.25rem' }}>
                                  Create or join a leaderboard to submit your score and share it with friends.
                                </p>
                              </>
                            ) : (
                              <>
                                Join a leaderboard to start tracking your scores and playing with friends!
                              </>
                            )
                          }
                          <Button onClick={onClickCreateLeaderboard}>
                            Challenge Friends
                          </Button>
                        </LeaderboardTableEmpty>
                      )
                    }
                  </>
                )
              }
            </LeaderboardTable>
          </span>
        </div>
      </div>

      <div>
        <JoinLeaderboard 
          onJoined={onJoinedLeaderboard}
        />
      </div>
    </Panel>
  );
}
