import TextInput from '@/components/ui/gameThemed/TextInput';
import Icon from '@/components/ui/Icon';
import { useRef, useState } from 'preact/hooks';

interface Props {
  value: string;
}

export default function InviteFriends (props: Props) {
  const timeoutRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [ hasCopied, setHasCopied ] = useState(false);

  const onCopyToClipboard = () => {
    const input = containerRef.current?.querySelector('input');
    if (input) {
      input.select();
      navigator.clipboard.writeText(props.value);
    }
    setHasCopied(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setHasCopied(false);
    }, 2000) as unknown as number;
  };

  return (
    <div className='swag-gameThemed-inviteFriends'>
      <p>
        {
          hasCopied
            ? 'Copied to clipboard!'
            : 'Invite Your Friends:'
        }
      </p>
      <div ref={containerRef}>
        <TextInput 
          value={props.value} 
          readOnly
          onFocus={() => onCopyToClipboard()}
          onClick={() => onCopyToClipboard()}
          button={(
            <Icon icon='copy' iconStyle='line' onClick={() => onCopyToClipboard()} />
          )}
        />
      </div>
    </div>
  );
}
