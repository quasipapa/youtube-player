# AGENTS.md — YouTube Playlist Player (WordPress plugin)

> Entry point for coding agents (Vibe, Codex and others). Intentionally short:
> it references the binding documents instead of duplicating them.
> Authoritative documentation overview: [docs/index.md](docs/index.md),
> including the [Working with AI assistance](docs/index.md#working-with-ai-assistance)
> reading path.

## Project

WordPress plugin **YouTube Playlist Player** (v0.1.0, alpha): a Gutenberg block
`yt-playlist-player/player` for navigating a YouTube playlist. The block is
dynamically rendered via `src/render.php`; YouTube is contacted only after the
consent gate is accepted.

- **Language for code, comments, commits and documentation**: English (the
  legacy root file `ANFORDERUNGEN-UND-UMSETZUNGSPLAN.md` stays German as a
  historical entry point).
- **Target platform**: WordPress ≥ 6.1, PHP ≥ 8.0 — exact values and the CI
  matrix in the [version matrix](docs/development/versions.md).
- **License**: GPL-2.0-or-later.

## Binding guidelines (read first)

1. **[Documentation policy](docs/documentation-policy.md)** (binding): document
   roles, stable IDs (`FR-NNN`, `IDEA-NNN`, ADR anchors), per-change update
   rules and the PR documentation questions apply to every change, including
   agent-made ones.
2. **[SECURITY.md](SECURITY.md)**: never report vulnerabilities as public
   issues; use private reporting.
3. **[PR template](.github/pull_request_template.md)**: answer the
   documentation-impact questions.
4. **[docs/index.md](docs/index.md)**: role-based reading paths; an agent
   follows the path of the role it performs (for example plugin developer).

## Project structure

```text
yt-playlist-player.php   Plugin bootstrap: header, YTPP_VERSION, block registration, AJAX editor preview
src/                     Editable block sources: edit.js/view.js, SCSS, block.json, render.php
includes/                PHP helper classes (playlist parser, player sizing, editor preview)
assets/js/               Editor preview controller
languages/               Text domain yt-playlist-player; de_DE PO editable, POT/MO/JSON generated
tests/                   PHPUnit (tests/unit) + Playwright (e2e, responsive, accessibility)
scripts/                 Build, CI, documentation and i18n scripts
docs/                    Binding project documentation (entry point: docs/index.md)
.github/workflows/       ci.yml (PRs and pushes to main), release.yml (tag v*)
build/, dist/            Generated artifacts — never edit directly
node_modules/, vendor/   Dependencies — never edit directly
```

## Working rules for agents

- **Never edit directly**: `node_modules/`, `vendor/`, `build/`, `dist/` and the
  generated translation catalogs. Changes belong in `package.json` /
  `composer.json` plus the lockfile, or in the source files
  ([setup](docs/development/setup.md),
  [development architecture](docs/architecture/development.md)).
- **WSL rule**: the repository lives in the WSL filesystem; use Git, Node.js,
  npm and Docker only from WSL and without `sudo` — never Windows tools
  ([docs/development/setup.md](docs/development/setup.md)).
- **No changes without tests**: existing tests must stay green; new features and
  bugfixes come with test coverage. Layers in the
  [test strategy](docs/testing/strategy.md).
- **WordPress conventions**: WordPress Coding Standards (`phpcs.xml.dist`),
  sanitizing/escaping on output, nonces + capability checks on input.
- **Documentation in the same change**: apply the
  [document update rules](docs/documentation-policy.md#document-update-rules);
  `npm run check:docs` must pass.
- **Keep versions consistent**: `package.json`, the plugin header in
  `yt-playlist-player.php`, the `YTPP_VERSION` constant and `readme.txt` must
  agree; the release tag is the version with a leading `v`
  ([workflow](docs/development/workflow.md#change-completion)).
- **i18n**: text domain `yt-playlist-player`; commit the PO file together with
  the generated POT, MO and JSON catalogs (`npm run i18n:generate`,
  `npm run i18n:check`).
- **Privacy invariants** (details: [privacy requirements](docs/requirements/privacy.md),
  [ADR 0003](docs/architecture/decisions/0003-deferred-youtube-loading-and-consent.md)):
  use `youtube-nocookie.com`, contact no YouTube or Google resource before an
  accepted activation, and never turn invalid input into an embed URL.
- **Security**: no secrets, tokens or private playlist IDs in commits or issues;
  report vulnerabilities only via [SECURITY.md](SECURITY.md).
- **No force-push, no direct commits on `main`** — changes go through PRs with
  a green CI gate.

## Commands

| Task | Command |
| --- | --- |
| Install dependencies | `npm ci` && `npm run composer:install` |
| Start dev site | `npm run env:start` (then http://localhost:8888, login `admin` / `password`) |
| Format/lint checks | `npm run format:check`, `npm run lint:js`, `npm run lint:css`, `npm run lint:php` |
| Unit tests | `npm run test:php`, `npm run test:js` |
| Docs, version and CI contract checks | `npm run check:docs`, `npm run check:versions`, `npm run test:ci` |
| Combined source gate | `npm run check` |
| Complete local quality gate (wp-env + Plugin Check + all Playwright suites) | `npm run test:local` |
| Production build | `npm run build` |
| Browser tests | `npm run test:browser` (or `test:responsive`, `test:accessibility`) |

All commands run in WSL. CI: `.github/workflows/ci.yml` on every PR and push to
`main` (change classes `docs-only` / `metadata` / `full`; the required check is
the **CI gate** job — see [docs/operations/ci.md](docs/operations/ci.md)).
Releases: a `v*` tag triggers `release.yml`
([docs/operations/releases.md](docs/operations/releases.md)).

## Definition of done for agent tasks

1. `npm run check` green; for code, test or dependency changes additionally
   `npm run test:local` green.
2. Coding standards pass without new errors.
3. Documentation updated per the documentation policy; `npm run check:docs` green.
4. PR template including the documentation-impact questions answered.
5. Commit message explains *why*, not just *what*.

## Git workflow

- Feature branch per task: `feature/<short-description>` (Dependabot branches
  are named `dependabot/...`).
- PR against `main`; the required status check is the **CI gate**; the
  maintainer merges after green CI. Force-push only with explicit
  authorization.
- Releases: the maintainer pushes a `v<version>` tag; `release.yml` runs the
  complete quality gate, builds the ZIP + SHA-256 and publishes the GitHub
  release.
