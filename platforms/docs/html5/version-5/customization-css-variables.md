# Customization

You can customize the look and feel of the SWAG HTML5 SDK by setting CSS variables. This allows you to match the SDK's appearance to your game's branding and style.

## How to Set CSS Variables

To override the default styles, add a `<style>` tag in the `<head>` of your `index.html` **before** the SWAG SDK script is loaded. This ensures your custom variables are applied when the SDK initializes.

```html
<head>
  <style>
    :root {
      --swag-l-toolbar-bg-color: #EADAB9;
      --swag-l-toolbar-font-color: #1f1f1f;
      --swag-l-toolbar-border-color: #313131;
      --swag-title-font-family: 'Roboto Slab', serif;
      --swag-toolbar-height: 63px;
      --swag-toolbar-title-font-size: 18px;
      --swag-toolbar-border-width: 1;
    }
  </style>
  <script type="text/javascript" src="https://swagapi.shockwave.com/v5/dist/swag-api.js"></script>
  <!-- ...other head content... -->
</head>
```

**Important:** The `<style>` tag with your custom variables must appear before the SDK script tag.

### How Theme Switching Works

The SDK provides separate CSS variables for light and dark themes. When the user switches themes, the SDK automatically updates the relevant variables to match the selected theme.

You can customize both light and dark theme variables by using the `--swag-l-` prefix for light theme variables and the `--swag-d-` prefix for dark theme variables.
For example, to set the toolbar background color for both themes:

```css
:root {
  --swag-l-toolbar-bg-color: #EADAB9; /* Light theme */
  --swag-d-toolbar-bg-color: #1f1f1f; /* Dark theme */
}
```

### List of Available CSS Variables

Below are the main CSS variables you can override to customize the SWAG HTML5 SDK. Use the `--swag-l-` prefix for light theme and `--swag-d-` for dark theme.

#### Toolbar

- `--swag-l-toolbar-bg-color` / `--swag-d-toolbar-bg-color`: Toolbar background color
- `--swag-l-toolbar-font-color` / `--swag-d-toolbar-font-color`: Toolbar text color
- `--swag-l-toolbar-border-color` / `--swag-d-toolbar-border-color`: Toolbar border color
- `--swag-toolbar-height`: Toolbar height (e.g., `63px`)
- `--swag-toolbar-title-font-size`: Toolbar title font size (e.g., `18px`)
- `--swag-toolbar-border-width`: Toolbar border width (e.g., `1px`)

#### Title

- `--swag-title-font-family`: Font family for the title

#### Accent

- `--swag-l-game-accent-color` / `--swag-d-game-accent-color`: Game accent color for each theme
- `--swag-game-accent-color`: Accent color that adapts to theme

#### Summary Screen

- `--swag-l-panel-bg-color` / `--swag-d-panel-bg-color`: Background color for summary screen panels
- `--swag-l-panel-font-color` / `--swag-d-panel-font-color`: Font color for summary screen panels

#### Miscellaneous

- `--swag-l-background-color` / `--swag-d-background-color`: Main background color
- `--swag-l-font-color` / `--swag-d-font-color`: Main font color

> **Tip:** For a complete and up-to-date list, refer to the SDK's `variables.scss` file or documentation.

### Accent Color Variables

These variables are injected onto the page when a session is started. You can use them to apply your game's accent color to other elements on the page.

- `--swag-l-game-accent-color`: The main accent color for your game.
- `--swag-game-accent-color`: Accent color that adapts to light and dark modes. 
