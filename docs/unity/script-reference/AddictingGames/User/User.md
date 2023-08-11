# User (Class)

- **Fields**:
  - `string id`: Unique identifier for the user.
  - `string memberName`: Name of the member.
  - `bool? isSubscriber`: Nullable boolean indicating if the user is a subscriber. `null` if unknown.
  - `[HideInInspector] string token`: Token associated with the user, hidden in the Unity Inspector.

- **Methods**:
  - **Login**:
    - **Parameters**:
      - `System.Action onSuccess`: Callback executed upon successful login.
      - `System.Action<string> onError`: Callback executed on error.
    - **Description**: Logs the user in either using a token (for WebGL builds) or as a guest.

  - **ShowLoginDialog**:
    - **Parameters**:
      - `System.Action onSuccess`: Callback executed upon successful display of the login dialog.
      - `System.Action<string> onCancelled`: Callback executed if the display of the login dialog is cancelled.
    - **Description**: Displays the login dialog to the user.

  - **IsSubscriber**:
    - **Parameters**:
      - `System.Action<bool> onSuccess`: Callback executed upon determining the subscription status.
      - `System.Action<string> onError`: Callback executed on error.
    - **Description**: Determines if the user is a subscriber.

  - **IsGuest**:
    - **Return Type**: `bool`
    - **Description**: Checks if the user is logged in as a guest.

  - **IsLoggedIn**:
    - **Return Type**: `bool`
    - **Description**: Checks if the user is logged in.

  - **SetData**:
    - **Parameters**:
      - `string key`: The key to set data for.
      - `string value`: The value associated with the key.
      - `System.Action onSuccess`: Callback executed upon successful data set.
      - `System.Action<string> onError`: Callback executed on error.
    - **Description**: Sets data for the logged-in user.

  - **GetData**:
    - **Parameters**:
      - `System.Action<List<UserData>> onSuccess`: Callback executed upon successful data retrieval.
      - `System.Action<string> onError`: Callback executed on error.
    - **Description**: Retrieves data for the logged-in user.
