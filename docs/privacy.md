# Privacy behavior

## Default visitor behavior

The block renders a local consent message and button by default. Before the
visitor selects **Load YouTube playlist**, the block HTML contains no YouTube
script, iframe, thumbnail or other external resource URL. The frontend script
itself is served by WordPress from the plugin.

After that deliberate action, the plugin loads:

- `https://www.youtube.com/iframe_api` to obtain YouTube's supported JavaScript
  player API;
- a video-player iframe using the explicit player host
  `https://www.youtube-nocookie.com`.

The player receives the playlist ID, starts at index `0`, and has autoplay
disabled. Loading these resources establishes a connection to Google/YouTube and
can transfer technical connection data. The `youtube-nocookie.com` host does not
eliminate every external data transfer.

The plugin does not add analytics or telemetry or record visitor identities.
After a local consent-button activation it stores the value `1` under
`ytpp-consent-v1:<canonical-playlist-id>` in the browser's `localStorage`.
This allows the same playlist to load after a refresh without asking again. The
choice applies only to that playlist, site origin and browser. It has no automatic
expiry. It records a preference, not a server-side consent audit log. An editor can select **Forget
saved consent for this playlist** in the block inspector to remove only that
playlist's choice and test the consent gate again. Visitors can clear the site's
browser data. If storage is unavailable, loading still works, but the choice
lasts only for the current page.

The local choice does not control other plugins or YouTube players on the site.
A consent manager can veto even a previously remembered choice. Grants made by
an external manager do not create a second persistent choice in this plugin.

## External consent and content blockers

The block setting **Require consent before loading YouTube** is enabled by
default. It can be disabled for an individual block when a separate consent
management system or content blocker, such as
[Borlabs Cookie](https://de.borlabs.io/borlabs-cookie/), reliably prevents all
YouTube resources from loading until the required permission exists.

With the setting disabled, the plugin requests the IFrame API as soon as the
frontend initializes. The site operator is then responsible for configuring and
testing the external blocker. Disabling the built-in gate alone does not provide
consent protection.

## Integration API

### WordPress filter

`ytpp_require_consent( bool $required, ?string $playlist_id, array $attributes )`
filters the rendered frontend gate. The ID is canonical, or null for invalid
input. Only boolean `false` disables the gate; null, zero and strings keep it on.
It does not alter saved block attributes or the editor preview. For example, a
site-wide adapter can take over the local gate:

```php
add_filter( 'ytpp_require_consent', '__return_false' );
```

Use this only together with a working blocker or the pre-load veto below. Because
HTML may be cached, use JavaScript for each visitor's actual permission, not a
visitor-specific PHP response cached for everyone.

### JavaScript events

Events operate on one `.ytpp-player` wrapper. Notifications bubble and provide
`detail.playlistId` and `detail.source`; command events must be dispatched on the
wrapper itself. Register the pre-load listener **before** the frontend script
initializes, including when stored consent is present.

| Event | Direction | Behavior |
| --- | --- | --- |
| `ytpp:before-load` | Plugin → adapter | Cancelable, synchronous. `preventDefault()` stops both API loading and iframe creation, even when the shared API is already available. Sources: `button`, `storage`, `configuration`, `integration`, `retry`. |
| `ytpp:consent` | Plugin → adapter | Existing notification after an accepted local button choice; source `button`. Does not imply permission for other services. |
| `ytpp:grant-consent` | Adapter → wrapper | Starts this block, still subject to `before-load`. Does not store local consent. Repeated grants while loading/active are ignored. |
| `ytpp:revoke-consent` | Adapter → wrapper | Clears the stored choice for the playlist, destroys this player, removes its iframe, disables navigation and invalidates pending creation/callbacks. |
| `ytpp:consent-revoked` | Plugin → adapter | Notification after revocation; source `integration`. |

For service-wide permission changes, dispatch the command to **every** matching
wrapper, including duplicate playlists. Removing the shared storage key alone
does not stop other already-active blocks. A manager remains responsible for its
own persistence and cross-tab changes.

An adapter's early JavaScript can use this pattern (the manager API is illustrative,
not a Borlabs-specific implementation):

```js
let youtubeAllowed = false; // Initialize from the actual manager's current state.

document.addEventListener('ytpp:before-load', (event) => {
    if (!youtubeAllowed) {
        event.preventDefault();
    }
});

// Wire this to the actual manager's callbacks after the blocks initialize.
function onYouTubeConsentChanged(allowed) {
    youtubeAllowed = allowed === true;
    document.querySelectorAll('.ytpp-player[data-playlist-id]').forEach((block) => {
        block.dispatchEvent(new CustomEvent(
            youtubeAllowed ? 'ytpp:grant-consent' : 'ytpp:revoke-consent'
        ));
    });
}
```

The early listener can be attached with `wp_add_inline_script()` at
`wp_enqueue_scripts`, using handle `yt-playlist-player-player-view-script` and
position `before`. Registering it after page initialization cannot prevent
requests that have already started. For a manager that decides asynchronously,
veto synchronously first and grant later after a positive decision.

Revocation cannot undo requests or data already transmitted. The globally shared
YouTube API script is retained because other page components may use it; the
plugin stops its own iframe and does not re-create it until another accepted
activation. A request already in flight can still finish. No API can retract
third-party data or grant control over unrelated embeds. Manager-specific
adapters, including Borlabs, need separate verification on the real site.

## Block editor preview

For editors, a syntactically valid playlist ID immediately creates a preview.
The outer iframe uses an authenticated, nonce-protected URL on the same WordPress
site. Its minimal document embeds the actual player exclusively from
`https://www.youtube-nocookie.com`. This extra same-origin boundary supplies the
HTTP referrer YouTube requires even when Gutenberg renders its editor canvas from
a `blob:` URL. It does not proxy video data through WordPress.

The preview lets the editor see the playlist while editing, but it also
establishes an external connection before the post is viewed on the public site.
The block inspector displays this notice. No preview or external resource is
created for empty or syntactically invalid input. The preview and its visible
navigation representation are deliberately non-interactive so that clicks select
the block and expose its settings.

## Editor availability check

For a syntactically valid playlist, the inspector offers **Check playlist
availability**. The plugin loads `https://www.youtube.com/iframe_api` inside the
dedicated, visually hidden and authenticated same-origin check document only
after the editor selects this button. The check document is a direct child of the
inspector and is removed after a result or timeout. Its player remains on
`https://www.youtube-nocookie.com`. No API key, OAuth token or editor identity is
sent by the plugin.

The check reports a positive result only when the player returns at least one
playlist item. Missing/private content and embedding restrictions reported by the
player are shown as unavailable. Network failures, blocked requests, timeouts and
ambiguous player errors are shown as not clearly determinable rather than as an
invalid playlist. The complete decision and its limits are documented in
[ADR 0001](adr/0001-keyless-playlist-availability-check.md).

## External services and observed requests

The plugin itself constructs only the YouTube API and no-cookie embed URLs.
The embedded player can request additional Google resources. The following hosts
were observed on 10 September 2026 in a fresh Chromium profile on the local
WordPress test post `/2026/09/06/hello-world/` (three gated blocks, first block
loaded, then navigation from `1 / 4` to `2 / 4`):

| Host | Observation / purpose |
| --- | --- |
| `www.youtube.com` | IFrame API and player JavaScript, after consent |
| `www.youtube-nocookie.com` | Embedded player and its own API requests, after consent |
| `i.ytimg.com`, `yt3.ggpht.com` | YouTube image resources, after consent |
| `fonts.gstatic.com` | Player font resources, after consent |
| `www.gstatic.com` | Additional Google static resources, after consent |
| `www.google.com`, `jnn-pa.googleapis.com` | Additional Google requests initiated by the embedded player, after consent; not separate plugin integrations |
| `*.googlevideo.com` | Media delivery after a visitor manually started playback; observed host `rr3---sn-hoxu-h0j6.googlevideo.com` |

Before consent there were **no YouTube/Google player requests or player iframes**.
The page separately requested `secure.gravatar.com` for WordPress comment avatars;
that is outside this plugin's gate. The site's other components need their own
privacy assessment. No URLs containing visitor-specific query values are stored
in this record.

After revocation the iframe was removed, navigation disabled and the local choice
cleared. No plugin JavaScript error occurred during loading, navigation or
revocation. The snapshot is evidence for this tested session, not an exhaustive
or permanent network allowlist: hosts, advertising, account state, geography and
YouTube behavior can change. Repeat network verification with the actual content,
browser and consent manager before deployment.

The [IFrame API reference](https://developers.google.com/youtube/iframe_api_reference)
documents the external player lifecycle, including `destroy()`. YouTube describes
the limits of [privacy-enhanced embedding](https://support.google.com/youtube/answer/171780).

## Verification

Use the browser network panel on a public post and filter for `youtube` before
and after selecting the consent button:

1. In the editor, select **Forget saved consent for this playlist**, or clear the
   site's browser storage. Reload the public page with the built-in gate enabled
   and preserve the network log.
2. Confirm that no request to a YouTube domain occurs before activation.
3. Select **Load YouTube playlist**.
4. Confirm that the API request occurs only now and that the player iframe uses
   `www.youtube-nocookie.com`.
5. Confirm that playback does not start automatically.
6. Reload the page and confirm that the same playlist now loads without asking
   again.

### Integration verification

1. Register a pre-load veto before the view script, disable the local gate for
   the test block and reload with an empty network log. No external request
   should originate from this block. Repeat with a previously stored choice.
2. Allow YouTube in the adapter and dispatch `ytpp:grant-consent` to the wrapper.
   Confirm the no-cookie iframe and navigation appear without autoplay.
3. Dispatch `ytpp:revoke-consent`. Confirm the iframe disappears, playback stops,
   the stored key is removed and navigation is disabled. Repeat while the API
   is still pending: its eventual ready callback must not re-create the iframe.
4. Grant again. One click must perform exactly one navigation action; no duplicate
   listeners should remain. Repeat with two blocks and service-wide revocation.
5. Verify the actual manager's callbacks, persistence, caching and cross-tab
   behavior on the intended site. No vendor-specific adapter is shipped yet.

This document describes the plugin's technical behavior and is not legal advice
or a guarantee that a complete website meets a particular privacy law.
