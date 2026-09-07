# Player sizing and theme styling

In the block inspector, **Player size** provides optional maximum width and height
in whole CSS pixels. Empty fields use the available content width. The height limit
applies to the video area; the title, navigation and status appear outside it. Width
limits apply to the whole block. Wide and full alignment are available when the
theme supports them.

Choose 16:9, 4:3, 1:1 or **Custom**, using `width:height` (for example `9:16`). Custom
ratios between 1:4 and 4:1 are supported; each part permits up to four integer digits
and three decimal places. Width and height limits must be at most 10000 pixels.
Invalid dimensions are ignored, and invalid ratios fall back to 16:9. The inspector
reports invalid settings. Both PHP rendering and the editor validate saved values.

[YouTube requires an embedded viewport of at least 200 × 200 pixels](https://developers.google.com/youtube/iframe_api_reference#Requirements).
For ratio `r = width / height`, configured width must be at least
`ceil(200 × max(1, r))`, and configured height at least
`ceil(200 / min(1, r))`. For 16:9 this means 356px width and 200px height.
These are minimum configuration values, not fixed layout widths.

The rendered width is the smallest of the container width, maximum width and
`maximum height × ratio`. The video preserves the chosen ratio while retaining a
200px minimum height. On narrow screens the minimum height can therefore take
precedence over the ratio. A theme must provide at least 200px of content width
for YouTube's minimum viewport; the block does not force horizontal overflow in
narrower containers. Navigation groups wrap within the available space while
preserving reading and keyboard order. Long titles wrap as needed. If large text
makes the consent notice taller than the video area, that area scrolls locally.

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
| `--ytpp-button-background` | `#f0f0f0` | Navigation button background |
| `--ytpp-button-color` | `#1e1e1e` | Navigation button text/icon color |
| `--ytpp-button-border` | `1px solid #757575` | Navigation button border |
| `--ytpp-button-radius` | `2px` | Navigation button corner radius |
| `--ytpp-focus-outline` | `2px solid currentColor` | Frontend keyboard focus outline |

Custom CSS is trusted theme configuration and does not pass through the inspector's
validation. Use valid positive dimensions and preserve accessible contrast and
visible focus indicators. The editor preview is deliberately non-interactive.

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

## Verification

Run `npm run check` for validation, rendering, editor unit tests, lint and build.
For isolated Chromium layout tests:

```bash
npx playwright install chromium
npm run test:responsive
```

Docker must be available, Composer dependencies installed and Chromium's system
libraries present. The tests render the real PHP template and load the built CSS.
They cover 320px, 768px and 1440px viewports, portrait and landscape ratios,
independent and combined size limits, a 200px content column, consent markup and
replacement of the player target by a local iframe. No YouTube requests are made.
These are layout tests; they do not replace WordPress integration or real player
smoke tests.

Manual acceptance remains required in one classic theme and one block theme:

1. Insert a playlist block, try all presets and a custom ratio, set each size limit,
   save and reopen the editor. Check that the preview and frontend agree.
2. Check 320px, tablet and desktop widths, including a narrow column and long title.
3. Check the consent gate, load the real player and navigate all four directions.
4. Check empty, invalid and very small dimensions and the editor feedback.
5. Check wide/full alignment where offered and keyboard navigation after wrapping.
