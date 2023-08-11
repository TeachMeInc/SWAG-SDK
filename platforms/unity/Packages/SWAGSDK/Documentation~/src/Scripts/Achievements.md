# AddictingGames Namespace Documentation

## Classes & Structures

### Achievement Struct

- **Fields**:
  - `string id`: The unique identifier for the achievement.
  - `string name`: The human-readable name of the achievement.
  - `string achievementKey`: The key representing the achievement.
  - `string description`: A brief description of the achievement.
  - `bool? userAchieved`: Nullable boolean indicating if the user has achieved this. `null` if unknown.

### AchievementsCurrentUser Class

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

### Achievements Class

- **Fields**:
  - `AchievementsCurrentUser currentUser`: Represents the currently logged-in user.

- **Methods**:
  - **ShowDialog (overloads)**:
    - **Description**: Shows the achievements dialog.
    - **Overloads**:
      - Without parameters.
      - With `System.Action onClosed` parameter.
      - With `System.Action<string> onError` parameter.
      - With both `System.Action onClosed` and `System.Action<string> onError` parameters.
  
  - **GetAll**:
    - **Parameters**:
      - `System.Action<List<Achievement>> onSuccess`: Callback to execute upon successful retrieval of all achievements.
      - `System.Action<string> onError`: Callback to execute in case of an error.
    - **Description**: Retrieves all achievements for the game.
