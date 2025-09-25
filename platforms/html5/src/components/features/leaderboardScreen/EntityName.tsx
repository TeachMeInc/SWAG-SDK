import TextInput from '@/components/ui/gameThemed/TextInput';
import Icon from '@/components/ui/Icon';
import session from '@/session';
import utils from '@/utils';
import { useRef, useState } from 'preact/hooks';
import dataApi from '@/api/data';

export default function EntityName () {
  const [ editing, setEditing ] = useState(false);
  const [ name, setName ] = useState(
    session.entity!.leaderboard_name || 
    session.entity!.member?.shockwave?.screen_name || 
    ''
  );
  const containerRef = useRef<HTMLDivElement>(null);

  const finishEditing = async (newName?: string) => {
    try {
      newName = newName || containerRef.current?.querySelector('input')?.value || '';
      if (!newName) {
        cancelEditing();
        return;
      }
      await dataApi.postUserLeaderboardName(newName);
      session.entity!.leaderboard_name = newName;
      setName(newName);
      setEditing(false);
    } catch (err: any) {
      cancelEditing();
      utils.error('Error updating leaderboard name', err.message || err);
    }
  };

  const cancelEditing = () => {
    setName(session.entity!.leaderboard_name);
    setEditing(false);
  };

  const onClickBeginEditing = () => {
    if (utils.isMobileDevice()) {
      const newName = prompt('Pick a Name', name || '') || '';
      finishEditing(newName);
      return;
    }

    setEditing(true);

    const inputEl = containerRef.current?.querySelector('input');
    if (inputEl) {
      setTimeout(() => {
        inputEl.focus();
        inputEl.select();
      }, 0);
    }
  };

  const onClickFinishEditing = () => {
    finishEditing();
  };

  const onClickCancelEditing = () => {
    cancelEditing();
  };

  return (
    <div className='swag-gameThemed-entityName'>
      <div>Hello,</div>
      <strong ref={containerRef} className={(name || editing) ? '' : '--noName'}>
        <TextInput
          customClassName='swag-gameThemed-entityName__textInput'
          value={name}
          style={{ display: editing ? 'inline-block' : 'none' }}
          placeholder='Pick a Name'
          button={(
            <>
              <Icon 
                icon='check'
                iconStyle='line'
                onClick={onClickFinishEditing}
              />
              <Icon 
                icon='close'
                iconStyle='line'
                onClick={onClickCancelEditing}
              />
            </>
          )}
        />
        {
          !editing ? (
            <>
              <span onClick={onClickBeginEditing}>
                {name || 'Pick a Name'}
              </span>
              <Icon icon='pencil'
                onClick={onClickBeginEditing}
              />
            </>
          ) : null
        }
      </strong>
    </div>
  );
}
