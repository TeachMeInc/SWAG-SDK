# Entity (Interface)

The `Entity` interface represents a user or player entity in the SWAG HTML5 SDK. It contains identification, authentication, and leaderboard information for a member.

## Fields

| Field                | Type     | Description                                                                 |
|----------------------|----------|-----------------------------------------------------------------------------|
| `_id`                | string   | Unique identifier for the entity.                                           |
| `token`              | string   | Authentication token for the entity.                                        |
| `member`             | object?  | Optional member details, including Shockwave account info.                  |
| `member.shockwave`   | object?  | Shockwave member details (if available).                                    |
| `member.shockwave.screen_name` | string | The user's display name on Shockwave.                                      |
| `member.shockwave.site_member_id` | number | The user's site member ID.                                               |
| `member.shockwave.source` | string | Source of the member account.                                              |
| `member.shockwave.shockwave_logged_in` | number | Indicates if the user is logged in to Shockwave.                      |
| `leaderboard_name`   | string   | Name of the leaderboard associated with the entity.                         |
| `leaderboards`       | string[] | List of leaderboard names the entity is associated with.                    |

## Usage

The `Entity` interface is used to represent the current user or player, including their authentication and leaderboard context.