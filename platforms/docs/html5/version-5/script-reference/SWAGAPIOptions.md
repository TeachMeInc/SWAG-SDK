# SWAGAPIOptions (Interface)

The `SWAGAPIOptions` interface defines configuration options for initializing the SWAG API in HTML5 games.

## Fields

| Field              | Type      | Description                                         |
|--------------------|-----------|-----------------------------------------------------|
| `apiKey`           | string    | API key for authentication.                         |
| `debug`            | boolean?  | Enable debug mode.                                  |
| `gameTitle`        | string?   | Title of the game.                                  |
| `analytics`        | object?   | Analytics configuration.                            |
| `analytics.gameId` | string?   | Game ID for analytics.                              |
| `leaderboards`     | object?   | Leaderboard configuration.                          |
| `leaderboards.dailyScoreLevelKey` | string? | Level key for daily scores.                  |
| `leaderboardScreen`| true \| object? | Enable or configure leaderboard screen.         |
| `splashScreen`     | true \| object? | Enable or configure splash screen.              |
| `splashScreen.showOnLoad` | boolean? | Show splash screen on load.                   |
| `splashScreen.containerElementId` | string? | Container element ID for splash screen.      |
| `splashScreen.isBeta` | boolean? | Mark splash screen as beta.                     |
| `summaryScreen`    | object?   | Summary screen configuration.                       |
| `summaryScreen.containerElementId` | string? | Container element ID for summary screen.    |
| `toolbar`          | true \| object? | Enable or configure toolbar.                   |
| `toolbar.containerElementId` | string? | Container element ID for toolbar.             |
| `toolbar.initialToolbarState` | ToolbarState? | Initial state of the toolbar.              |
| `toolbar.titleIcon` | string? | Icon for the toolbar title.                        |
| `toolbar.titleIconDark` | string? | Dark mode icon for the toolbar title.         |

## Usage

Used to configure the SWAG API when initializing in a browser game.