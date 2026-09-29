# Continuous integration

`.github/workflows/ci.yml` runs for every pull request and every push to `main`.
Concurrency is scoped to workflow and ref; a newer run cancels an older run on
the same ref. Default permission is read-only repository contents.

## Version sources

The development documentation does not configure CI. Executable files remain
authoritative. The current values, their owners and their use in local, CI and
release environments are listed once in the
[project version matrix](../development/versions.md).

Some values must occur in more than one executable configuration. The
documentation check verifies those coupled values and the matrix. Version
changes follow the
[intentional update procedure](../development/setup.md#intentional-dependency-updates).

## Jobs and contract

- **Build and version** uses the configured runner and Node.js version, `npm ci`,
  the pinned Composer path and `.wp-env.test.json`; it runs `npm run check` and
  verifies package, plugin header, PHP constant and readme versions agree.
- **PHP matrix** installs locked Composer dependencies on the configured
  compatibility boundaries and runs Composer lint and unit tests without
  coverage.
- **JavaScript and CSS** installs locked npm dependencies and runs JS, SCSS and
  the project-configured Jest checks through `wp-scripts test-unit-jest`.
- **WordPress integration, E2E and Plugin Check** runs `npm run test:local`.
- **Upload CI plugin artifact** depends on every preceding job. It receives
  `actions: write`, builds runtime assets, stages the runtime allowlist, creates
  a ZIP and checksum, and retains them for three days.

A failure in any prerequisite prevents artifact publication. The artifact is a
review aid, not a GitHub release. Action revisions are pinned by commit hash;
updates require normal dependency review.

The parallel jobs, their synchronization before artifact creation and the
separate release path are shown in the
[delivery architecture sequence](../architecture/development.md#delivery-architecture).
The diagram is maintained there to avoid a second representation of the same
workflow drifting out of date.

At present the same full workflow runs for documentation-only changes. Issue
[#73](https://github.com/quasipapa/youtube-player/issues/73) tracks a separately
reviewed path-based optimization; this documentation change does not alter CI.

Tag-triggered publication is a separate workflow documented under
[releases](releases.md).
