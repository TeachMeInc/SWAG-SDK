interface Props {
  children?: preact.ComponentChildren;
}

export default function LeaderboardTable (props: Props) {
  return (
    <table className='swag-gameThemed-leaderboardTable'>
      <thead>
        <tr>
          <th>Pos</th>
          <th>Name</th>
          <th>Time</th>
        </tr>
      </thead>
      <tbody>
        {props.children}
      </tbody>
    </table>
  );
}

export function LeaderboardTableLoader () {
  return (
    <tr>
      <td colSpan={3} className='swag-gameThemed-leaderboardTable__loader'>
        Loading...
      </td>
    </tr>
  );
}

export function LeaderboardTableEmpty () {
  return (
    <tr>
      <td colSpan={3} className='swag-gameThemed-leaderboardTable__empty'>
        No scores have been posted yet.
      </td>
    </tr>
  );
}
