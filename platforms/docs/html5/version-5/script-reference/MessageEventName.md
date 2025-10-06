# MessageEventName (Type)

The `MessageEventName` type defines the possible event names for messages sent between the SDK and the host application.

## Values

| Value                          | Description                                      |
|-------------------------------|--------------------------------------------------|
| `noop`                        | No operation.                                    |
| `swag.toolbar.show`           | Show the toolbar.                                |
| `swag.toolbar.hide`           | Hide the toolbar.                                |
| `swag.toggleFullScreen`       | Toggle fullscreen mode.                          |
| `swag.navigateToArchive`      | Navigate to the archive screen.                  |
| `swag.navigateToTitle`        | Navigate to the game title screen.               |
| `swag.dailyGameProgress.start`| Start daily game progress.                       |
| `swag.dailyGameProgress.complete` | Complete daily game progress.               |

## Usage

Used to specify the type of event in message payloads for SDK-host communication.