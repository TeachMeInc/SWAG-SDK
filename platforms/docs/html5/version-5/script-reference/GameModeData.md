# GameModeData (Interface)

The `GameModeData` interface describes a game mode or score category for a game.

## Fields

| Field        | Type     | Description                                         |
|--------------|----------|-----------------------------------------------------|
| `game`       | string   | The id of the game.                               |
| `name`       | string   | The name of the game mode or category.              |
| `level_key`  | string   | Key identifying the level or mode.                  |
| `value_type` | 'time' \| 'score' | Type of value tracked (time or score).         |
| `value_name` | string   | Name of the value tracked (e.g., "Points").        |
| `reverse`    | boolean  | If true, lower values are better (e.g., time).      |
| `order`      | number   | Order or ranking of the mode/category.              |

## Usage

Used to define and retrieve game modes and score categories for leaderboards.