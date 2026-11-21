# ADR 0009: WordPress 6.6 minimum for the shared React JSX runtime

- Status: Accepted
- Date of decision: 2026-11-21
- Supersedes: the WordPress minimum of
  [ADR 0002](0002-minimum-wordpress-and-dynamic-rendering.md); its
  metadata-driven dynamic rendering decision remains in force
- Evidence: [issue #132](https://github.com/quasipapa/youtube-player/issues/132),
  found by the minimum-WordPress integration lane prototype for
  [issue #115](https://github.com/quasipapa/youtube-player/issues/115)
- Affected requirements: [NFR-001](../../requirements/quality.md#nfr-001)

## Context

`@wordpress/scripts` compiles JSX for the automatic runtime and treats
`react/jsx-runtime` as a WordPress-provided script. The generated editor asset
file therefore lists the script dependency `react-jsx-runtime`. WordPress
registers that handle from version 6.6 onward. On WordPress 6.1–6.5 the
dependency is unregistered, WordPress does not enqueue the editor script and the
block type is never registered in the editor. The frontend script does not
depend on the handle.

The previously declared minimum of WordPress 6.1 was therefore never met by the
editor part of the plugin, including release v0.1.0.

## Decision

Require WordPress 6.6 and keep the build on the standard `@wordpress/scripts`
dependency extraction. Require PHP 8.0 as the runtime language floor.

## Alternatives considered

- Keep WordPress 6.1 and bundle `react/jsx-runtime` into the editor script
  through a custom webpack configuration. This adds project-owned build
  configuration, couples the bundle to the React version of each WordPress
  release and diverges from the supported toolchain path.
- Ship a fallback registration of the `react-jsx-runtime` handle for older
  WordPress versions. This makes the plugin responsible for a core script.

## Consequences

Sites below WordPress 6.6 cannot install the plugin. The `render` property of
`block.json` (WordPress 6.1, ADR 0002) is available on every supported version.
The plugin header, `readme.txt`, NFR-001, this ADR and the
[version matrix](../../development/versions.md) declare the same minimum;
`npm run check:docs` verifies their agreement. Block API version 3 becomes
available on every supported version; whether to adopt it is decided separately
in [issue #133](https://github.com/quasipapa/youtube-player/issues/133).
The minimum-platform lane from [IDEA-004](../../ideas.md#idea-004)
(`npm run test:minimum`) runs the WordPress E2E suite on the declared minimum in
CI and in the release workflow; it fails on WordPress 6.5 with the defect
described above.
