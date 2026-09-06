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

The plugin does not add analytics or telemetry and does not store visitor
consent or other personal data. Consent therefore applies to the current player
load, not globally or permanently.

When a visitor activates a player, its block wrapper dispatches the bubbling
JavaScript event `ytpp:consent`. The event's `detail.playlistId` contains the
canonical playlist ID. This event is an integration point; it is not a complete
consent-management API.

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

## Block editor preview

For editors, a syntactically valid playlist ID immediately creates a preview
iframe from `https://www.youtube-nocookie.com`. This lets the editor see the
playlist while editing, but it also establishes an external connection before
the post is viewed on the public site. The block inspector displays this notice.
No preview or external resource is created for empty or syntactically invalid
input.

## Verification

Use the browser network panel on a public post and filter for `youtube` before
and after selecting the consent button:

1. Reload the page with the built-in gate enabled and preserve the network log.
2. Confirm that no request to a YouTube domain occurs before activation.
3. Select **Load YouTube playlist**.
4. Confirm that the API request occurs only now and that the player iframe uses
   `www.youtube-nocookie.com`.
5. Confirm that playback does not start automatically.

This document describes the plugin's technical behavior and is not legal advice
or a guarantee that a complete website meets a particular privacy law.
