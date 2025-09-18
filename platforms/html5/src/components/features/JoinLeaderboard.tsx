import TextInput from '@/components/ui/gameThemed/TextInput';
import Icon from '@/components/ui/Icon';
import utils from '@/utils';
import { useRef } from 'preact/hooks';

export default function JoinLeaderboard () {
  const containerRef = useRef<HTMLDivElement>(null);
  const platform = utils.getPlatform();

  const joinLeaderboard = async (roomCode: string) => {
    if (!roomCode) return;
    // console.log('Joining leaderboard with code:', roomCode); 
    throw new Error('Not implemented yet');
  };

  const promptJoinLeaderboard = () => {
    if (platform !== 'app') return;

    const code = prompt('Enter Leaderboard Code:');
    joinLeaderboard(code?.trim() || '');
  };

  const onClickJoinLeaderboard = () => {
    const code = containerRef.current?.querySelector('input')?.value;
    joinLeaderboard(code?.trim() || '');
  };

  return (
    <div className='swag-gameThemed-joinLeaderboard'>
      <p>Join Another Leaderboard:</p>
      <div ref={containerRef}>
        <TextInput 
          placeholder='Enter Code'
          textAlign='center'
          onClick={promptJoinLeaderboard}
          readOnly={platform === 'app'}
          onReturn={() => onClickJoinLeaderboard()}
          button={platform !== 'app' ? (
            <Icon icon='settings' onClick={() => onClickJoinLeaderboard()} />
          ) : null}
        />
      </div>
    </div>
  );
}
