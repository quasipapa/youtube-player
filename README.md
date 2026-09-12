# YouTube Playlist Player

YouTube Playlist Player is a WordPress plugin for embedding and navigating a
YouTube playlist as a Gutenberg block. Version 0.1.0 is an Alpha release and
will continue to evolve based on testing and feedback.

## Download

Download the current Alpha version directly from the
[GitHub release page](https://github.com/quasipapa/youtube-player/releases/tag/v0.1.0):

[Download the installable plugin ZIP](https://github.com/quasipapa/youtube-player/releases/download/v0.1.0/yt-playlist-player.zip)

In WordPress, go to **Plugins → Add New → Upload Plugin**, select the downloaded
ZIP file, install it and activate **YouTube Playlist Player**. This Alpha release
is still being developed; review the compatibility, privacy and accessibility
notes before using it on a public site.

## Project status

The existing PHP, JavaScript, and CSS files are a prototype. The implementation
will be developed incrementally according to the documented requirements and
plan:

- [Requirements and implementation plan](ANFORDERUNGEN-UND-UMSETZUNGSPLAN.md)

The plugin is distributed through GitHub Releases. Publication in the
WordPress.org Plugin Directory may be considered later.

Support, supported platform versions and the maintenance process are documented
in [docs/maintenance.md](docs/maintenance.md). Security issues must be reported
according to [SECURITY.md](SECURITY.md), not through a public issue.

## Development environment

Required local tools:

- Docker Engine
- Node.js 20 or later
- npm 10.2.3 or later

Install dependencies and start the local WordPress environment:

```bash
npm ci
npm run env:start
```

WordPress is then available at <http://localhost:8888>. The default `wp-env`
credentials are `admin` / `password` and must only be used for local development.


Run the complete local quality gate, including the isolated WordPress
integration test and Plugin Check:

```bash
npm run test:local
```

Additional setup and troubleshooting information is available in
[docs/development.md](docs/development.md).

## Player appearance

See [player sizing and theme styling](docs/styling.md) for inspector controls,
CSS custom properties and responsive verification.

## Privacy

The block uses `youtube-nocookie.com` for video iframes. By default it contacts
YouTube only after the visitor loads the playlist or a playlist-specific choice
was remembered in this browser. The built-in gate is configurable for sites where
an external consent manager controls loading. Integrations can veto loading,
grant permission and stop a player after revocation.

The exact frontend and editor behavior, contacted domains, and verification
steps are documented in [docs/privacy.md](docs/privacy.md).

## Accessibility

Keyboard behavior, status announcements, focus, contrast and the manual acceptance
checklist are documented in [docs/accessibility.md](docs/accessibility.md).

## License

Copyright (C) 2026 quasipapa.

This project is licensed under the GNU General Public License v2.0 or later
(`GPL-2.0-or-later`). See [LICENSE](LICENSE).
