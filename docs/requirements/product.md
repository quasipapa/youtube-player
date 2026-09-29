# Product requirements

These accepted functional requirements describe observable product behavior.
Implementation details are documented in the architecture. All requirements
belong to [RM-001](../roadmap.md#rm-001) and were delivered in
[v0.1.0 Alpha](https://github.com/quasipapa/youtube-player/releases/tag/v0.1.0)
unless stated otherwise.

<a id="fr-001"></a>
## FR-001 – Gutenberg block

The plugin provides a YouTube Playlist Player block in the Gutenberg Media
category.

<a id="fr-002"></a>
## FR-002 – Playlist input

An editor can enter a YouTube playlist as a canonical ID or supported HTTP(S)
YouTube URL. Exactly one `list` parameter is extracted; unsupported hosts,
credentials, non-default ports, duplicate parameters and malformed IDs are
rejected.

<a id="fr-003"></a>
## FR-003 – Canonical persistence and validation

Valid input is normalized to the playlist ID. Empty or invalid input produces an
understandable, translatable state without external preview or player controls.
Syntactic validity does not claim that a playlist is public, available or
embeddable.

<a id="fr-004"></a>
## FR-004 – Editor preview and availability check

A syntactically valid playlist has a labelled external editor preview. On
explicit request, the editor can check whether the playlist contains at least
one playable item without an API key. Results distinguish available,
unavailable and not clearly determinable. See [ADR 0001](../architecture/decisions/0001-keyless-playlist-availability-check.md)
and [ADR 0004](../architecture/decisions/0004-same-origin-editor-preview.md).

<a id="fr-005"></a>
## FR-005 – Initial player state

After loading, playlist index `0` is selected without autoplay.

<a id="fr-006"></a>
## FR-006 – Playlist navigation

The frontend supplies first, previous, next and last actions plus a position
indicator such as `2 / 12`. An impossible action is disabled.

<a id="fr-007"></a>
## FR-007 – Navigation never starts playback

Selecting another playlist item cues it but does not automatically start video
playback.

<a id="fr-008"></a>
## FR-008 – Independent instances

Multiple player blocks on one page load and navigate independently while safely
sharing the external IFrame API.

<a id="fr-009"></a>
## FR-009 – Editorial title

An editor can optionally show a manually maintained playlist title above the
video. The title does not require a YouTube request.

<a id="fr-010"></a>
## FR-010 – Recoverable loading failure

A loading error produces a translatable accessible error and retry action. A
technical or blocked request is not mislabeled as invalid input.

<a id="fr-011"></a>
## FR-011 – Maximum dimensions

An editor can configure maximum width and maximum height. The player does not
exceed its content container or configured maximum.

<a id="fr-012"></a>
## FR-012 – Aspect ratio

The editor can select `16:9`, `4:3`, `1:1` or a valid custom aspect ratio. Values
that would violate the embedded player's technical minimum are rejected or
constrained.

<a id="fr-013"></a>
## FR-013 – Responsive layout

The player and controls remain visible and usable on phone, tablet and desktop
without horizontal clipping.

<a id="fr-014"></a>
## FR-014 – Standard block alignments

The block supports `wide`, `full`, `center`, `left` and `right` when the theme
supports them. Left and right alignment permit text wrapping where sufficient
space exists and collapse safely on narrow screens.

<a id="fr-015"></a>
## FR-015 – Theme customization

Themes can customize documented CSS custom properties without replacing plugin
markup or scripts. Editor and frontend presentation should remain materially
consistent.

Automated and manual verification is mapped in the
[functional coverage matrix](../testing/coverage.md#functional-requirements).
