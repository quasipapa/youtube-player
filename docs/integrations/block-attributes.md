# Block attribute contract

For developers creating or transforming `yt-playlist-player/player` blocks.
WordPress serializes these attributes in post content as described in
[runtime architecture](../architecture/runtime.md#persisted-block-configuration).
Editorial instructions are in [block configuration](../user/configuration.md).

The persisted attribute contract is:

| Attribute | Type | Default |
| --- | --- | --- |
| `playlistId` | string | empty |
| `playlistTitle` | string | empty |
| `showPlaylistTitle` | boolean | `false` |
| `requireConsent` | boolean | `true` |
| `maxWidth` | string | empty |
| `maxHeight` | string | empty |
| `aspectRatio` | string | `16:9` |
| `customAspectRatio` | string | `16:9` |

## Playlist input validation

Enter a playlist ID containing 10 to 100 ASCII letters, digits, hyphens or
underscores, or an HTTP(S) URL with exactly one `list` parameter on:

- `youtube.com`, `www.youtube.com`, `m.youtube.com`, `music.youtube.com`;
- `youtu.be`, `www.youtu.be`;
- `youtube-nocookie.com`, `www.youtube-nocookie.com`.

Credentials, non-default ports, duplicate `list` values, unsupported hosts and
malformed IDs are rejected. Other query values are discarded. A valid value
shows a non-interactive editor preview. **Check playlist availability** performs
an explicit remote check; network failure or timeout is reported as
indeterminate rather than invalid.


WordPress additionally supplies the supported `align` attribute. Its values are
`wide`, `full`, `center`, `left` and `right`, subject to theme support.
Sizing validation and fallback rules are described in
[layout architecture](../architecture/layout.md).
