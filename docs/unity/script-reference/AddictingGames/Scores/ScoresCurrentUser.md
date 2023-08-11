# ScoresCurrentUser (Class)

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
