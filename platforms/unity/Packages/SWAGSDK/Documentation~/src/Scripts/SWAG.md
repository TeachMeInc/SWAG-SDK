# AddictingGames Namespace Documentation

## Classes & Structures

### AsyncHandler Class

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

### JsonListHelper Class

- **Methods**:
  - **FromJson**:
    - **Parameters**:
      - `string json`: JSON string containing a list of items.
    - **Returns**: `List<T>`
    - **Description**: Converts a JSON string into a list of type `T`.

### NotificationType Enum

- **Values**:
  - `None`
  - `Success`
  - `Error`
  - `Warning`

### SWAG Class

- **Fields**:
  - `Achievements Achievements`: An instance of the Achievements class.
  - `Scores Scores`: An instance of the Scores class.
  - `User User`: An instance of the User class.
  - `bool isReady`: Boolean indicating if the SWAG is ready.

- **Methods**:
  - **OnReady (overloads)**:
    - **Description**: Handles the readiness of the SWAG.
    - **Overloads**:
      - With `System.Action onSuccess` parameter.
      - With both `System.Action onSuccess` and `System.Action<string> onError` parameters.

  - **GetRequest**:
    - **Parameters**:
      - `string url`: The URL for the GET request.
      - `bool useToken`: Flag to determine if a token should be used.
      - `System.Action<string> onSuccess`: Callback to execute upon successful GET request.
      - `System.Action<string> onError`: Callback to execute in case of an error.
    - **Description**: Makes a GET request to the specified URL.

  - **PostRequest**:
    - **Parameters**:
      - `string url`: The URL for the POST request.
      - `string postData`: Data to be posted.
      - `bool useToken`: Flag to determine if a token should be used.
      - `System.Action<string> onSuccess`: Callback to execute upon successful POST request.
      - `System.Action<string> onError`: Callback to execute in case of an error.
    - **Description**: Makes a POST request to the specified URL.

  - **OpenURL**:
    - **Parameters**:
      - `string url`: The URL to be opened.
    - **Description**: Opens the specified URL in the browser. Implementation varies based on platform.

  - **ToggleFullscreen**:
    - **Parameters**:
      - `bool fullscreen`: Boolean to determine if fullscreen mode should be enabled or disabled.
    - **Description**: Toggles fullscreen mode. Implementation varies based on platform.

  - **ShowShareDialog**:
    - **Description**: Shows the share dialog. Implementation varies based on platform.

  - **ShowAd**:
    - **Parameters**:
      - `System.Action onSuccess`: Callback to execute upon successful ad display.
      - `System.Action<string> onError`: Callback to execute in case of an error.
    - **Description**: Displays an advertisement. Implementation varies based on platform.
