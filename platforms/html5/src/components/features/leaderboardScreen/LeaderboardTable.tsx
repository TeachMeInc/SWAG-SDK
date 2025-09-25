interface Props {
  children?: preact.ComponentChildren;
}

export default function LeaderboardTable (props: Props) {
  return (
    <div className='swag-gameThemed-leaderboardTable'>
      <div className='swag-gameThemed-leaderboardTable__header'>
        <div className='swag-gameThemed-leaderboardTable__row'>
          <div>Pos</div>
          <div>Name</div>
          <div>Time</div>
        </div>
      </div>
      <div className='swag-gameThemed-leaderboardTable__body'>
        {props.children}
      </div>
    </div>
  );
}

export function LeaderboardTableRow (props: { children?: preact.ComponentChildren }) {
  return (
    <div className='swag-gameThemed-leaderboardTable__row'>
      {props.children}
    </div>
  );
}

export function LeaderboardTableEmpty (props: { children?: preact.ComponentChildren }) {
  return (
    <div className='swag-gameThemed-leaderboardTable__row swag-gameThemed-leaderboardTable__empty'>
      <div>
        {props.children}
      </div>
    </div>
  );
}
