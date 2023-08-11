# Scores (Class)

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
