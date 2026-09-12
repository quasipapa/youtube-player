# Dependency audit for issue #63

Audit date: 12 September 2026. The audit was performed on branch
`codex/issue-63` after a clean `npm ci`. The project requires Node.js 20 or
newer and npm 10 or newer; the available runner used Node.js 22.22.1 and npm
10.9.9. The GitHub alert list was queried from the default branch at the start
of the work.

## Dependabot alerts at work start

| Alert | Advisory | Severity | Package and installed version | Fixed version or disposition |
| ---: | --- | --- | --- | --- |
| 13 | GHSA-vwc7-r8mq-g2x9 / CVE-2026-76845 | medium | `adm-zip` 0.6.0 | Override to 0.6.1 |
| 12 | GHSA-7pqw-9j4j-h8q3 / CVE-2026-19693 | high | `extract-zip` 2.0.1 | No patched npm release; mitigated and tracked |
| 11 | GHSA-jmr9-qjv8-65gv / CVE-2026-56876 | high | `extract-zip` 2.0.1 | No patched npm release; mitigated and tracked |
| 10 | GHSA-v245-v573-v5vm / CVE-2026-59887 | high | `linkify-it` 3.0.3 | Override to 5.0.2 |
| 8 | GHSA-6v5v-wf23-fmfq / CVE-2026-48988 | medium | `markdown-it` 12.3.2 | Override to 14.2.0 |
| 6 | GHSA-qj8w-gfj5-8c6v / CVE-2026-34043 | medium | `serialize-javascript` 6.0.2 | Override to 7.0.5 |
| 5 | GHSA-w5hq-g745-h8pq / CVE-2026-41907 | medium | `uuid` 8.3.2 | `sockjs`-scoped override to 11.1.1 |
| 4 | GHSA-5c6j-r48x-rmvq | high | `serialize-javascript` 6.0.2 | Covered by the 7.0.5 override |
| 3 | GHSA-7r86-cg39-jmmj / CVE-2026-27903 | high | `minimatch` 3.0.8 | `markdownlint-cli`-scoped override to 3.1.5 |

The paths were confirmed with `npm explain`: `adm-zip` is used by
`@wordpress/env` and `@wordpress/scripts`; `extract-zip` is reached through
the Puppeteer/Lighthouse end-to-end tooling; Markdown packages are reached
through `markdownlint-cli`; `serialize-javascript` is reached through
`copy-webpack-plugin`; and `uuid` is reached through `sockjs` in the webpack
development server. The packages are development-only and are not copied by
the production ZIP allowlist.

## Decisions and mitigations

The compatible fixes are expressed as narrowly scoped npm overrides. No
WordPress package was downgraded, no major toolchain upgrade was taken, and no
runtime source file was changed. `markdown-it`, `linkify-it`, and
`serialize-javascript` retain their established tool roles; the quality gate
and production build are required to validate those compatibility assumptions.

`extract-zip` 2.0.1 is still the newest available release and has no patched
version for the two open advisories. The affected code is only reached by the
development Puppeteer/Lighthouse path. CI does not extract user-supplied
archives, the plugin runtime does not depend on the package, and the release
ZIP excludes all development dependencies. The alert must remain open and be
rechecked when `extract-zip` or its Puppeteer consumer publishes a fix; an npm
override to an unverified fork is deliberately not used.

## Verification records

`npm audit --omit=dev` reports zero runtime vulnerabilities before and after
the change. The full development audit still reports transitive findings in
the Lighthouse/Sentry/OpenTelemetry test stack and the unfixed `extract-zip`
path; these are development-only, individually traceable with `npm explain`,
and are not silently dismissed. The final PR must attach the exact audit
output, complete quality-gate output, ZIP allowlist check, and the post-merge
Dependabot status.

`npm ls --all` has no missing packages, but returns the pre-existing invalid
React and React-DOM peer declarations from
`@wordpress/block-editor` → `react-autosize-textarea@7.1.0` (the latter only
declares peers up to React 16 while the WordPress toolchain installs React
18.3.1). This is unrelated to the audited packages and is unchanged by this
patch; the complete quality and browser suites pass with the resolved tree.
