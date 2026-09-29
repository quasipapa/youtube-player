# Consent-manager integration

For developers implementing a site adapter. Site administrators start with
[site configuration](../operations/site-configuration.md).

## WordPress filter

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

## JavaScript events

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


Verify adapters using [MAN-005](../testing/manual-acceptance.md#man-005).
