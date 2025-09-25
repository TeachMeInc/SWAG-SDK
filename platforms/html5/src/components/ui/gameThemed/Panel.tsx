import utils from '@/utils';

interface Props {
  bgColor?: string;
  header?: preact.ComponentChildren;
  children?: preact.ComponentChildren;
  className?: string;
}

export default function Panel (props: Props) {
  const theme = utils.getPlatformTheme();

  const className = [
    'swag-gameThemed-panel',
    props.className || '',
  ].join(' ');

  return (
    <div 
      className={className}
      style={theme === 'light' ? { backgroundColor: props.bgColor } : {}}
    >
      {
        props.header ? (
          <div className='swag-gameThemed-panel__header'>
            {props.header}
          </div>
        ) : null
      }
      {
        props.children ? (
          <div className='swag-gameThemed-panel__content'>
            {props.children}
          </div>
        ) : null
      }
    </div>
  );
}
