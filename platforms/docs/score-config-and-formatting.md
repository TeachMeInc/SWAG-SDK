# Score Configuration

Each type of score for your game can be configured individually. Expressed in JSON, a score configuration is in the following format:

```
{
  game: String,
  name: String,
  level_key: String,
  value_name: String,
  value_type: String,
  value_formatter: String,
  order: Number,
  reverse: Boolean,
  mode: String
}
```
| attribute     | required |default| type | description  |
| ------------- | ------------- | ----- | ------ | ------ |
|game|y|-|String|api key of your game
|name|y|-|String|Display name for the score *eg. 'Level 1'*
|level_key|y|-|String|reference key for this level *eg. 'level1'*
|value_name|n|-|String|Name for the score values *eg. 'Fastest Time'*
|value_type|n|"number"|String|The type of value (number, time)
|value_formatter|n|"default"|String|The type of formatter to use for this value (see Formatters)
|order|n|-|Number|The display order of this level
|reverse|n|false|Boolean|if true, minimum scores value are used for api score calculations
|mode|n|"default"|String| Scores with mode of `first` will only display the first score for a day in the leaderboards

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
