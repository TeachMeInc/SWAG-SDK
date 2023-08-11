# SWAGConfig (Class)

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
