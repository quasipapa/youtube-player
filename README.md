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

Version 0.1.0 implements the initial functional and non-functional requirements.
Start with the [documentation index](docs/index.md) for requirements,
architecture, verification, operations and future development. Planned outcomes
and uncommitted ideas are kept separately in the [roadmap](docs/roadmap.md) and
[idea register](docs/ideas.md).

The plugin is distributed through GitHub Releases. Publication in the
WordPress.org Plugin Directory may be considered later.

Support, supported platform versions and the maintenance process are documented
in [maintenance and support](docs/operations/maintenance.md). Security issues must be reported
according to [SECURITY.md](SECURITY.md), not through a public issue.

## Development environment

Required local tools:

- Docker Engine
- Node.js and npm meeting the current
  [project version matrix](docs/development/versions.md)

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
[development setup](docs/development/setup.md).

## Player appearance

Editors can follow [player appearance](docs/user/appearance.md).
Theme developers can use the [styling contract](docs/integrations/theming.md).

## Privacy

The block uses `youtube-nocookie.com` for video iframes. By default it contacts
YouTube only after the visitor loads the playlist or a playlist-specific choice
was remembered in this browser. The built-in gate is configurable for sites where
an external consent manager controls loading. Integrations can veto loading,
grant permission and stop a player after revocation.

Read [privacy for editors](docs/user/privacy.md) for user-visible behavior.
Administrators use [site configuration](docs/operations/site-configuration.md);
developers use [consent integration](docs/integrations/consent.md).

## Accessibility

Keyboard behavior, status announcements, focus, contrast and the manual acceptance
requirements and checklist are documented in
[accessibility requirements](docs/requirements/accessibility.md) and
[manual acceptance](docs/testing/manual-acceptance.md).

## License

Copyright (C) 2026 quasipapa.

This project is licensed under the GNU General Public License v2.0 or later
(`GPL-2.0-or-later`). See [LICENSE](LICENSE).
