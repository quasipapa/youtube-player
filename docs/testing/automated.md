# Automated verification

Commands, selection guidance and expected results for focused checks and the
complete local gate are defined in the development
[quality-gate workflow](../development/workflow.md#quality-gates). This document
describes what the automated tests cover and where their limits are.
Requirement-level automated and manual responsibility is maintained in the
[coverage matrix](coverage.md).

## Automated suite inventory

- `tests/unit/`: PHP metadata, parsing, rendering, preview and translation.
- `src/*.test.js`: editor, frontend, parser, sizing and internationalization.
- `tests/e2e/wordpress.pw.js`: Gutenberg persistence and frontend privacy gate.
- `tests/responsive/`: production markup at representative dimensions, portrait
  and landscape ratios, separate and combined size limits, narrow columns and
  alignment reflow. Tests use local iframe doubles and make no YouTube requests.
- `tests/accessibility/`: keyboard, focus, status, contrast, forced colors,
  multiple blocks and consent integration with local API doubles.
- `scripts/ci.test.mjs`: Node test runner checks classification and gate failure
  behavior, real Git rename diffs, Markdown parsing, version mismatch rejection,
  and temporary ZIP corruption/content fixtures. Run with `npm run test:ci`;
  only Node.js, Git and Python are needed.

## CI workflow acceptance

The implementation author (Codex or contributor) runs `npm run check:docs`,
`npm run test:ci`, `npm run plugin:zip`, `npm run check:package` and the full
`npm run test:local` gate. Then the author opens temporary draft probes against
the implementation branch: Markdown only, `readme.txt` only and an unknown path.
GitHub Actions must select the classes described in the
[CI contract](../operations/ci.md#change-classes-and-jobs). The implementation PR
itself verifies the code/tooling path. Inspect actual job conclusions, including
deliberate skips and the final gate, rather than just the workflow conclusion.

The author introduces an invalid link and a duplicate stable ID in a docs probe,
one at a time. Each must fail documentation and the final gate. Restore the valid
fixture and verify recovery. Add `ci:full` to a valid docs probe, observe full
jobs, then remove it and verify the docs path returns. No probe is merged.

The maintainer reviews the run evidence before replacing individual required
checks with `CI gate`. After migration, inspect a failing probe's merge state
and required-check rollup to confirm it is blocked. Re-read the ruleset to confirm
other branch protections remain unchanged. The author records run URLs, commit
SHAs, job conclusions and unresolved limitations in a dated audit, such as
[the issue #73 audit](../audits/ci-73.md).

Release verification uses a manual `Release` dispatch on the candidate branch
with a matching `release_tag`. All verification must run while publication is
skipped. See [release acceptance](../operations/releases.md#github-releases).
The registered Release workflow can be dispatched against the implementation
branch before merge; inspect that run's publication step to confirm it skipped.

Plugin Check runs only against staged production files. Narrow exemptions are
recorded in its script/configuration and cover block API version 2 for WordPress
6.1, the GitHub update URI, the YouTube name and explicit bundled translation
loading. Other warnings or errors require investigation.

The integration site uses the configured WordPress and PHP test versions because
Plugin Check requires a newer WordPress installation than the declared minimum.
CI separately exercises the configured PHP compatibility boundaries. The
declared WordPress minimum has no direct integration coverage. Concrete values
and their sources are in the [version matrix](../development/versions.md).
