# Layout architecture

For plugin developers. The public styling contract is in
[theme integration](../integrations/theming.md).

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
narrower containers. Navigation buttons are 3rem wide and 2rem high, with a default gap of 0.75rem.
Each pair stays together; only complete pairs can move to another line when
necessary. The position text uses 1rem. Reading and keyboard order are preserved. Long titles wrap as needed. If large text
makes the consent notice taller than the video area, that area scrolls locally.

For `center`, the block is centered without changing document or keyboard order.
`left` and `right` float the effective block width and leave the theme's block gap
for following text. Text wrapping is therefore visible only when the configured
maximum width leaves room beside the player. On narrow screens the plugin removes
the float and returns the block to the available content width, preventing
horizontal overflow. Themes remain free to override the standard WordPress
alignment classes.
