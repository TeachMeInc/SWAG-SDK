# LeaderboardData (Interface)

The `LeaderboardData` interface represents a single entry or score in a leaderboard.

## Fields

| Field              | Type     | Description                                 |
|--------------------|----------|---------------------------------------------|
| `level_key`        | string   | Key identifying the level or category.      |
| `value`            | string   | The score or value achieved.                |
| `date_created`     | string   | Date the score was recorded.                |
| `screen_name`      | string   | The player's display name.                  |
| `leaderboard_name` | string?  | Optional name of the leaderboard.           |
| `avatarUrl`        | string   | URL to the player's avatar image.           |

## Usage

Used to display leaderboard entries and scores for players.