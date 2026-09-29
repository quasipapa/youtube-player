# Privacy for editors

## While editing

Entering a valid playlist displays a preview and contacts YouTube immediately.
This happens in the editor even though visitors will see a consent prompt on
the published page. Empty or invalid input does not create a preview.

**Check playlist availability** makes a separate request only when you select
the button. The preview is for inspection; its controls are non-interactive.

## On the published page

With **Require consent before loading YouTube** enabled, the block initially
shows a local message and **Load YouTube playlist** button. Before activation,
it does not load YouTube player resources.

Loading connects the visitor's browser to Google/YouTube and can transfer
technical connection data. The privacy-enhanced player does not eliminate all
external data transfer. Loading does not start video playback automatically.

## Remembered choices

The plugin remembers a local button choice for that playlist, website and browser,
with no automatic expiry. On later visits, the same playlist can load without
another prompt. It does not record visitor identities or provide a server-side
consent audit log. If browser storage is unavailable, permission lasts for the
current page only.

Use **Forget saved consent for this playlist** in **Playlist settings** to remove
the choice in your browser. This does not reset other visitors' choices.
Visitors can clear the site's browser data themselves.

## Coordinate with the website administrator

Leave the built-in gate enabled unless the administrator confirms that an
external consent manager protects this block. A remembered choice does not
override a veto from that manager. Other embeds on the page are outside the
plugin's control.

Administrators can follow [site configuration](../operations/site-configuration.md).
