# Usage & Examples

## Connecting to the API

The SWAGAPI is available globally after including the SDK script. Initialize the API with your configuration options:

```js
const api = SWAGAPI.getInstance({
	apiKey: 'YOUR_API_KEY',
	gameTitle: 'My Game',
	debug: true,
	leaderboards: {
		dailyScoreLevelKey: 'level_1'
	},
	splashScreen: true,
	summaryScreen: true,
	toolbar: true,
	analytics: {
		gameId: 'my_game_id'
	}
});
```

Start a session before using other API methods:

```js
api.startSession().then(() => {
	// Session is ready, safe to use other methods
});
```

Or listen for the event:

```js
api.on('SESSION_READY', () => {
	// Session is ready
});
```

## API Options

| Option         | Type      | Description |
| -------------- | --------- | ----------- |
| apiKey         | string    | Unique identifier for your game |
| gameTitle      | string    | Displayed in UI screens |
| debug          | boolean   | Enable debug logging |
| leaderboards   | object    | Leaderboard config (see below) |
| splashScreen   | true/object | Enable splash screen UI |
| summaryScreen  | true/object | Enable summary screen UI |
| toolbar        | true/object | Enable toolbar UI |
| analytics      | object    | Analytics config |

## Toolbar

The toolbar provides navigation, branding, and quick actions. It is customizable via CSS variables and API options.

- Appears at the top of the game UI.
- Can display a title, icons, and custom items.
- Supports theme switching (light/dark).
- Use `setToolbarItems`, `updateToolbarItem`, and `removeToolbarItem` to manage items programmatically.

Example:

```js
api.setToolbarItems([
	{ id: 'button', icon: 'trophy', onClick: () => {} }
]);
```

A list of available toolbar icons can be found in the [Toolbar Icons](./toolbar-icons.md) guide.

Customize appearance using CSS variables (see [Customization Guide](./customization-css-variables.md)).

## Splash Screen

The splash screen is shown on game load and provides entry points to play, view archives, invite friends, and view scores.

- Displays game title and icon.
- "Play" button starts the game.
- "Archive" navigates to past games.
- "Play with Friends" opens the invite friends screen (room code leaderboards).
- "View Scores" opens the leaderboard screen.

Enable with:

```js
splashScreen: true
```

Or customize:

```js
splashScreen: {
	showOnLoad: true,
	isBeta: true
}
```

## Summary Screen

The summary screen appears after a game session ends, showing stats, share options, and social features.

- Displays game stats and achievements.
- "Share" button copies a share string to clipboard.
- "Challenge Your Friends" opens the leaderboard invite screen.
- "Replay" and "Add to Favorites" buttons for user actions.
- Upsell section for non-subscribers.

Show the summary screen:

```js
api.showSummaryScreen({
	stats: [{ key: 'Score', value: '123', lottie: {} }],
	contentHtml: '<p>Great job!</p>',
	shareString: 'MyGame 123pts',
	onReplay: () => { /* replay logic */ },
	onFavorite: () => { /* favorite logic */ }
});
```

## Leaderboards (Room Code / Play With Friends)

SWAG v5 supports frictionless, room code-based leaderboards for social play.

- Users can create or join leaderboard rooms using a code.
- "Invite Friends" generates a shareable URL and QR code.
- Leaderboard data is scoped to the room code.
- Users can leave or switch rooms at any time.

Workflow:

1. User clicks "Play with Friends" or "View Scores".
2. Invite screen shows a room code and share options.
3. Friends join using the code or link.
4. Leaderboard screen displays scores for the current room.
5. Users can leave or switch rooms.

Example to show invite friends screen:

```js
inviteFriendsScreenUi.show({
	roomCode: 'ABC123',
	onClickPlay: () => { /* start game */ }
});
```

Example to show leaderboard screen:

```js
leaderboardScreenUi.show({
	levelKey: 'level_1',
	initialRoomCode: 'ABC123'
});
```

## Analytics

The SDK supports basic analytics integration.

- Pass `analytics: { gameId: 'your_game_id' }` in options.
- Tracks session starts, game play, and other events.
- For advanced analytics, integrate with your own tracking in event handlers.

## UI Workflow

1. **Splash Screen**: Shown on load, user chooses to play, view archives, invite friends, or view scores.
2. **Toolbar**: Persistent at the top, provides navigation and branding.
3. **Game Session**: User plays the game.
4. **Summary Screen**: Shown after game ends, displays stats, sharing, and social options.
5. **Leaderboards**: Users can view scores, join/leave rooms, and invite friends for social competition.

## Example: Full Integration

```js
const api = SWAGAPI.getInstance({
	apiKey: 'YOUR_API_KEY',
	gameTitle: 'My Game',
	leaderboards: { dailyScoreLevelKey: 'level_1' },
	splashScreen: true,
	summaryScreen: true,
	toolbar: true,
	analytics: { gameId: 'my_game_id' }
});

api.startSession().then(() => {
	// Show splash screen, then start game
	// After game ends, show summary screen
	// Users can view leaderboards and invite friends
});
```

---
