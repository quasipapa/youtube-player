# Theme integration

For theme developers. Editorial size and alignment settings are described in
[appearance](../user/appearance.md). Internal layout calculations are described
in [layout architecture](../architecture/layout.md).

## Public CSS custom properties

Set these on `.ytpp-player` for frontend styling and `.ytpp-player-editor` for the
editor preview. Explicit valid inspector dimensions override theme CSS defaults.

| Property | Default | Meaning |
| --- | --- | --- |
| `--ytpp-max-width` | `100%` | Maximum block width (a CSS length or percentage) |
| `--ytpp-max-height` | Effectively unlimited | Maximum video height (a CSS length, not a percentage) |
| `--ytpp-aspect-ratio` | `1.7777777778` | Numeric width divided by height, e.g. `1.3333333333` for 4:3 |
| `--ytpp-controls-gap` | `0.75rem` | Navigation spacing |
| `--ytpp-navigation-skip-icon-size` | `1rem` | First/last icons |
| `--ytpp-navigation-step-icon-size` | `1rem` | Previous/next icons |
| `--ytpp-button-background` | `#f0f0f0` | Navigation, consent and retry button background |
| `--ytpp-button-color` | `#1e1e1e` | Button text/icon color |
| `--ytpp-button-border` | `1px solid #757575` | Button border |
| `--ytpp-button-radius` | `2px` | Button corner radius |
| `--ytpp-focus-outline` | `2px solid #1e1e1e` | Frontend button focus outline, with a white surrounding ring |

Custom CSS is trusted theme configuration and does not pass through the inspector's
validation. Use valid positive dimensions and preserve accessible contrast and
visible focus indicators. The editor preview is deliberately non-interactive.
The consent and retry buttons use content-based dimensions. The accepted `3rem`
by `2rem` navigation layout is unchanged. See the
[accessibility requirements](../requirements/accessibility.md)
for focus transitions, contrast and forced-colors behavior.

## Classic themes

Include matching styles in the frontend stylesheet and the theme's editor styles:

```css
.ytpp-player,
.ytpp-player-editor {
    --ytpp-max-width: 800px;
    --ytpp-controls-gap: 0.5rem;
    --ytpp-button-background: #fff;
    --ytpp-button-color: #222;
    --ytpp-button-radius: 4px;
}
```

## Block themes

A block theme can expose its chosen dimensions through `theme.json` custom tokens:

```json
{
    "version": 2,
    "settings": {
        "custom": {
            "ytpp": {
                "maxWidth": "800px"
            }
        }
    }
}
```

Use the generated token in the theme stylesheet and editor stylesheet:

```css
.ytpp-player,
.ytpp-player-editor {
    --ytpp-max-width: var(--wp--custom--ytpp--max-width, 100%);
}
```


Verification: [responsive suite](../testing/automated.md) and
[MAN-008](../testing/manual-acceptance.md#man-008).
