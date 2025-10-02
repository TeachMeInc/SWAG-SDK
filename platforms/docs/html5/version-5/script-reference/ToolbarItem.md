# ToolbarItem (Interface)

The `ToolbarItem` interface describes an item in the SDK's toolbar, such as a button or toggle.

## Fields

| Field      | Type     | Description                                 |
|------------|----------|---------------------------------------------|
| `id`       | string   | Unique identifier for the toolbar item.      |
| `label`    | string?  | Optional label for the item.                 |
| `icon`     | string?  | Optional icon for the item.                  |
| `disabled` | boolean? | Whether the item is disabled.                |
| `toggled`  | boolean? | Whether the item is toggled on/off.          |
| `onClick`  | () => void? | Optional click handler for the item.      |

## Usage

Used to define and manage items in the SDK's toolbar.