# Manual acceptance

These cases complement automation where real external services, human
perception or a packaged release must be assessed. Run the applicable cases for
the intended release and production context. Record actual results and open
items in the release audit, not in this reusable procedure.

<a id="man-001"></a>
## MAN-001 – Editor input, persistence and preview

**Requirements:** [FR-001](../requirements/product.md#fr-001),
[FR-002](../requirements/product.md#fr-002),
[FR-003](../requirements/product.md#fr-003),
[FR-004](../requirements/product.md#fr-004),
[FR-009](../requirements/product.md#fr-009),
[NFR-PRIV-008](../requirements/privacy.md#nfr-priv-008)

**Test objective:** Confirm that an editor can configure, persist and revise a
block without confusing syntax validation with remote availability.

**Prerequisites:** Use a valid playlist with at least three playable videos and
prepare invalid input. Open the block editor with browser network inspection.

**Procedure:** Insert the block, enter the playlist as both ID and supported URL,
set an optional title, save and reload, and exercise Undo/Redo. Repeat with empty
and invalid input. Start the availability check only after inspecting the idle
state.

**Expected result:** Valid input is stored canonically and survives reload and
Undo/Redo. The labelled preview and title reflect saved values. Empty or invalid
input produces a local translated message without player controls or an external
request. The availability check contacts YouTube only after explicit action.

<a id="man-002"></a>
## MAN-002 – Real playlist loading and navigation

**Requirements:** [FR-005](../requirements/product.md#fr-005),
[FR-006](../requirements/product.md#fr-006),
[FR-007](../requirements/product.md#fr-007),
[FR-008](../requirements/product.md#fr-008)

**Test objective:** Verify behavior that requires a real YouTube player rather
than an API double.

**Prerequisites:** Publish a page containing the valid multi-item playlist, a
one-item playlist and two independent player blocks.

**Procedure:** Grant loading, use first, previous, next and last, and reach every
boundary. Repeat with the one-item playlist and operate both blocks independently.

**Expected result:** The first item is selected without autoplay. Navigation cues
but does not start playback, the position is correct, and impossible actions are
disabled. A one-item playlist disables all navigation. Multiple blocks do not
change each other's position or player lifecycle.

<a id="man-003"></a>
## MAN-003 – Consent, storage and network boundary

**Requirements:** [NFR-PRIV-001](../requirements/privacy.md#nfr-priv-001),
[NFR-PRIV-002](../requirements/privacy.md#nfr-priv-002),
[NFR-PRIV-003](../requirements/privacy.md#nfr-priv-003),
[NFR-PRIV-004](../requirements/privacy.md#nfr-priv-004),
[NFR-PRIV-007](../requirements/privacy.md#nfr-priv-007)

**Test objective:** Confirm the observable privacy boundary with real browser
storage and network inspection.

**Prerequisites:** Clear site data and open a published player page with browser
network and storage tools.

**Procedure:** Inspect the page before consent, grant consent, reload, forget the
saved choice in the editor and repeat with unavailable storage if the browser
allows it.

**Expected result:** Before consent, no YouTube or Google player resource is
requested and only the local gate is shown. Granting loads a
`youtube-nocookie.com` iframe and stores only a playlist-scoped local choice.
Reload reuses that choice. Clearing it restores the gate. Unavailable storage
does not prevent a one-page grant. No plugin telemetry or server-side visitor
record is observed.

**Limitation:** Browser inspection cannot establish the absence of server-side
records. Review the plugin's persistence and outbound-request code separately
for NFR-PRIV-007 and record that evidence. If storage cannot be disabled, record
that variant as not executed.

<a id="man-004"></a>
## MAN-004 – Availability and recoverable failure

**Requirements:** [FR-004](../requirements/product.md#fr-004),
[FR-010](../requirements/product.md#fr-010),
[NFR-PRIV-008](../requirements/privacy.md#nfr-priv-008)

**Test objective:** Distinguish unavailable content from an inconclusive or
blocked request and verify recovery.

**Prerequisites:** Prepare an available playlist, an unavailable playlist and a
way to block `youtube.com/iframe_api`.

**Procedure:** Run the editor availability check for each outcome. On the public
page, block the API, grant loading, wait for the failure and then unblock and
retry.

**Expected result:** The editor reports available, unavailable and not clearly
determinable separately. A blocked request is not reported as invalid input. The
public player announces a local translated error and exposes a reachable retry
that succeeds after the block is removed.

<a id="man-005"></a>
## MAN-005 – External consent manager and revocation

**Requirements:** [NFR-PRIV-005](../requirements/privacy.md#nfr-priv-005),
[NFR-PRIV-006](../requirements/privacy.md#nfr-priv-006),
[NFR-A11Y-005](../requirements/accessibility.md#nfr-a11y-005)

**Test objective:** Verify the public integration contract with the site's actual
consent adapter.

**Prerequisites:** Configure the intended consent manager and at least two player
blocks. Follow the [integration contract](../integrations/consent.md).

**Procedure:** Veto before initialization, grant each block, revoke during both
pending and completed loading, and grant again.

Repeat the veto with a remembered local choice and the built-in gate disabled.
Include duplicate playlists when revoking service-wide permission. Verify the
actual manager's callbacks, persistence, page caching and cross-tab behavior.

**Expected result:** Veto prevents loading. Grants affect only matching blocks.
Revocation removes the affected iframe, disables its controls, clears its stored
choice and leaves focus at a usable target. A later grant creates one fresh
player without duplicate listeners; unrelated blocks remain usable.

<a id="man-006"></a>
## MAN-006 – Keyboard operation and focus

**Requirements:** [NFR-A11Y-001](../requirements/accessibility.md#nfr-a11y-001),
[NFR-A11Y-003](../requirements/accessibility.md#nfr-a11y-003),
[NFR-A11Y-005](../requirements/accessibility.md#nfr-a11y-005),
[NFR-A11Y-006](../requirements/accessibility.md#nfr-a11y-006)

**Test objective:** Confirm complete keyboard operation and logical focus through
state changes.

**Prerequisites:** Use a published multi-item playlist and the editor. Test with
Tab, Shift+Tab, Enter and Space only.

**Procedure:** Operate consent, retry and all navigation actions, cross both
navigation boundaries and leave the YouTube iframe and block. Move focus outside
the block while it is loading. In the editor, reach settings, consent reset and
availability check.

**Expected result:** Every plugin function is reachable and operable. Focus is
visible, follows logical DOM order and never becomes trapped. Disabled controls
are skipped appropriately. Loading completion does not steal focus. Preview and
availability-check iframes do not become Tab stops.

<a id="man-007"></a>
## MAN-007 – Screen-reader names and announcements

**Requirements:** [NFR-A11Y-002](../requirements/accessibility.md#nfr-a11y-002),
[NFR-A11Y-004](../requirements/accessibility.md#nfr-a11y-004),
[NFR-A11Y-008](../requirements/accessibility.md#nfr-a11y-008)

**Test objective:** Assess information that DOM assertions and Axe cannot prove
for a real assistive-technology user.

**Prerequisites:** Use Windows Narrator or NVDA with Edge. Align the browser and
WordPress language. Edge Read aloud is not a screen reader.

**Procedure:** Navigate the player region, consent, iframe, navigation, position,
boundary states, loading error and retry. Repeat a position change and ordinary
playback state change.

**Expected result:** Region, iframe and controls have concise translated names.
Current and total item counts provide sufficient context. Position and status
changes are announced once through polite output; errors use alert output without
duplicating ordinary status. Decorative content is ignored.

YouTube's internal iframe controls require their own browser and screen-reader
assessment because they are outside the plugin-owned DOM.

<a id="man-008"></a>
## MAN-008 – Responsive layout, theme and contrast

**Requirements:** [FR-011](../requirements/product.md#fr-011),
[FR-012](../requirements/product.md#fr-012),
[FR-013](../requirements/product.md#fr-013),
[FR-014](../requirements/product.md#fr-014),
[FR-015](../requirements/product.md#fr-015),
[NFR-A11Y-006](../requirements/accessibility.md#nfr-a11y-006),
[NFR-A11Y-007](../requirements/accessibility.md#nfr-a11y-007)

**Test objective:** Confirm usable presentation under real theme, zoom and
contrast conditions.

**Prerequisites:** Use narrow and desktop viewports, 200% browser zoom, light and
dark themes, and Windows contrast mode.

Include one classic theme and one block theme, a narrow content column, a long
title and a following paragraph for checking text wrapping.

**Procedure:** Exercise supported aspect ratios, configured maximum dimensions,
navigation controls, documented theme variables and every supported alignment.

Save and reopen the editor to compare preview and frontend. Try empty, invalid
and too-small dimensions and inspect validation feedback. Recheck keyboard
order after alignment changes and text wrapping.

**Expected result:** The player stays within its container and configured maxima
without horizontal clipping. Controls remain visible and ordered logically.
Alignment and text wrapping collapse safely on narrow screens. Default focus and
controls remain distinguishable; documented variables change presentation
without requiring markup or script replacement.

<a id="man-009"></a>
## MAN-009 – Localization

**Requirements:** [NFR-004](../requirements/quality.md#nfr-004)

**Test objective:** Confirm end-to-end locale switching beyond catalog checks.

**Prerequisites:** Make German and English available in WordPress and configure
an editorial playlist title.

**Procedure:** Switch the site language between German and English and inspect
the editor and public page, including errors and tooltips.

**Expected result:** Plugin-owned visible text follows the selected locale. The
editorially supplied playlist title remains unchanged.

<a id="man-010"></a>
## MAN-010 – Release package installation

**Requirements:** [NFR-007](../requirements/quality.md#nfr-007),
[NFR-008](../requirements/quality.md#nfr-008)

**Test objective:** Verify the actual release candidate rather than a source-tree
installation.

**Prerequisites:** Build the candidate ZIP and checksum and prepare a clean
WordPress site.

**Procedure:** Verify the checksum, install the ZIP through WordPress
administration, activate it and repeat the applicable functional smoke tests.

**Expected result:** The checksum matches, installation and activation succeed,
and the packaged plugin provides the accepted behavior without development-only
files or dependencies. License and plugin metadata are present and consistent.

Historical evidence for version 0.1.0 is in its
[release audit](../audits/releases/0.1.0.md).
