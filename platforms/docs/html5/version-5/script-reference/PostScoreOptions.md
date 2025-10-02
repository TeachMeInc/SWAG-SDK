# PostScoreOptions (Interface)

The `PostScoreOptions` interface defines options for posting a score to a leaderboard or daily challenge.

## Fields

| Field            | Type      | Description                                         |
|------------------|-----------|-----------------------------------------------------|
| `day`            | string?   | The day for daily challenges.                       |
| `type`           | string?   | Type of score or challenge.                         |
| `level_key`      | string?   | Key for the level or category.                      |
| `period`         | string?   | Time period for the score (e.g., daily, weekly).    |
| `current_user`   | string?   | The current user's identifier.                      |
| `target_date`    | string?   | Target date for the score.                          |
| `value_formatter`| string?   | Formatter for the score value.                      |
| `use_daily`      | boolean?  | Whether to use daily scoring.                       |
| `confirmation`   | boolean?  | Whether confirmation is required.                   |
| `meta`           | any?      | Additional metadata for the score.                  |
| `leaderboard`    | string?   | Name of the leaderboard.                            |

## Usage

Used when posting scores to leaderboards or daily challenges with additional options.