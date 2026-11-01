# ADR 0007: Validate documentation always and use a focused metadata gate

- Status: Accepted
- Date of decision: 2026-11-01
- Evidence: project owner decisions recorded in [issue #73](https://github.com/quasipapa/youtube-player/issues/73)
- Affected requirements: [NFR-006](../../requirements/quality.md#nfr-006),
  [NFR-007](../../requirements/quality.md#nfr-007),
  [NFR-008](../../requirements/quality.md#nfr-008)

## Context

The current CI runs the complete quality gate for every pull request.
Documentation is part of the product: code and tooling changes can invalidate
its links, contracts, version references and verification evidence.
Delivery metadata also needs build and package validation, but running PHP,
WordPress and browser suites for every bounded metadata change is expensive.

## Decision

Run the documentation job for every change class: documentation only, metadata
and full. Validate Markdown, internal links, anchors, stable IDs and traceability.
A documentation failure blocks the final gate in every class.

Choose variant B for metadata: a dedicated, focused job installs locked npm
dependencies, builds production assets, checks versions and plugin metadata,
creates the package and verifies its contents and SHA-256 checksum. This path
does not require the PHP matrix, Composer installation, WordPress environment,
browser suites or Plugin Check. Extract shared version and package validation
so metadata, full CI and release checks use the same rules without copied logic.

Classify only explicitly allowlisted, bounded changes as documentation or
metadata. Unknown paths, code, dependencies, build and automation changes require
full CI. Mixed changes use the strongest applicable class. Files containing
executable code, such as the plugin bootstrap, cannot qualify as metadata merely
because a version declaration was edited.
Translation catalogs also select full CI because their existing consistency and
reproducibility checks require WordPress CLI. The bounded metadata allowlist is
limited to `readme.txt`, `LICENSE` and `THIRD_PARTY_NOTICES.md`. Packages include
the third-party notices and must contain the PHP helpers and block runtime
assets in addition to metadata and a valid checksum.

Start the workflow for every pull request. A stable final gate requires the
documentation job and every job expected for the selected class to succeed;
only deliberately unneeded jobs may be skipped. Migrate required status checks
to that gate after verifying its behavior. Provide an override that can force
full CI. Release tags always run the complete release gate regardless of paths.

## Alternatives considered

- Variant A: reuse the current build-and-version job for metadata. It minimizes
  workflow changes but also starts Composer, WordPress and the combined source
  checks, limiting the runtime reduction.
- Variant C: send all metadata changes through full CI. It is simple but retains
  the cost of unrelated PHP and browser checks for bounded delivery changes.
- Run documentation validation only for documentation changes. This would miss
  documentation drift caused by code, dependency and automation changes.

## Consequences

Documentation remains a required part of product validation. Bounded metadata
changes receive focused delivery checks with lower infrastructure cost. Shared
validation rules require tests and explicit ownership to prevent divergence.
Uncertain metadata changes retain full validation.

The workflow implements this design. Probe results and the operational ruleset
migration are tracked in the [CI audit](../../audits/ci-73.md). It extends
[ADR 0005](0005-layered-quality-gate.md) and
[ADR 0006](0006-reproducible-allowlisted-release-package.md).
