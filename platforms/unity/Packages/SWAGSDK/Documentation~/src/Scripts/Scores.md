# AddictingGames Namespace Documentation

## Classes & Structures

### Score Struct

- **Fields**:
  - `string value`: The value of the score.
  - `System.DateTime date`: The date when the score was recorded.
  - `string memberName`: The name of the member who achieved the score.
  - `string memberAvatarUrl`: The URL to the member's avatar.
  - `int position`: The rank or position of the score.

### LevelKey Struct

- **Fields**:
  - `string key`: The key of the level.
  - `string displayName`: The display name for the level.
  - `string valueLabel`: The label for the value of the level.
  - `string valueType`: The type of value associated with the level (e.g., int, float, string).
  - `int dropdownOrder`: The order in which the level should appear in dropdown lists.
  - `bool isReversed`: Indicates if the scores for this level should be ordered in reverse.

### DailyBest Struct

- **Fields**:
  - `string dailyBest`: The best score achieved on a particular day.
  - `int position`: The rank or position of the daily best score.
  - `int totalScores`: The total number of scores submitted on that day.

### ScorePeriod Enum

- **Values**:
  - `Daily`: Represents daily scores.
  - `Weekly`: Represents weekly scores.
  - `AllTime`: Represents all-time scores.

### ScoresCurrentUser Class

- **Methods**:
  - **RecordScore**:
    - **Parameters**:
      - `string levelKey`: The key of the level.
      - `string score`: The score to record.
      - `System.Action onSuccess`: Callback to execute upon successful recording of the score.
      - `System.Action<string> onError`: Callback to execute in case of an error.
    - **Description**: Records a score for the given level key.

  - **GetDailyBest (overloads)**:
    - **Description**: Retrieves the daily best score for the specified level.
    - **Overloads**:
      - With `string levelKey`, `System.Action<DailyBest> onSuccess`, and `System.Action<string> onError` parameters.
      - With `string levelKey`, `string valueFormatter`, `System.Action<DailyBest> onSuccess`, and `System.Action<string> onError` parameters.

  - **GetScores (overloads)**:
    - **Description**: Retrieves the scores for the specified level and period.
    - **Overloads**:
      - With `string levelKey`, `ScorePeriod period`, `System.Action<List<Score>> onSuccess`, and `System.Action<string> onError` parameters.
      - With `string levelKey`, `ScorePeriod period`, `string valueFormatter`, `System.Action<List<Score>> onSuccess`, and `System.Action<string> onError` parameters.

### Scores Class

- **Fields**:
  - `ScoresCurrentUser currentUser`: Represents the currently logged-in user.

- **Methods**:
  - **ShowDialog (overloads)**:
    - **Description**: Displays the scores dialog.
    - **Overloads**:
      - Without parameters.
      - With `System.Action onClosed` parameter.
      - With `System.Action<string> onError` parameter.
      - With both `System.Action onClosed` and `System.Action<string> onError` parameters.

  - **GetLevelKeys**:
    - **Parameters**:
      - `System.Action<List<LevelKey>> onSuccess`: Callback to execute upon successful retrieval of level keys.
      - `System.Action<string> onError`: Callback to execute in case of an error.
    - **Description**: Retrieves the keys for all the levels.
    
  - **GetScores (overloads)**:
    - **Description**: Retrieves the scores for the specified level and period.
    - **Overloads**:
      - With `string levelKey`, `ScorePeriod period`, `System.Action<List<Score>> onSuccess`, and `System.Action<string> onError` parameters.
      - With `string levelKey`, `ScorePeriod period`, `string valueFormatter`, `System.Action<List<Score>> onSuccess`, and `System.Action<string> onError` parameters.
