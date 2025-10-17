# Game (Interface)

The `Game` interface describes the basic properties of a game registered on the SWAG platform.

## Fields

| Field              | Type     | Description                                 |
|--------------------|----------|---------------------------------------------|
| `name`             | string   | The name of the game.                       |
| `archive_background_color`        | string   | The primary color of the game (hex format). |
| `archive_icon`         | string   | URL to the game's icon image.               |
| `shockwave_keyword`| string   | Keyword used for Shockwave integration.     |

## Usage

The `Game` interface is used to retrieve and display game information in the SDK.