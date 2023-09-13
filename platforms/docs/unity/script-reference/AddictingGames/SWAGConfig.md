# SWAGConfig (Class)

Main configuration class for the SDK.

## Fields

| Field                    | Description                                       |
|--------------------------|---------------------------------------------------|
| `static SWAGConfig Instance` | The singleton instance of the `SWAGConfig` class. |

### SDK Configuration

| Field                    | Description                                       |
|--------------------------|---------------------------------------------------|
| `Provider Provider`      | The provider being used, can be `AddictingGames` or `Shockwave`. |
| `string DefaultValueFormatter` | A string formatter for score values.       |
| `ViewMode ViewMode`      | The view mode to be used, can be `Responsive`, `ForcePortrait`, or `ForceLandscape`. |
| `bool PlayBrandingAnimation` | A boolean indicating whether to play the branding animation or not. |

### Shockwave Configuration

| Field                    | Description                                       |
|--------------------------|---------------------------------------------------|
| `string ShockwaveKeyword` | The keyword for the game. (optional)                      |
