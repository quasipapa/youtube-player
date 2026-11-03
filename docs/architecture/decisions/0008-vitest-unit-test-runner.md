# ADR 0008: Migrate the JavaScript unit suite from Jest to Vitest 5

- Status: Accepted
- Date of decision: 2026-11-01
- Evidence: project owner decision recorded in [issue #79](https://github.com/quasipapa/youtube-player/issues/79)
- Affected requirements: [NFR-005](../../requirements/quality.md#nfr-005),
  [NFR-006](../../requirements/quality.md#nfr-006)

## Context

`@wordpress/scripts` 36+ runs `test-unit-js` on Vitest and keeps Jest only as
the maintenance-only `test-unit-jest` adapter. The project previously pinned
Jest 30 plus `@wordpress/jest-preset-default` and Babel explicitly to keep the
87-test suite on the adapter. Vitest 5 and Vite 7/8 are the actively developed
test path of the WordPress toolchain.

## Decision

Run the unit suite on Vitest 5 through `wp-scripts test-unit-js` with a
project-owned `vitest.config.mjs`:

- jsdom environment; browser globals, `@testing-library/react` cleanup and
  the former `@wordpress/jest-console` guard live in `tests/vitest/setup.js`.
- SCSS imports resolve to `tests/vitest/style-mock.js`.
- Tests import `describe`, `it`, `expect`, hooks and `vi` explicitly from
  `vitest`; JSX-bearing sources use the `.jsx` extension because Vite 8/oxc
  does not parse JSX in `.js` files.
- `@wordpress/*` packages are inlined (`server.deps.inline`) so `vi.mock`
  applies to their named exports; mocks that are invoked with `new` (the
  `YT.Player` doubles) use `function` implementations because Vitest warns
  about arrow implementations used as constructors.
- ESLint test rules come from `@vitest/eslint-plugin`; the retired Jest
  dependencies (`jest`, `babel-jest`, `jest-environment-jsdom`,
  `@wordpress/jest-preset-default`, `eslint-plugin-jest`, `@babel/core`,
  `@wordpress/babel-preset-default`) are removed.

## Rationale

- Follows the supported WordPress toolchain path instead of a maintenance
  adapter; Vitest is tightly integrated with the Vite 7/8 already used by the
  build.
- Runtime: the full suite (87 tests, 7 files) completes in about 2.5 s locally,
  comparable to the previous Jest run (about 3.5 s).
- Maintainability: one runner for transform and tests, explicit imports
  instead of injected globals, and the console-failure contract preserved via
  a local setup file. Playwright E2E, responsive and accessibility suites are
  unchanged; a separate pilot (issue #80) evaluates Vitest Browser Mode for
  selected component tests.
- CI stability: `test:js` is a drop-in replacement in `npm run check` and CI;
  no workflow changes were required.

## Consequences

- New unit tests must import from `vitest` explicitly and use `.jsx` when they
  contain JSX.
- The jsdom-based suite is not proof of real-browser behavior; that remains
  covered by the Playwright suites.
