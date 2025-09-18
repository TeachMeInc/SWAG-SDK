import backIcon from '@/assets/back-icon.svg';

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
            <img src={backIcon} alt='Back' width={40} height={40} />
          </div>
        ) : <div />
      }
      <h4>{props.title}</h4>
      <div />
    </header>
  );
}
