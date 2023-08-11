# AchievementsCurrentUser (Class)

- **Methods**:
  - **RecordAchievement**:
    - **Parameters**:
      - `string key`: The key representing the achievement.
      - `System.Action onSuccess`: Callback to execute upon successful operation.
      - `System.Action<string> onError`: Callback to execute in case of an error.
    - **Description**: Records an achievement for the currently logged-in user.

  - **GetAchievements**:
    - **Parameters**:
      - `System.Action<List<Achievement>> onSuccess`: Callback to execute upon successful retrieval of achievements.
      - `System.Action<string> onError`: Callback to execute in case of an error.
    - **Description**: Retrieves the list of achievements for the currently logged-in user.
