# GlobalEventType (Enum)

The `GlobalEventType` enum defines global event types that can be listened for in the SWAG HTML5 SDK.

## Values

| Value                          | Description                                      |
|-------------------------------|--------------------------------------------------|
| `API_COMMUNICATION_ERROR`      | Indicates an API communication error.            |
| `ERROR`                       | Indicates a general error.                       |
| `SESSION_READY`                | Indicates the session is ready.                  |
| `SPLASH_SCREEN_CLICK_PLAY`     | User clicked play on the splash screen.          |
| `TOOLBAR_CLICK_FULL_SCREEN`    | User clicked fullscreen in the toolbar.          |

## Usage

Used to subscribe to global events in the SDK using the `on` and `off` methods.