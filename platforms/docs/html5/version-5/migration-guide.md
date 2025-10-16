# HTML5 SDK v4 → v5 Migration Guide

## 1. Initialization & API Options

**v4:**
- Use `SWAGAPI.getInstance({ wrapper, api_key, ... })`
- `wrapper` (DOM element) and `api_key` (string) are required.
- `theme` and `debug` are optional.

**v5:**
- Use `SWAGAPI.getInstance({ apiKey, ... })`
- `apiKey` replaces `api_key`.
- `wrapper` is no longer required.
- `theme` option is removed; use CSS variables for customization.
- New options: `gameTitle`, `leaderboards`, `splashScreen`, `summaryScreen`, `toolbar`, `analytics`, etc.
- More flexible configuration for UI features (toolbar, splash, summary screens).

**Example:**
```js
// v4
const api = SWAGAPI.getInstance({ 
  api_key: '...', 
  debug: true,
  theme: 'shockwave', 
  wrapper: document.getElementById('swag-wrapper'), 
});

// v5
const api = SWAGAPI.getInstance({
  apiKey: '...',
  debug: true,
  leaderboardScreen: true,
  splashScreen: true,
  toolbar: true,
});
```

## 2. Session Management

- Both versions require `startSession()` before using other API methods.
- You can still use `.then()` or listen for the `SESSION_READY` event.

## 3. UI & Toolbar

**v4:**
- Limited UI customization.
- `showDialog(type, options)` for scores, achievements, etc.
- Use `wrapperId` to specify where UI renders.

**v5:**
- Replaced `wrapperId` with `containerElementId` to specify where UI renders (applies to toolbar, splash, and summary screens).
- Toolbar is now a first-class feature:
  - Configure toolbar via `toolbar` option or programmatically with `setToolbarItems`, `updateToolbarItem`, `removeToolbarItem`.
  - Toolbar item states: toggled, disabled, etc.
  - Custom icons and labels supported.
  - See [Toolbar Icons](https://developers.shockwave.com/html5/version-5/toolbar-icons.html) for available icons.

## 4. Splash & Summary Screens

**v5 New Features:**
- Calling `completeDailyGame` is no longer required and has been combined into `showSummaryScreen`.
- Splash screen: Entry point for play, archives, leaderboards, and friends.
- Summary screen: Post-game stats, sharing, replay, favorites, and upsell for non-subscribers.
- Both can be enabled and customized via options.

## 5. Leaderboards

**v5 Enhancements:**
- Room code-based leaderboards for social play.
- Users can create/join rooms, invite friends, and view scoped leaderboards.
- Enable with `leaderboardScreen: true`.
- Submit scores via `showSummaryScreen({ score: ... })`.
- Custom level key support via `leaderboards: { dailyScoreLevelKey: '...' }`.

## 6. Analytics

**v5 New Feature:**
- Built-in analytics for session start/end and custom events.
- Pass custom event properties to `startDailyGame` and `showSummaryScreen`.
- Optionally set a custom `gameId` for analytics.

## 7. TypeScript & API Changes

- Many interfaces have been updated for clarity and new features.
- Some property names have changed (e.g., `api_key` → `apiKey`).
- Some methods have new signatures or additional options.
- The `Entity` interface now includes more detailed member and leaderboard information.

## 8. Deprecated/Removed

- `wrapper` option is no longer required.
- Legacy dialog types and UI methods have been replaced by new screens and toolbar features.

## 9. Migration Checklist

- [ ] Update API initialization to use new options and naming.
- [ ] Replace any usage of `api_key` with `apiKey`.
- [ ] Remove usage of `wrapper` and wrapper element.
- [ ] Replace any usage of `wrapperId` with `containerElementId`.
- [ ] Remove calls to `completeDailyGame` if used.
- [ ] Enable and configure toolbar, splash, and summary screens as needed.
- [ ] Update leaderboard integration to use new room code features if desired.
- [ ] Use new analytics features for custom event tracking.
- [ ] Update TypeScript types and interfaces to match v5.
- [ ] Review all method signatures for changes or new options.

See the [Usage and Examples](/html5/version-5/usage-and-examples.html) section for more information on how to implement these changes.

## 10. Summary of New Features in v5

- Configurable toolbar with icons, labels, and states.
- Splash and summary screens for improved UX.
- Social leaderboards with room codes and friend invites.
- Built-in analytics and event tracking.
- Improved TypeScript support and more robust typings.
- Easier configuration and more flexible API options.

## 11. Additional Resources

- [v5 Usage & Examples](https://developers.shockwave.com/html5/version-5/usage-and-examples.html)
- [v5 TypeScript Support](https://developers.shockwave.com/html5/version-5/typescript-support.html)
- [v5 API Reference](https://developers.shockwave.com/html5/version-5/script-reference/SWAGAPI.html)
- [Toolbar Icons](https://developers.shockwave.com/html5/version-5/toolbar-icons.html)
- [Customization](https://developers.shockwave.com/html5/version-5/customization-css-variables.html)
