# ADR 0001: Keyless playlist availability check

- Status: Accepted
- Date: 2026-09-07
- Related work: Step 8a, GitHub issue #25

## Context

Local validation can reject malformed playlist IDs and unsupported URLs, but it
cannot determine whether a syntactically valid playlist exists, contains a usable
video, or permits embedding. Editors need an explicit remote check without
turning every keystroke into a YouTube request.

Two approaches were considered:

1. The keyless YouTube IFrame Player API can report the loaded playlist, its
   current item and player errors. It has no project credentials or Data API
   quota, but some failure causes cannot be distinguished reliably.
2. The YouTube Data API can query playlist metadata, playlist items and video
   status more precisely. It requires a Google Cloud project and an API key for
   public data, uses quota for every request and requires OAuth for private user
   data. Even `status.embeddable` does not guarantee playback because platform
   policy or third-party claims can still block an embed.

Official references:

- [IFrame Player API](https://developers.google.com/youtube/iframe_api_reference)
- [YouTube Data API overview](https://developers.google.com/youtube/v3/getting-started)
- [`playlists.list`](https://developers.google.com/youtube/v3/docs/playlists/list)
- [`playlistItems.list`](https://developers.google.com/youtube/v3/docs/playlistItems/list)
- [Video resource and `status.embeddable`](https://developers.google.com/youtube/v3/docs/videos)

## Decision

The plugin uses the keyless IFrame Player API for step 8a. The check starts only
after a syntactically valid playlist has loaded its editor preview and the editor
selects **Check playlist availability**.

After the button is selected, the inspector creates a separate visually hidden,
authenticated same-origin check iframe as its direct child. That document loads
the IFrame API and keeps the YouTube player on `www.youtube-nocookie.com`. Results
are sent to the inspector with a source- and origin-validated `postMessage`.

The check intentionally does not reuse the visible canvas preview. Gutenberg can
place that preview below an additional editor-canvas iframe, so the block script
and preview are not guaranteed to have a direct parent-child relationship. The
dedicated inspector iframe provides that stable relationship and is removed after
a result or timeout.

Results are classified as follows:

- **available:** the ready player returns at least one playlist video;
- **unavailable:** the ready player returns no item, the video is missing or
  private (error 100), or embedding is prohibited (errors 101 and 150);
- **not clearly determinable:** the API cannot load, a request is blocked or
  times out, or another player error occurs.

The last category is deliberately not presented as an invalid playlist. A
15-second editor-side timeout prevents the check from remaining busy forever.

## Consequences

- No API key, OAuth flow, plugin setting or secret storage is required.
- The additional IFrame API request occurs only after an explicit editor action.
  The visible editor preview itself already contacts YouTube as separately
  documented.
- The result verifies practical public embed behavior rather than authoritative
  playlist metadata. It can change when YouTube availability or policy changes.
- A Data API integration may be reconsidered as a separate enhancement if real
  use shows that the keyless result is not sufficiently precise.
