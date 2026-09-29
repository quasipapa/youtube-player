# Traceability index

This index summarizes relationships; linked requirements, ADRs, issues, tests
and releases remain authoritative. Stable IDs are defined by the
[documentation policy](documentation-policy.md).

## Roadmap and ideas

| Outcome | Inputs | Actionable work | Delivery |
| --- | --- | --- | --- |
| [RM-001](roadmap.md#rm-001) | accepted requirements and historical implementation steps | closed issues 1–18 and related follow-ups | [v0.1.0 Alpha](https://github.com/quasipapa/youtube-player/releases/tag/v0.1.0) |
| [RM-002](roadmap.md#rm-002) | documentation audit and current discussion | [#35](https://github.com/quasipapa/youtube-player/issues/35) | documentation change, no player release |
| [RM-003](roadmap.md#rm-003) | [IDEA-003](ideas.md#idea-003) | [#73](https://github.com/quasipapa/youtube-player/issues/73) | development infrastructure |
| [RM-004](roadmap.md#rm-004) | proven player foundation and [IDEA-001](ideas.md#idea-001) | [#22](https://github.com/quasipapa/youtube-player/issues/22) | separately versioned foundation |
| [RM-005](roadmap.md#rm-005) | [IDEA-001](ideas.md#idea-001), [IDEA-002](ideas.md#idea-002) | not yet actionable | none |

## Requirements, decisions and verification

| Requirements | Architectural context | Verification coverage |
| --- | --- | --- |
| [FR-001–FR-004](requirements/product.md#fr-001) | [runtime architecture](architecture/runtime.md), [ADR 0002](architecture/decisions/0002-minimum-wordpress-and-dynamic-rendering.md) | [functional coverage](testing/coverage.md#functional-requirements) |
| [FR-005–FR-010](requirements/product.md#fr-005) | [runtime architecture](architecture/runtime.md), [ADR 0003](architecture/decisions/0003-deferred-youtube-loading-and-consent.md) | [functional coverage](testing/coverage.md#functional-requirements) |
| [FR-011–FR-015](requirements/product.md#fr-011) | [layout architecture](architecture/layout.md) | [functional coverage](testing/coverage.md#functional-requirements) |
| [NFR-PRIV-001–008](requirements/privacy.md#nfr-priv-001) | [ADR 0003](architecture/decisions/0003-deferred-youtube-loading-and-consent.md), [ADR 0004](architecture/decisions/0004-same-origin-editor-preview.md) | [privacy coverage](testing/coverage.md#privacy-requirements) |
| [NFR-A11Y-001–008](requirements/accessibility.md#nfr-a11y-001) | [runtime architecture](architecture/runtime.md) | [accessibility coverage](testing/coverage.md#accessibility-requirements) |
| [NFR-001–008](requirements/quality.md#nfr-001) | [development architecture](architecture/development.md), [ADR 0005](architecture/decisions/0005-layered-quality-gate.md), [ADR 0006](architecture/decisions/0006-reproducible-allowlisted-release-package.md) | [quality coverage](testing/coverage.md#quality-requirements) |

The coverage matrix owns requirement-to-test mapping and known verification
gaps. Test suites are inventoried in [automated testing](testing/automated.md),
reusable human procedures are in
[manual acceptance](testing/manual-acceptance.md), and actual release results are
in the [release audits](audits/releases/index.md).
