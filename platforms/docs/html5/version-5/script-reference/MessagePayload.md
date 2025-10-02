# MessagePayload (Interface)

The `MessagePayload` interface represents a message sent between the SDK and the host application, typically for UI or navigation events.

## Fields

| Field      | Type     | Description                                 |
|------------|----------|---------------------------------------------|
| `eventName`| MessageEventName | The name of the event being sent.         |
| `message`  | string   | The message content.                        |

## Usage

Used for communication between the SDK and the host application, such as toolbar or navigation events.