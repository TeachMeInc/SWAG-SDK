# AsyncHandler\<T\> (Class)

## Type Parameters

| Field                  | Description                                         |
|------------------------|-----------------------------------------------------|
| `T` | The type of object expected in the successful callback. |

## Fields

| Field                  | Description                                         |
|------------------------|-----------------------------------------------------|
| `System.Action<T> onSuccess` | Callback function to call upon success.     |
| `System.Action<string> onError` | Callback function to call upon error.      |

## Methods

### AsyncHandler (Constructor)

| Parameter            | Description                                              |
|----------------------|----------------------------------------------------------|
| `System.Action<T> onSuccess` | Callback function to set.                         |
| `System.Action<string> onError` | Callback function to set.                         |

### Reset

Resets the `onSuccess` and `onError` callbacks to null.

### Resolve

Invokes the `onSuccess` callback with the given result and resets the handlers.

| Parameter            | Description                                              |
|----------------------|----------------------------------------------------------|
| `T result`           | The result to pass to the `onSuccess` callback.           |

### Reject

Invokes the `onError` callback with the given error and resets the handlers.

| Parameter            | Description                                              |
|----------------------|----------------------------------------------------------|
| `string error`       | The error message to pass to the `onError` callback.      |

