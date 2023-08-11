# AchievementsCurrentUser (Class)

Manages retrieving and recording achievements for the currently logged-in user.

## Methods

### RecordAchievement

Records an achievement for the currently logged-in user.

| Parameter            | Description                                          |
|----------------------|------------------------------------------------------|
| `string key`         | The key representing the achievement.                |
| `System.Action onSuccess` | Callback to execute upon successful operation.   |
| `System.Action<string> onError` | Callback to execute in case of an error.    |

### GetAchievements

Retrieves the list of achievements for the currently logged-in user.

| Parameter            | Description                                          |
|----------------------|------------------------------------------------------|
| `System.Action<List<Achievement>> onSuccess` | Callback to execute upon successful retrieval of achievements. |
| `System.Action<string> onError` | Callback to execute in case of an error.    |
