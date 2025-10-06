# Score Configuration

Each type of score for your game can be configured individually. Expressed in JSON, a score configuration is in the following format:

```
{
  game: string,
  name: string,
  level_key: string,
  value_name: string,
  value_type: string,
  value_formatter: string,
  order: number,
  reverse: Boolean,
  mode: string
}
```
| attribute        | type        | description  |
| ---------------- | ----------- | ------------ |
| game             | string      | API key of your game |
| name             | string      | Display name for the score *e.g. 'Level 1'* |
| level_key        | string      | Reference key for this level *e.g. 'level1'* |
| value_name       | string?     | Name for the score values *e.g. 'Fastest Time'* |
| value_type       | string?     | The type of value (`number`, `time`) |
| value_formatter  | string?     | The type of formatter to use for this value (see Formatters) |
| order            | number?     | The display order of this level |
| reverse          | boolean?    | If true, minimum score values are used for API score calculations |
| mode             | string?     | Scores with mode of `first` will only display the first score for a day in the leaderboards |

These configurations are loaded into our highscore system to facilitate the specific needs of each type of score for your game.

## Formatters

Define a value_formatter in score configuration or as a parameter in api methods to format values.

### Number Formatters

No special number formatters are currently available.  Let us know if there is a format you'd like to see.

### Time Formatters

If using the time formatter you should submit your scores in milliseconds.

| formatter     | example output|
| ------------- | ------------- |
|default|00:01:05.5
|shortDuration|1m 5.5s
|longDuration|1 minute, 5.5 seconds
|seconds|65.5s
|ms|65500
