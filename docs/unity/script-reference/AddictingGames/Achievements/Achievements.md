# Achievements (Class)

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
