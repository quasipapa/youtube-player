# Configure a playlist block

For editors working on WordPress posts and pages. Control names below use the
English interface; WordPress displays their translations in the selected language.

## Add and select the block

1. Open the post or page editor.
2. Insert **YouTube Playlist Player** from the **Media** category.
3. Select the block and open the block settings sidebar.
4. Expand **Playlist settings**.

The preview is non-interactive: clicking it selects the block so that you can
change its settings. Save or update the post to publish your changes.

## Playlist settings

| Control | What to do | Expected result |
| --- | --- | --- |
| Playlist ID or URL | Paste a YouTube playlist URL containing a playlist, or its playlist ID | Valid input displays an editor preview |
| Show playlist title above the video | Enable it to add your own heading | The Playlist title field appears |
| Playlist title | Enter your editorial title | It appears above the player without fetching a title from YouTube |
| Check playlist availability | Select it to check the playlist with YouTube | Reports available, unavailable or not clearly determinable |
| Require consent before loading YouTube | Leave enabled unless the website administrator has configured an external blocker | Visitors are asked before the player loads |
| Forget saved consent for this playlist | Select it to test the consent prompt again in your browser | Clears this browser's remembered choice for this playlist |

A preview contacts YouTube while you edit. Read [privacy for editors](privacy.md)
before entering a playlist.

## Understand messages

| Situation | What it means and what to do |
| --- | --- |
| Empty or invalid input | Supply a playlist ID or a YouTube playlist link, rather than a video-only link |
| Syntax is valid | The format is accepted; it does not prove the playlist is playable |
| Available | The check found at least one playable item |
| Unavailable | Check playlist visibility and whether YouTube permits embedding |
| Not clearly determinable | Check the connection or content blocker and retry |

## Publish and use

On the public page, the player selects the first item without starting playback.
Visitors can select first, previous, next and last; actions beyond a playlist
boundary are disabled. Multiple blocks can be used independently.

For size and alignment settings, see [appearance](appearance.md).
