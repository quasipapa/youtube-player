# YouTube Playlist Player

YouTube Playlist Player is a WordPress plugin for embedding and navigating a
YouTube playlist as a Gutenberg block. The project is currently in its initial
development phase and is not ready for production use.

## Project status

The existing PHP, JavaScript, and CSS files are a prototype. The implementation
will be developed incrementally according to the documented requirements and
plan:

- [Requirements and implementation plan](ANFORDERUNGEN-UND-UMSETZUNGSPLAN.md)

The plugin will initially be distributed through GitHub Releases. Publication in
the WordPress.org Plugin Directory may be considered later.

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

Additional setup and troubleshooting information is available in
[docs/development.md](docs/development.md).

## Privacy

The finished block will use `youtube-nocookie.com` for video iframes and will not
contact YouTube until the visitor explicitly loads the playlist by default. The
built-in privacy gate will be configurable for sites where an external consent
management system already blocks YouTube content.

## License

This project is licensed under the GNU General Public License v2.0 or later. See
[LICENSE](LICENSE).
