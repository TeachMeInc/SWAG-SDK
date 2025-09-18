import TextInput from '@/components/ui/gameThemed/TextInput';
import Icon from '@/components/ui/Icon';
import utils from '@/utils';
import { useRef, useState } from 'preact/hooks';
import dataApi from '@/api/data';
import session from '@/session';

interface Props {
  onJoined?: (roomCode: string) => void;
}

export default function JoinLeaderboard (props: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const platform = utils.getPlatform();
  const [ errorMessage, setErrorMessage ] = useState<string>('');
  const errorMessageTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const joinLeaderboard = async (roomCode: string) => {
    if (!roomCode) return;

    try {
      await dataApi.postUserLeaderboardJoin(roomCode);

      if (session.entity!.leaderboards.indexOf(roomCode) === -1) {
        session.entity!.leaderboards.push(roomCode);
      }

      props.onJoined?.(roomCode);
    } catch (err: any) {
      utils.error('Error joining leaderboard room:', err.message || err);
      setErrorMessage('We couldn\'t find a leaderboard matching that code.');

      if (errorMessageTimeoutRef.current) {
        clearTimeout(errorMessageTimeoutRef.current);
      }
      errorMessageTimeoutRef.current = setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    } finally {
      const inputEl = containerRef.current?.querySelector('input') as HTMLInputElement;
      if (inputEl) {
        inputEl.value = '';
      }
    }
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
      <p>
        {
          errorMessage 
            ? errorMessage
            : 'Join Another Leaderboard:'
        }
      </p>
      <div ref={containerRef}>
        <TextInput 
          placeholder='Enter Code'
          textAlign='center'
          onClick={promptJoinLeaderboard}
          readOnly={platform === 'app'}
          onReturn={() => onClickJoinLeaderboard()}
          button={platform !== 'app' ? (
            <Icon icon='check' iconStyle='line' onClick={() => onClickJoinLeaderboard()} />
          ) : null}
        />
      </div>
    </div>
  );
}
