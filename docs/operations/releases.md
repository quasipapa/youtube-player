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

## Pre-release acceptance

Release acceptance applies the existing test procedures to the exact release
candidate. It does not define a separate functional test suite.

Before tagging, the maintainer:

1. runs the [complete automated gate](../development/workflow.md#quality-gates);
2. completes the applicable [manual acceptance](../testing/manual-acceptance.md);
3. records the results, unresolved checks and accepted residual risks in a
   release-specific audit record;
4. reconciles the planned milestone, closed issues, requirements, ADRs, tests
   and roadmap;
5. confirms that the changelog, license, documentation and all version
   declarations agree;
6. reviews Dependabot alerts, pending updates,
   [maintenance and support](maintenance.md), and
   [security guidance](../../SECURITY.md);
7. approves the version number and release classification.

The additional release decision does not introduce another test procedure. It
binds the referenced test results and package checks to the exact candidate,
confirms agreement between the tag and version declarations, and records the
explicit maintainer approval. A failed or unresolved check blocks the release
unless its residual risk is documented and explicitly accepted.

## GitHub releases

`.github/workflows/release.yml` runs on an exact push of a tag matching `v*`.
This is a separate tag workflow, not a continuation of the pull-request CI
workflow. It repeats the complete gate for the tagged repository state, installs
locked dependencies, and uses the centrally documented
[CI and release version sources](ci.md#version-sources).

The workflow verifies that a semantic `vMAJOR.MINOR.PATCH` tag agrees with
`package.json`, the plugin header, the PHP constant and `readme.txt`. It then
runs `npm run plugin:zip` and verifies the checksum, required entries and
excluded development paths. The relationship between CI, release workflow and
generated artifacts is shown in the
[delivery architecture sequence](../architecture/development.md#delivery-architecture).

The single job has `contents: write`; the workflow default remains
`contents: read`. Its outputs are a GitHub Release with generated notes,
`yt-playlist-player.zip` and `yt-playlist-player.zip.sha256`. Concurrency is per
tag and is not cancelled in progress. Any failed test, version, checksum or
content check prevents publication.

The repository's workflow permissions must allow the release job's
`contents: write` token permission. The tag is the explicit release approval;
creating and pushing a release tag remains a deliberate maintainer action.

A roadmap outcome links the mutable target milestone. After publication it also
links the immutable GitHub Release. The release-specific audit record preserves
the evidence and decisions without turning this procedure into a release log.

Historical acceptance, open items and evidence for individual versions are
listed in the [release audit index](../audits/releases/index.md).
