import Icon from '@/components/ui/Icon';

interface Props {
  title: preact.ComponentChildren;
  onClickBack?: () => void;
}

export default function Header (props: Props) {
  return (
    <header className='swag-gameThemed-header'>
      {
        props.onClickBack ? (
          <div 
            className='swag-gameThemed-header__backButton' 
            onClick={props.onClickBack}
          >
            <Icon icon='back' />
          </div>
        ) : <div />
      }
      <h4>{props.title}</h4>
      <div />
    </header>
  );
}
