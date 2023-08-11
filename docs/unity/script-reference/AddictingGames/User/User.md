# User (Class)

## Fields

| Field                  | Description                                                    |
|------------------------|----------------------------------------------------------------|
| `string id`            | Unique identifier for the user.                                 |
| `string memberName`    | Name of the member.                                            |
| `bool? isSubscriber`   | Nullable boolean indicating if the user is a subscriber. `null` if unknown. |
| `[HideInInspector] string token` | Token associated with the user, hidden in the Unity Inspector. |

## Methods

### Login

Logs the user in either using a token (for WebGL builds) or as a guest.

| Parameter            | Description                                                    |
|----------------------|----------------------------------------------------------------|
| `System.Action onSuccess` | Callback executed upon successful login.                 |
| `System.Action<string> onError` | Callback executed on error.                         |

### ShowLoginDialog

Displays the login dialog to the user.

| Parameter            | Description                                                    |
|----------------------|----------------------------------------------------------------|
| `System.Action onSuccess` | Callback executed upon successful display of the login dialog. |
| `System.Action<string> onCancelled` | Callback executed if the display of the login dialog is cancelled. |

### IsSubscriber

Determines if the user is a subscriber. 

| Parameter            | Description                                                    |
|----------------------|----------------------------------------------------------------|
| `System.Action<bool> onSuccess` | Callback executed upon determining the subscription status. |
| `System.Action<string> onError` | Callback executed on error.                               |

### IsGuest

Checks if the user is logged in as a guest.

| Parameter            | Description                                                      |
|----------------------|----------------------------------------------------------------|
| **Return Type**                | `bool`                                           |

### IsLoggedIn

Checks if the user is logged in.

| Parameter            | Description                                                      |
|----------------------|----------------------------------------------------------------|
| **Return Type**                | `bool`                                           |

### SetData

Sets data for the logged-in user.

| Parameter            | Description                                                    |
|----------------------|----------------------------------------------------------------|
| `string key`         | The key to set data for.                                    |
| `string value`       | The value associated with the key.                         |
| `System.Action onSuccess` | Callback executed upon successful data set.             |
| `System.Action<string> onError` | Callback executed on error.                         |

### GetData

Retrieves data for the logged-in user.

| Parameter            | Description                                                    |
|----------------------|----------------------------------------------------------------|
| `System.Action<List<UserData>> onSuccess` | Callback executed upon successful data retrieval.     |
| `System.Action<string> onError` | Callback executed on error.                         |
