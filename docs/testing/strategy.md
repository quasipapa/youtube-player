# Test strategy

The quality model uses the cheapest reliable layer for each risk and keeps a
manual layer for external services and human perception.

| Layer | Purpose | Main entry point |
| --- | --- | --- |
| Formatting/static analysis | source consistency, PHP compatibility and standards | `npm run check` |
| PHP unit tests | parsing, sizing, rendering and preview logic | `npm run test:php` |
| Vitest jsdom project | unit tests with DOM doubles, fake timers and module resets | `npm run test:js` |
| Vitest Browser Mode | isolated React component tests in real Chromium | `npm run test:js:browser` |
| WordPress integration | registration, persistence and public privacy gate | `npm run test:local` |
| Plugin Check | production package policy checks | `npm run test:plugin-check` |
| Playwright | WordPress E2E, responsive and accessibility behavior | `npm run test:browser` |
| Manual acceptance | real YouTube, screen reader, themes and site consent manager | [manual checklist](manual-acceptance.md) |

- Unit and browser doubles must not be represented as proof that YouTube content
  is available.
- Axe checks plugin-owned DOM but not the third-party iframe and is not a
  complete accessibility assessment.
- Static PHP checks support the declared PHP minimum. The isolated WordPress
  environment uses the configured integration PHP version.
- Current environment boundaries are listed in the
  [version matrix](../development/versions.md).
- JavaScript tests run on Vitest 5 through `wp-scripts test-unit-js` with the
  project-owned `vitest.config.mjs`. Tests import `describe`, `it`, `expect`
  and `vi` explicitly; JSX-bearing sources use `.jsx`. ESLint rules for tests
  come from `@vitest/eslint-plugin`.
- The Vitest config defines two projects (pilot outcome of
  [issue #80](https://github.com/quasipapa/youtube-player/issues/80)):
  - **jsdom** (`npm run test:js`): logic and DOM-controller tests that rely on
    fake timers, `localStorage`, module resets (`vi.resetModules` + dynamic
    import) and the console guard in `tests/vitest/setup.js`. Style imports
    are mocked (`tests/vitest/style-mock.js`).
  - **browser** (`npm run test:js:browser`): files matching
    `src/**/*.browser.test.{js,jsx}`, executed in real Chromium through the
    Playwright provider (`@vitest/browser-playwright`). Currently the editor
    component suite `src/edit.browser.test.jsx`. The browser server is taken
    from `PW_TEST_CONNECT_WS_ENDPOINT` when set (the Docker server used by
    `scripts/local-tests.sh`), otherwise Vitest launches a local Chromium.
    Real styles load in this project; only the React cleanup setup applies.
  - `@playwright/test` remains the runner for WordPress, frontend,
    responsive and accessibility end-to-end tests; no E2E scenario was moved.
- Pilot comparison: the 12 editor component tests passed in jsdom (part of the
  ~2.5 s jsdom run) and in real Chromium (5.5 s wall time including browser
  start, 0.12 s test time). The jsdom project stays the default for `test:js`
  and CI's JavaScript job; the browser project runs via `test:js:browser`
  inside `npm run test:local`, reusing the existing Playwright Docker server.
  Decision: component rendering tests live in Browser Mode, timer- and
  module-state-heavy controller tests stay in jsdom.
- Requirement-level test responsibility and known gaps are maintained in the
  [coverage matrix](coverage.md).
