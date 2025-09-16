interface Props {

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
        <tr>
          <td colSpan={3} className='swag-gameThemed-leaderboardTable__loader'>
            Loading...
          </td>
        </tr>
        {/* <tr>
          <td>1</td>
          <td>Player1</td>
          <td>00:45</td>
        </tr>
        <tr>
          <td>2</td>
          <td>Player2</td>
          <td>00:50</td>
        </tr>
        <tr>
          <td>3</td>
          <td>Player3</td>
          <td>01:00</td>
        </tr> */}
      </tbody>
    </table>
  );
}
