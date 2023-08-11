# AddictingGames Namespace Documentation

## Classes & Structures

### Provider Enum

Represents the different supported providers.

- **Values**:
  - `AddictingGames`: Represents the AddictingGames provider.
  - `Shockwave`: Represents the Shockwave provider.

### ViewMode Enum

Specifies how the view mode should be treated.

- **Values**:
  - `Responsive`: The view will adapt based on the device's orientation.
  - `ForcePortrait`: The view will always be displayed in portrait mode.
  - `ForceLandscape`: The view will always be displayed in landscape mode.

### SWAGConfig Class

Main configuration class for the SDK.

- **Fields**:

  - **Singleton**:
    - `static SWAGConfig Instance`: The singleton instance of the `SWAGConfig` class.

  - **SDK Configuration**:
    - `Provider Provider`: The provider being used, can be `AddictingGames` or `Shockwave`.
    - `string DefaultValueFormatter`: A string formatter for score values. 
    - `ViewMode ViewMode`: The view mode to be used, can be `Responsive`, `ForcePortrait`, or `ForceLandscape`.
    - `bool PlayBrandingAnimation`: A boolean indicating whether to play the branding animation or not.

  - **Addicting Games Configuration**:
    - `string GameName`: The name of the game.
    - `string APIKey`: The API key for the game.

  - **Shockwave Configuration**:
    - `string ShockwaveKeyword`: The keyword for the game.
