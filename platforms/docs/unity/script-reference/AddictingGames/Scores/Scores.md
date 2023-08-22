# Scores Class Documentation

Manages retrieving and displaying scores for a game.

## Fields

| Field                  | Description                                              |
|------------------------|----------------------------------------------------------|
| `ScoresCurrentUser currentUser` | Represents the current user's score-related operations. |

## Methods

### ShowDialog (Overloaded)

Displays the scores dialog.

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

### GetLevelKeys

Retrieves the keys for different game levels.

| Parameter              | Description                                                  |
|------------------------|--------------------------------------------------------------|
| `System.Action<List<LevelKey>> onSuccess` | Callback to execute upon successful retrieval of level keys. |
| `System.Action<string> onError` | Callback to execute in case of an error.                  |

### GetScores (Overloaded)

Retrieves scores for the specified level and period.

| Parameter              | Description                                                  |
|------------------------|--------------------------------------------------------------|
| `string levelKey`      | Key associated with the level.                                |
| `ScorePeriod period`   | Time period for which the scores are to be retrieved.         |
| `System.Action<List<Score>> onSuccess` | Callback to execute upon successful retrieval of scores. |
| `System.Action<string> onError` | Callback to execute in case of an error.                  |

| Parameter              | Description                                                  |
|------------------------|--------------------------------------------------------------|
| `string levelKey`      | Key associated with the level.                                |
| `ScorePeriod period`   | Time period for which the scores are to be retrieved.         |
| `string valueFormatter`| Formatter for the score value.                                |
| `System.Action<List<Score>> onSuccess` | Callback to execute upon successful retrieval of scores. |
| `System.Action<string> onError` | Callback to execute in case of an error.                  |
