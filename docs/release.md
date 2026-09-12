# Release packaging

The installable plugin package is created from the production build and an
explicit allowlist of runtime files. Development sources, tests, dependencies,
Git metadata and local configuration are not copied into the package.

## Build locally

Install the locked dependencies first, then run:

```bash
npm ci
npm run plugin:zip
```

The command writes these files to `dist/`:

- `yt-playlist-player.zip`
- `yt-playlist-player.zip.sha256`

The ZIP contains one top-level directory named `yt-playlist-player/`. Its
contents are the plugin entry point, `readme.txt`, `LICENSE`, and the runtime
directories `build/`, `includes/`, and `languages/`.

Verify the checksum with:

```bash
sha256sum --check dist/yt-playlist-player.zip.sha256
```

## Local installation smoke test

Start the isolated WordPress environment and run the normal quality gate before
installing the package:

```bash
npm run env:test:start
npm run test:local
```

In the WordPress administration area, use **Plugins > Add New > Upload Plugin**
to upload `dist/yt-playlist-player.zip`. Activate **YouTube Playlist Player**,
insert the block into a test post, and verify that the block accepts a real
playlist, displays its navigation, and respects the consent gate. This manual
installation check is intentionally separate from the automated build because
the WordPress upload screen requires a browser session.

## Step 15 acceptance record

On 12 September 2026 the generated ZIP was installed through the WordPress
administration upload flow in a WordPress instance. The plugin was activated and
used as a Gutenberg block with a real playlist. The manual use check passed.
Together with the automated production build, allowlist, reproducibility and
checksum checks, this completes the acceptance criteria for Step 15.
