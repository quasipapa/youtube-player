# ADR 0006: Publish a reproducible, allowlisted release package

- Status: Accepted – documented retrospectively
- Date of decision: 2026-09-10
- Evidence: commits `c94f17d`, `a7e62c3`, `31460ca`; `scripts/build-zip.sh`
- Affected requirements: [NFR-007](../../requirements/quality.md#nfr-007),
  [NFR-008](../../requirements/quality.md#nfr-008)

## Context

A plugin release must exclude source, test, repository and dependency tooling
while remaining attributable to a reviewed commit. Filesystem timestamps and
directory-wide packaging make otherwise identical ZIPs differ.

## Decision

Build production assets, stage only the bootstrap, `readme.txt`, `LICENSE`,
`build/`, `includes/` and `languages/`, then create a sorted ZIP with fixed
timestamps and permissions. Publish its SHA-256 checksum. A `v*` tag triggers a
complete quality gate, verifies tag/package/plugin/readme versions, checks ZIP
contents and creates the GitHub release.

## Alternatives considered

- Archive the repository or an unconstrained working directory.
- Accept timestamp-dependent ZIP output.
- Publish without a checksum or version cross-check.

## Consequences

The same source and toolchain produce the same package bytes, and development
files are excluded by construction. Adding a runtime path requires an explicit
allowlist change and corresponding package verification.
