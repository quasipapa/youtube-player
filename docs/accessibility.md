# Accessibility and acceptance

The plugin's own controls use native buttons with real, visually hidden text
labels and visible keyboard focus. The video area contains the real text
**YouTube playlist player** and is also a named region. After it is ready, its
iframe is named **YouTube playlist player: Video 1 of n**. The visible position
remains `1 / n`, but that text is hidden from assistive technology and is paired
with the real screen-reader text **Video 1 of n**. The position is an atomic live
region, so a change is announced without moving focus. SVG icons are hidden from
assistive technology.

Status and error messages have separate, initially present `status` and `alert`
regions. Empty regions are visually clipped, not removed from the accessibility
tree. The video area alone is marked busy while loading, so status announcements
outside it are not delayed by `aria-busy`.

## Keyboard and focus

- Tab and Shift+Tab follow document order; Enter and Space activate buttons.
- On consent or retry, focus moves to a stable named player region while loading,
  then to the iframe when ready, only if the visitor has not moved focus elsewhere.
- At a playlist boundary, a focused navigation button that becomes disabled hands
  focus to the first remaining enabled navigation button. With no enabled button,
  focus stays at the named player region. Automatic playback updates do not move
  focus from elsewhere on the page.
- An API load failure, player error or timeout restores local markup and offers
  **Retry loading playlist**. Focus moves to retry only when the block held focus.
  API loading and player readiness each have a 15-second timeout.
- A consent-manager revocation removes the iframe. Focus returns to the local
  consent button, or to the named region if the local gate is disabled, only when
  focus was inside that block.
- The editor preview is non-interactive; its iframe is excluded from Tab order.
  The hidden availability-check iframe is also hidden from assistive technology.

The iframe's own playback controls are supplied by YouTube. The plugin does not
modify their internal DOM. Test entering and leaving the real iframe separately
with the intended browser and screen reader.

## Default contrast

The default button foreground `#1e1e1e` on `#f0f0f0` exceeds 4.5:1. The border
`#757575` on the same background exceeds 3:1. Consent text is white on black.
Error text `#b32d2e` has an explicit white background. Button focus has a dark
outline with a white surrounding ring, including on dark themes. Forced-colors
mode uses the system highlight color. Inactive controls remain visibly disabled.

Theme overrides must preserve contrast and focus visibility; see
[public styling properties](styling.md#public-css-custom-properties).
The reference criteria are [text contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html),
[non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html),
[visible focus](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html) and
[status messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html).

## Automated verification

```bash
npm run check
npm run test:accessibility
npm run test:responsive
```

The accessibility tests render the production PHP template and run the built
frontend script and CSS in Chromium. All YouTube requests are intercepted with
local doubles. They cover keyboard consent, all navigation actions, boundaries,
exit from the block, API failure and retry focus, external veto/grant/revoke,
multiple blocks, default contrast, dark backgrounds and forced colors. axe-core
checks the plugin-owned DOM against applicable WCAG A/AA rules; iframe contents
are excluded because they belong to YouTube. This is not a complete conformance
assessment or a substitute for listening with a screen reader.

See [browser prerequisites and the Docker alternative](development.md#browser-test-runtime).

## Manual acceptance for step 12

Use an existing post with two blocks and a playlist of at least three videos.
Test both German and English where messages changed. Use a real screen reader,
such as Windows Narrator or NVDA in Edge, rather than Edge's **Read aloud**
feature: Read aloud is intended for continuous page text and does not verify
interactive control semantics.

### Screen-reader setup in Edge

Do **not** use Edge's **Read aloud** command (including `Ctrl+Shift+U`) for this
test. It reads visible page text continuously; it does not test whether controls,
regions or live messages are exposed to assistive technology.

For Windows Narrator:

1. Start it with `Windows+Ctrl+Enter`; the same shortcut stops it again.
2. Open the public test page in Edge, then use `Tab` to reach interactive
   controls. In Scan mode, use `B` for the next button and `D` for the next
   landmark/region.
3. Keep the browser language aligned with the WordPress language being tested.

For NVDA:

1. Install NVDA from the [official NV Access download page](https://www.nvaccess.org/download/),
   then start **NVDA** from the Windows Start menu.
2. Keep Edge in the foreground and use `Tab` to reach controls. NVDA's default
   modifier key is `Insert` or `Caps Lock`; use the configured NVDA navigation
   commands to inspect regions and buttons.

Narrator and NVDA are independent Windows applications; neither is enabled in
Edge's settings. Microsoft documents `Windows+Ctrl+Enter` as Narrator's start
and stop shortcut in its [Narrator guide](https://support.microsoft.com/en-US/accessibility/windows/narrator/chapter-1-introducing-narrator).

1. Forget saved consent in the inspector and reload the public page. Use only
   Tab, Shift+Tab, Enter and Space. Check focus visibility on the consent button.
2. Load the playlist, navigate in all four directions and reach both boundaries.
   Check that focus remains usable when buttons become disabled. Tab out of the
   real YouTube iframe and out of the block; there must be no keyboard trap.
3. With a screen reader, verify the named **YouTube playlist player** region,
   iframe title and position **Video x of n**, translated button names and errors.
   Position should be announced once per change, not repeatedly when playback is
   paused or resumed.
4. Block `youtube.com/iframe_api`, start from fresh consent, and reload. Confirm
   a local error and reachable retry button. If the request remains pending,
   the error appears after 15 seconds. Unblock it and retry successfully.
5. Move focus outside the block during loading; readiness or failure must not
   steal it back. Repeat with two independent players.
6. Check a narrow viewport, 200% browser zoom, a dark theme and Windows contrast
   mode. Consent, retry and navigation must remain readable and reachable.
7. In the editor, reach playlist settings, availability check and consent reset
   by keyboard. The hidden checker must never become a Tab stop.
8. Follow the [consent integration checks](privacy.md#integration-verification).
   Before production, assess the site's privacy text and consent-manager setup
   with the responsible specialist.

Automated verification is recorded in the implementation plan. The user's manual
keyboard/screen-reader acceptance and site-specific privacy review remain open
until explicitly confirmed.
