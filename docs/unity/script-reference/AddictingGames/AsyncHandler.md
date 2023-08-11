# AsyncHandler (Class)

- **Type Parameters**:
  - `T`: The type of object expected in the successful callback.

- **Fields**:
  - `System.Action<T> onSuccess`: Callback function to call upon success.
  - `System.Action<string> onError`: Callback function to call upon error.

- **Methods**:
  - **AsyncHandler (constructor)**:
    - **Parameters**:
      - `System.Action<T> onSuccess`: Callback function to set.
      - `System.Action<string> onError`: Callback function to set.

  - **Reset**:
    - **Description**: Resets the `onSuccess` and `onError` callbacks to null.

  - **Resolve**:
    - **Parameters**:
      - `T result`: The result to pass to the `onSuccess` callback.
    - **Description**: Invokes the `onSuccess` callback with the given result and resets the handlers.

  - **Reject**:
    - **Parameters**:
      - `string error`: The error message to pass to the `onError` callback.
    - **Description**: Invokes the `onError` callback with the given error and resets the handlers.
