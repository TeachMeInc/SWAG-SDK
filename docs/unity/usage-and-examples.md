# Usage & Examples

## Achievements

### Show the achievements dialog

**Example**
```c#
SWAG.Instance.Achievements.ShowDialog(
    // Dialog closed callback
    () => { Debug.Log("Dialog closed."); }
    // Error callback
    (string error) => { Debug.Log(error); }
);
```
<small>Source: [Achievements.cs](/unity/script-reference/AddictingGames/Achievements/Achievements)</small>

### Record an achievement

**Example**
```c#
var key = "my_achievement_key";

SWAG.Instance.Achievements.currentUser.RecordAchievement(
    key,
    // Success callback
    () => { Debug.Log("Achievement recorded."); }
    // Error callback
    (string error) => { Debug.Log(error); }
);
```
<small>Source: [AchievementsCurrentUser.cs](/unity/script-reference/AddictingGames/Achievements/AchievementsCurrentUser)</small>

## Leaderboards

### Show the scores dialog

**Example**
```c#
SWAG.Instance.Scores.ShowDialog(
    // Dialog closed callback
    () => { Debug.Log("Dialog closed."); }
    // Error callback
    (string error) => { Debug.Log(error); }
);
```
<small>Source: [Scores.cs](/unity/script-reference/AddictingGames/Scores/Scores)</small>

### Record a score

**Example**
```c#
var levelKey = "level_0";
var score = "10000";

SWAG.Instance.Scores.currentUser.RecordScore(
    levelKey,
    score,
    // Success callback
    () => { Debug.Log("Score recorded."); }
    // Error callback
    (string error) => { Debug.Log(error); }
);
```
<small>Source: [ScoresCurrentUser.cs](/unity/script-reference/AddictingGames/Scores/ScoresCurrentUser)</small>

## Ads

### Play an advertisement

**Example**
```c#
SWAG.Instance.BeginAd(
    // Ad finished playing callback
    () => { Debug.Log("Ad done."); }
    // Error callback
    (string error) => { Debug.Log(error); }
);
```
<small>Source: [SWAG.cs](/unity/script-reference/AddictingGames/SWAG)</small>

### Banner ads

TODO

## Provider features

### Show the share dialog

**Example**
```c#
SWAG.Instance.ShowShareDialog();
```
<small>Source: [SWAG.cs](/unity/script-reference/AddictingGames/SWAG)</small>

### Toggle fullscreen

**Example**
```c#
var isFullscreen = true;

SWAG.Instance.ToggleFullscreen(isFullscreen);
```
<small>Source: [SWAG.cs](/unity/script-reference/AddictingGames/SWAG)</small>

## User

### Show the login dialog

**Example**
```c#
SWAG.Instance.User.ShowLoginDialog(
    // Login success callback
    () => { Debug.Log("User logged in."); }
    // Dialog closed/login cancelled callback
    (string reason) => { Debug.Log(reason); }
);
```
<small>Source: [User.cs](/unity/script-reference/AddictingGames/User)</small>

### Get information about the current user

**Example**
```c#
var id = SWAG.Instance.User.id; // User's unique ID
var memberName = SWAG.Instance.User.memberName; // User's display name
var isGuest = SWAG.Instance.User.IsGuest(); // Logged in as guest or not
```
<small>Source: [User.cs](/unity/script-reference/AddictingGames/User)</small>

### Check if user is a subscriber

**Example**
```c#
SWAG.Instance.User.IsSubscriber(
    // Success callback
    (bool isSubscriber) => { Debug.Log(isSubscriber); }
    // Error callback
    (string error) => { Debug.Log(error); }
);
```
<small>Source: [User.cs](/unity/script-reference/AddictingGames/User)</small>

### Set and get data for the user

**Example**
```c#
// Set data
var key = "any_key";
var value = "any_value";

SWAG.Instance.User.SetData(
    key,
    value,
    // Success callback
    () => { Debug.Log("User data saved."); }
    // Error callback
    (string error) => { Debug.Log(error); }
);

// Get data
SWAG.Instance.User.GetData(
    key,
    // Success callback
    (List<UserData> data) => { Debug.Log("User data retrieved."); }
    // Error callback
    (string error) => { Debug.Log(error); }
);
```
<small>Source: [User.cs](/unity/script-reference/AddictingGames/User), [UserData.cs](/unity/script-reference/AddictingGames/User/UserData)</small>