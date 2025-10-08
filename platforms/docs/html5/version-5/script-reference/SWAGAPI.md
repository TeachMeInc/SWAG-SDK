# SWAGAPI (Class)

The `SWAGAPI` class is the main entry point for interacting with the SWAG HTML5 SDK. It provides methods for session management, game data retrieval, leaderboards, achievements, user data, UI controls, and event handling.

## Constructor

| Parameter         | Type           | Description                                 |
|-------------------|----------------|---------------------------------------------|
| `options`         | SWAGAPIOptions | Configuration options for the API instance. |

## Methods

| Method                          | Description                                                        |
|----------------------------------|--------------------------------------------------------------------|
| `startSession()`                 | Starts a new session. Returns a promise.                           |
| `toggleFullScreen()`             | Toggles fullscreen mode in the host application. Returns a promise with a message payload. |
| `navigateToArchive()`            | Navigates to the archive screen. Returns a promise with a message payload. |
| `navigateToTitle(keyword)`       | Navigates to the game title screen. Returns a promise with a message payload. |
| `getGame()`                      | Retrieves game information. Returns a promise with a `Game` object.|
| `startDailyGame(properties?)`| Starts a daily game challenge. Returns a promise.                 |
| `getCurrentDay()`                | Gets the current day for daily challenges. Returns a promise.      |
| `getGameProgress(month, year)`   | Retrieves daily game progress. Returns a promise with an array of `DailyGameProgress`. |
| `getGameStreak()`                | Retrieves the user's daily game streak. Returns a promise with a `DailyGameStreak`. |
| `hasPlayedDay(day)`              | Checks if the user has played on a given day. Returns a promise.   |
| `getScoreCategories()`           | Retrieves score categories. Returns a promise with an array of `GameModeData`. |
| `getDays(limit)`                 | Gets a list of days for daily challenges. Returns a promise.       |
| `getScores(options)`             | Retrieves leaderboard scores. Returns a promise with an array of `LeaderboardData`. |
| `postScore(levelKey, value, options)` | Posts a score to a leaderboard. Returns a promise.         |
| `hasDailyScore(levelKey)`        | Checks if a daily score exists. Returns a promise.                 |
| `getAchievementCategories()`     | Retrieves achievement categories. Returns a promise.               |
| `postAchievement(achievement_key)` | Posts an achievement. Returns a promise.                      |
| `getUserAchievements()`          | Retrieves user achievements. Returns a promise.                    |
| `getCurrentEntity()`             | Gets the current entity (user). Returns an `Entity` or null.       |
| `isSubscriber()`                 | Checks if the user is a subscriber. Returns a promise.             |
| `setUserData(key, value)`        | Sets user data. Returns a promise.                                 |
| `getUserData()`                  | Retrieves user data. Returns a promise.                            |
| `setLocalUserData(key, value)`   | Sets local user data.                                              |
| `getLocalUserData(key)`          | Gets local user data.                                              |
| `setToolbarItems(items)`         | Sets the toolbar items.                                            |
| `updateToolbarItem(item)`        | Updates a toolbar item.                                            |
| `removeToolbarItem(id)`          | Removes a toolbar item by ID.                                      |
| `showSplashScreen(options?)`     | Shows the splash screen. Returns a promise.                        |
| `showSummaryScreen(options)`     | Shows the summary screen. Returns a promise.                       |
| `showLoader(debounce?)`          | Shows a loading indicator after a delay. Returns a promise.                      |
| `hideLoader()`                   | Hides the loading indicator. Returns a promise.                    |
| `getPlatform()`                  | Gets the host platform type, either `embed` (for Shockwave.com), `app` (for the mobile app), or `standalone`.                          |
| `getPlatformTheme()`             | Gets the host platform theme (`light`/`dark`)            |
| `on(type, listener)`             | Subscribes to a global event.                                      |
| `off(type, listener)`            | Unsubscribes from a global event.                                  |

## Usage

Create an instance of `SWAGAPI` to access all SDK features for browser games.