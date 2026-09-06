=== YouTube Playlist Player ===
Contributors: quasipapa
Tags: youtube, playlist, video, block, privacy
Requires at least: 6.1
Tested up to: 7.1
Requires PHP: 8.0
Stable tag: 0.1.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/old-licenses/gpl-2.0.html

A privacy-aware Gutenberg block for embedding and navigating YouTube playlists.

== Description ==

YouTube Playlist Player provides a Gutenberg block for a public YouTube playlist.
Playlist input and privacy controls are available in the block settings sidebar,
and the editor displays a preview for valid input. Full navigation is being added
incrementally.

The plugin is under active development and is not ready for production use.

== Installation ==

No stable plugin package is available yet. Development setup is documented in
the GitHub repository.

== Frequently Asked Questions ==

= Does the plugin contact YouTube immediately? =

The plugin uses a local consent placeholder by default and only loads YouTube
resources after visitor interaction. Site owners can disable this built-in gate
for an individual block when an external content blocker provides the required
protection. A valid playlist loads a youtube-nocookie.com preview in the editor.

== Changelog ==

= 0.1.0 =

* Initial development version. Not released.
