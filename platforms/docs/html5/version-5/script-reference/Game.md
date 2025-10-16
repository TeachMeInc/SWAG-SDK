# Game (Interface)

The `Game` interface describes the basic properties of a game registered on the SWAG platform.

## Fields

| Field              | Type     | Description                                 |
|--------------------|----------|---------------------------------------------|
| `name`             | string   | The name of the game.                       |
| `hex_color`        | string   | The primary color of the game (hex format). |
| `icon_url`         | string   | URL to the game's icon image.               |
| `shockwave_keyword`| string   | Keyword used for Shockwave integration.     |
| `drupal_nid`       | number   | Drupal node ID associated with the game.    |
| `developer_id`     | string   | ID to bucket analytics events under.        |

## Usage

The `Game` interface is used to retrieve and display game information in the SDK.