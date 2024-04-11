# Achievements (Class)

Manages retrieving and displaying achievements for a game.

## Fields
| Field              | Description                                            |
|--------------------|--------------------------------------------------------|
| `AchievementsCurrentUser currentUser` | Represents the currently logged-in user. |

## Methods

### ShowDialog (Overloaded)

Displays the achievements dialog.

| Parameter              | Description                                                  |
|------------------------|--------------------------------------------------------------|
| --- | --- |

| Parameter              | Description                                                  |
|------------------------|--------------------------------------------------------------|
| `System.Action onClosed` | Callback to execute when the dialog is closed.              |

| Parameter              | Description                                                  |
|------------------------|--------------------------------------------------------------|
| `System.Action<string> onError` | Callback to execute in case of an error.                  |

| Parameter              | Description                                                  |
|------------------------|--------------------------------------------------------------|
| `System.Action onClosed` | Callback to execute when the dialog is closed.              |
| `System.Action<string> onError` | Callback to execute in case of an error.                  |

### GetAll

Retrieves all achievements for the game.

| Parameter             | Description                                           |
|-----------------------|-------------------------------------------------------|
| `System.Action<List<Achievement>> onSuccess` | Callback to execute upon successful retrieval of all achievements. |
| `System.Action<string> onError` | Callback to execute in case of an error.    |
