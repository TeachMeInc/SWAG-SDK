# Usage & Examples

## Connecting to the API

The SWAGAPI is available globally after including the SDK script. Initialize the API with your configuration options:

```js
const api = SWAGAPI.getInstance({
	apiKey: 'YOUR_API_KEY',
	debug: true,
	leaderboardScreen: true,
	splashScreen: true,
	toolbar: true,
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
	// Session is ready, safe to use other methods
});
```

## API Options

| Option         | Type      | Description |
| -------------- | --------- | ----------- |
| apiKey         | string    | SWAG API key |
| gameTitle      | string?   | Custom game title |
| debug          | boolean?  | Enable debug logging |
| leaderboards   | object?   | Leaderboard configuration |
| splashScreen   | true/object | Enable splash screen |
| summaryScreen  | true/object | Enable summary screen |
| toolbar        | true/object | Enable toolbar |
| analytics      | object?     | Analytics config |

A full list of API options can be found on the [SWAGAPIOptions](./script-reference/SWAGAPIOptions.md) reference page.

## Toolbar

The toolbar displays the current puzzle date, game title, and branding. It also includes a customizable section where developers can add icons and text. Developers can configure the toolbar by passing a `toolbar` options object (see [SWAGAPIOptions](./script-reference/SWAGAPIOptions.md)) in the SDK configuration and further customize its appearance using CSS variables (see [Customization](./customization-css-variables.md)).

- Appears at the top of the game UI.
- Can display the date, title, icons, and custom items.
- Use `setToolbarItems`, `updateToolbarItem`, and `removeToolbarItem` to manage items programmatically.

Enable with:

```js
toolbar: true
```

Or customize:

```js
toolbar: {
	containerElementId: 'CUSTOM_CONTAINER_ID',
	initialToolbarState: { ... },
	titleIcon: '/path/to/light-icon.png',
	titleIconDark: '/path/to/dark-icon.png',
}
```

### Toolbar Item State

Toolbar items can have the following states:

- **Default**: Normal state, fully interactive.
- **Toggled**: Indicates an active state, often used for buttons that can be switched on/off.
- **Disabled**: Non-interactive state, visually indicated as inactive.

See the [Toolbar Item State](./script-reference/ToolbarItem.md) page for more details.

Example:

```js
api.setToolbarItems([
	{ id: 'item_hint', icon: 'magGlass', onClick: () => {} },
	{ id: 'item_help', icon: 'question', toggled: true },
	{ id: 'item_timer', icon: 'stopwatch', label: '0:00' },
]);

api.updateToolbarItem(
	{ id: 'item_timer', label: currentTime }
);

api.removeToolbarItem('item_timer');
```

You can also set toolbar items when initializing the API:

```js
const api = SWAGAPI.getInstance({
	...
	toolbar: {
		initialToolbarState: {
			items: [
				{ id: 'item_hint', icon: 'magGlass', onClick: () => {} },
				{ id: 'item_help', icon: 'question', toggled: true },
				{ id: 'item_timer', icon: 'stopwatch', label: '0:00' },
			]
		}
	},
});
```

### Toolbar Icons

A list of available toolbar icons can be found in the [Toolbar Icons](./toolbar-icons.md) guide.

## Splash Screen

The splash screen is shown on game load and provides entry points to play the game, view the archives, and manage leaderboards.

- Displays game title and icon.
- "Play" button dismisses the splash screen.
- "Archive" signals the host to navigate to past games.
- "Play with Friends" opens the invite friends screen.
- "View Scores" opens the view leaderboard screen.

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

### Play Clicked Event

To handle when the user clicks "Play", listen for the `SPLASH_SCREEN_CLICK_PLAY` event:

```js
api.on('SPLASH_SCREEN_CLICK_PLAY', () => {
	// User clicked "Play"
});
```

Or manually show the splash screen:

```js
const api = SWAGAPI.getInstance({
	...
	splashScreen: {
		showOnLoad: false,
	},
});

await api.startSession();

api.showSplashScreen({
	onClickPlay: () => {
		// User clicked "Play"
	}
});
```

## Summary Screen

The summary screen appears after a game session ends, showing stats, share options, and social features. The summary screen method is also used to submit daily scores to leaderboards and track game completion analytics.

- Displays game stats.
- "Share" button copies a share string to clipboard.
- "Challenge Your Friends" opens the leaderboard invite screen.
- "Replay" and "Add to Favorites" buttons for user actions.
- Upsell section for non-subscribers.

Show the summary screen:

```js
api.showSummaryScreen({
	stats: [{ key: 'Score', value: '123', lottie: {} }],
	contentHtml: '<p>Great job!</p>', // content to display in summary screen results
	shareString: 'Share this game with your friends!',
	eventProperties: { foo: 'bar' }, // analytics properties
	score: 1234, // daily leaderboard score
	onReplay: () => {},
	onFavorite: () => {},
	onClose: () => {},
});
```

Customize:

```js
summaryScreen: {
	containerElementId: 'CUSTOM_CONTAINER_ID',;
},
```

## Leaderboards

SWAG v5 supports frictionless, room code-based leaderboards for social play. When enabled, buttons to view leaderboards and invite friends are added to the splash and summary screens.

- Users can create or join leaderboard rooms using a code.
- "Invite Friends" generates a shareable URL and QR code.
- Leaderboard data is scoped to the room code.
- Users can leave or switch rooms at any time.

Enable with:

```js
leaderboardScreen: true
```

Submit scores with:

```js
api.showSummaryScreen({ 
	...
	score: 1000,
});
```

### Level Key

By default, leaderboards post scores to the `daily` level key. To change which level key is used, pass a custom key in the options:

```js
leaderboards: {
	dailyScoreLevelKey: 'time'
}
```

## Analytics

The SDK supports basic analytics integration, tracking when a game session starts and is finished. To add custom data to start and finish events, pass in an event properties object to `startDailyGame` and `showSummaryScreen`:

```js
api.startDailyGame({ 
	todays_letters: 'abcdef' 
});

api.showSummaryScreen({ 
	...
	eventProperties: {
		time_played: 120, 
		todays_letters: 'abcdef' 
	}
});
```

By default, game events are tracked under your game's keyword. To track events under a different game, pass in a `gameId` in the `analytics` options:

```js
analytics: { gameId: 'your_game_id' }
```
