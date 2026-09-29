# Test strategy

The quality model uses the cheapest reliable layer for each risk and keeps a
manual layer for external services and human perception.

| Layer | Purpose | Main entry point |
| --- | --- | --- |
| Formatting/static analysis | source consistency, PHP compatibility and standards | `npm run check` |
| PHP/Jest unit tests | parsing, sizing, rendering and browser-controller logic | `npm run test:php`, `npm run test:js` |
| WordPress integration | registration, persistence and public privacy gate | `npm run test:local` |
| Plugin Check | production package policy checks | `npm run test:plugin-check` |
| Playwright | browser, responsive and accessibility behavior | `npm run test:browser` |
| Manual acceptance | real YouTube, screen reader, themes and site consent manager | [manual checklist](manual-acceptance.md) |

- Unit and browser doubles must not be represented as proof that YouTube content
  is available.
- Axe checks plugin-owned DOM but not the third-party iframe and is not a
  complete accessibility assessment.
- Static PHP checks support the declared PHP minimum. The isolated WordPress
  environment uses the configured integration PHP version.
- Current environment boundaries are listed in the
  [version matrix](../development/versions.md).
- JavaScript tests intentionally remain on Jest for now. Scripts 36 runs them
  through the maintenance-only `test-unit-jest` adapter with the repository's
  explicit Jest and Babel configuration; a separate issue evaluates a later
  Vitest migration.
- Requirement-level test responsibility and known gaps are maintained in the
  [coverage matrix](coverage.md).
