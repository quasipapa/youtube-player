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

## Change classes and jobs

Every PR starts the workflow. `scripts/classify-changes.mjs` compares the complete
PR diff from the merge base to its head. Rename detection is disabled so both
old and new paths are considered. Empty diffs, unavailable comparison data and
unknown paths select `full`. Mixed changes use the strongest applicable class.

| Class | Explicit allowlist | Required checks |
| --- | --- | --- |
| `docs-only` | Markdown under `docs/`; root README, SECURITY and project-plan Markdown; current PR template and the three current issue-template YAML files | Documentation and CI contract tests |
| `metadata` | `readme.txt`, `LICENSE`, `THIRD_PARTY_NOTICES.md` | Documentation and CI contract tests; production build, version/license metadata, package contents and SHA-256 |
| `full` | Every other path, including unknown paths | Documentation and all existing source, integration and artifact checks |

`docs/mcp/*.toml`, executable files, block metadata, dependency manifests and
locks, scripts, workflows and checker configuration select `full`. The plugin
bootstrap remains code even when only its version declaration changes.
Translation catalogs also select `full`: their reproducibility check uses
WordPress CLI and must verify PO, MO and JSON consistency. They cannot safely
use the bounded metadata path with the current tooling.
The executable allowlist is authoritative; adding a path requires review and
classification tests.

The **Documentation** job runs independently for every class because
documentation is part of the product. `npm run check:docs` checks selected
Markdown rules, parsed inline/reference links and images, GitHub heading anchors,
explicit anchors, stable IDs, roadmap/idea traceability, ADR numbering/indexing,
coverage links and the version matrix. It ignores fenced examples and does not
request external URLs. `npm run test:ci` exercises classification, the final gate,
Markdown parsing and delivery failure cases using temporary local fixtures.

The **Metadata delivery checks** job installs locked npm dependencies, runs
`npm run check:versions`, `npm run plugin:zip` and `npm run check:package`.
It uses Node.js and Python's standard ZIP library, without Composer, PHP matrix,
WordPress, browser or Plugin Check setup. The shared
`scripts/check-delivery.mjs` also validates full CI and releases. The package
script includes third-party notices alongside the runtime files.

The following jobs run for `full`:

- **Build and version** uses the configured runner and Node.js version, `npm ci`,
  the pinned Composer path and `.wp-env.test.json`; it runs `npm run check` and
  verifies package, plugin header, PHP constant and readme versions agree.
- **PHP matrix** installs locked Composer dependencies on the configured
  compatibility boundaries and runs Composer lint and unit tests without
  coverage.
- **JavaScript and CSS** installs locked npm dependencies and runs JS, SCSS and
  the project-configured Jest checks through `wp-scripts test-unit-jest`.
- **WordPress integration, E2E and Plugin Check** runs `npm run test:local`.
- **Upload CI plugin artifact** depends on the documentation and full source jobs. It receives
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

## Final gate and full override

**CI gate** always evaluates all prerequisite results. Classification and
documentation must succeed. Jobs required for the selected class must succeed;
unneeded jobs must be deliberately skipped. Failures, cancellations, missing
results and unknown classes fail the gate. A failed docs check therefore also
blocks a full run. This contract is recorded in
[ADR 0007](../architecture/decisions/0007-change-sensitive-ci.md).

Add the PR label `ci:full` to force full CI. Label addition and removal trigger
a new run, as do pushes. The label only escalates checks. Manual `CI` workflow
dispatches and pushes to `main` always select `full`. Dispatch against the PR's
branch to verify that exact head with all checks. No commit-message skip is used.

## Required-check migration

The target required status is **CI gate**, bound to GitHub Actions. Migration
is an operational step after successful full and probe runs: snapshot
`Protect main`, verify all gate dependencies, then replace the six existing
required contexts with `CI gate`, preserving all other rules and the lack of
bypass actors. Read the ruleset back and verify a failing docs probe cannot
merge. Until migration, existing individual required checks remain in force.
Record the actual migration and probe links in the
[issue #73 audit](../audits/ci-73.md). Do not mark migration complete merely
because the workflow YAML has changed.

Tag-triggered publication is a separate workflow documented under
[releases](releases.md).
