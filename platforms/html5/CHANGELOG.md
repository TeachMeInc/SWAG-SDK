### Misc. New/Revised Methods

**toggleFullScreen**
  - Toggle the full-screen state of the website gameplayer

**navigateToArchive**
  - Navigate to the archive page for this game

**navigateToTitle**
  - Navigate to another game
  - Params:
    - slug: string

**showShareDialog**
  - Display the share game dialog on the website
  
**navigateToLogin**
  - Navigate to the login page

**userLogout**
  - Logs the user out

### Toolbar Management

The following methods are used to interact with the game player toolbar at the top of the game page.

**setToolbarItems**
  - Set toolbar state
  - Params:
    - items: ToolbarItem[]

**updateToolbarItem**
  - Add/update a single toolbar item
  - Params:
    - item: ToolbarItem

**removeToolbarItem**
  - Remove a toolbar item
  - Params:
    - id: string

**Example:**
```
interface ToolbarItem {
  id: string;
  label?: string;
  icon?: string;
  onClick?: () => void;
}

await api.setToolbarState([
  {
    id: 'myBtn',
    icon: 'faStar',
    onClick () { alert('hello!'); },
  }
]);

await api.updateToolbarItem({
  id: 'timer',
  label: timerValue,
});

await api.removeToolbarItem('myBtn');
```

#### Display an Advertisment

Note: this only supports video ads at the moment. A `video` type add will take-over the screen.

**showAd**
  - Display an advertisement
  - Params:
    - type: 'video', 
    - options: {} = {}

### Game Summary Screen

The summary screen is a losely styled HTML panel that is injected onto the page by the SWAG JS client. You can pass arbitrary key/value pairs to display end-game statistics, as well as inject abitrary HTML into the preview/summary UI. Doing it this way allows some customization by each individual game developer while still providing consistant layout and functionality.

**showSummaryScreen**
  - Display the game summary screen
  - Params:
    - stats: { key: string, value: string }[], 
    - resultHtml: string

**Example:**
```
api.showSummaryScreen(
  [
    { key: 'Foo', value: '0:00' },
    { key: 'Bar', value: '9:99' },
    { key: 'Baz', value: '123' },
  ], 
  '<div style="background:#ccc;height:150px">Summary UI</div>'
);
```