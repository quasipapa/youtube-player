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

## GitHub releases

Pushing a tag matching `vMAJOR.MINOR.PATCH` starts the release workflow. It
repeats the complete quality gate and WordPress smoke tests, verifies that the
tag matches all project version declarations, rebuilds the ZIP, checks its
contents and checksum, and then publishes the ZIP and checksum as GitHub
Release assets with generated notes. A failed check prevents publication.

The repository's workflow permissions must allow the release job's
`contents: write` token permission. The tag is the explicit release approval;
creating and pushing a release tag remains a deliberate maintainer action.

## Step 17 acceptance checklist

Before approving a release, the maintainer confirms:

- functional, privacy, accessibility and theme checks are recorded;
- the release ZIP was installed in a fresh WordPress test instance and tested
  with a real playlist;
- [docs/maintenance.md](maintenance.md) and [SECURITY.md](../SECURITY.md)
  describe the current support, security and compatibility process;
- Dependabot alerts and pending updates were reviewed;
- the changelog, license, documentation and all version declarations agree;
- the release tag and version `0.1.0` are explicitly approved;
- the release is clearly described as an Alpha version that will continue to be
  developed.

The release classification is a deliberate maintainer decision. This Alpha
version will continue to be developed; creating and pushing the release tag is
the explicit approval action.
