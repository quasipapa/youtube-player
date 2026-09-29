# ADR 0005: Use a layered, reproducible quality gate

- Status: Accepted – documented retrospectively
- Date of decision: 2026-09-08
- Evidence: commits `49204b0`, `67b30f0`; `.github/workflows/ci.yml`
- Affected requirements: [NFR-006](../../requirements/quality.md#nfr-006),
  [NFR-A11Y-008](../../requirements/accessibility.md#nfr-a11y-008)

## Context

Static checks alone cannot verify a dynamic WordPress block, consent-related
network behavior, responsive layout or browser focus. Browser tests alone are
slow and do not cover both supported PHP boundaries efficiently.

## Decision

Combine formatting and static analysis, PHP compatibility-boundary unit checks,
JavaScript unit tests, translation reproducibility, a WordPress integration
environment, Plugin Check, Playwright browser suites and focused manual
acceptance. Lock dependency versions and make the complete local gate executable
with `npm run test:local`. The current boundaries are listed in the
[version matrix](../../development/versions.md).

## Alternatives considered

- One monolithic browser suite.
- Only linters and unit tests.
- CI-only checks with no equivalent local entry point.

## Consequences

Failures are detected at the cheapest relevant layer and critical flows run in
WordPress and a real browser. The full gate uses Docker and is intentionally
heavier; issue #73 will evaluate a safe fast path for documentation-only changes.
Manual screen-reader and site-specific privacy assessment remain human checks.
