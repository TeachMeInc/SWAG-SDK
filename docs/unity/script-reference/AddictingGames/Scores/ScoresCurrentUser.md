# ScoresCurrentUser (Class)

Represents the current user's score-related operations in the game.

## Methods

### RecordScore

Records the user's score for a particular game level.

| Parameter            | Description                                          |
|----------------------|------------------------------------------------------|
| `string levelKey`    | Key associated with the level for which the score is being recorded. |
| `string score`       | The score value to be recorded.                     |
| `System.Action onSuccess` | Callback to execute upon successful recording of the score. |
| `System.Action<string> onError` | Callback to execute in case of an error.    |

### GetDailyBest (Overloaded)

Retrieves the user's daily best score for a particular game level.

| Parameter            | Description                                          |
|----------------------|------------------------------------------------------|
| `string levelKey`    | Key associated with the level.                      |
| `System.Action<DailyBest> onSuccess` | Callback to execute upon successful retrieval of daily best score. |
| `System.Action<string> onError` | Callback to execute in case of an error.    |

| Parameter            | Description                                          |
|----------------------|------------------------------------------------------|
| `string levelKey`    | Key associated with the level.                      |
| `string valueFormatter` | Formatter for the score value.                   |
| `System.Action<DailyBest> onSuccess` | Callback to execute upon successful retrieval of daily best score. |
| `System.Action<string> onError` | Callback to execute in case of an error.    |

### GetScores (Overloaded)

Retrieves the user's scores for the specified level and period.

| Parameter            | Description                                          |
|----------------------|------------------------------------------------------|
| `string levelKey`    | Key associated with the level.                      |
| `ScorePeriod period` | Time period for which the scores are to be retrieved. |
| `System.Action<List<Score>> onSuccess` | Callback to execute upon successful retrieval of scores. |
| `System.Action<string> onError` | Callback to execute in case of an error.    |

| Parameter            | Description                                          |
|----------------------|------------------------------------------------------|
| `string levelKey`    | Key associated with the level.                      |
| `ScorePeriod period` | Time period for which the scores are to be retrieved. |
| `string valueFormatter` | Formatter for the score value.                   |
| `System.Action<List<Score>> onSuccess` | Callback to execute upon successful retrieval of scores. |
| `System.Action<string> onError` | Callback to execute in case of an error.    |
