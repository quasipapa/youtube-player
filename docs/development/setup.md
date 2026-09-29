# Development setup

## Prerequisites

The development environment requires:

- WSL, with the repository stored in the WSL filesystem
- Git available inside WSL
- Docker Engine and Docker Compose available to the developer inside WSL
- Node.js and npm meeting the minimums in the
  [project version matrix](versions.md)

The developer must be able to run both the Docker CLI and Docker Compose from
the WSL shell. Project commands must not need a `sudo` prefix. Use one of the
official setup paths:

- With Docker Desktop, enable its
  [WSL 2 backend and integration for the development distribution](https://docs.docker.com/desktop/features/wsl/).
- With Docker Engine inside Linux, follow Docker's
  [post-installation steps for non-root access](https://docs.docker.com/engine/install/linux-postinstall/).

Membership in the `docker` group grants root-level privileges. Follow Docker's
security guidance and do not make the Docker socket world-writable.

Verify the prerequisites from the WSL shell:

```bash
git --version
docker --version
docker compose version
docker ps
node --version
npm --version
```

Expected result:

| Check | Required result |
| --- | --- |
| `git --version` | Git reports an installed version |
| `docker --version` | The Docker CLI reports an installed version |
| `docker compose version` | The Compose plugin reports an installed version |
| `docker ps` | The command succeeds without `sudo` and without a daemon permission error; an empty container list is valid |
| `node --version` | Meets the Node.js minimum in the [version matrix](versions.md) |
| `npm --version` | Meets the npm minimum in the [version matrix](versions.md) |

The project does not currently declare a minimum Docker or Git version. Use a
maintained release compatible with the selected WSL setup.

## Project dependencies

Install the locked JavaScript and PHP development dependencies:

```bash
npm ci
npm run composer:install
```

Expected result: `npm ci` recreates `node_modules/` from `package-lock.json`.
The Composer command creates or updates `vendor/` from `composer.lock`.

PHP and Composer are not required on the host. `scripts/composer.sh` declares
the Composer container version recorded in the
[version matrix](versions.md) and runs Composer in that container. Developers
do not need to pin or configure this version themselves. Docker downloads the
image on first use if it is not already available. Changing the Composer version
is a reviewed project change to that script.

Do not edit `node_modules/`, `vendor/` or `build/`.

### Intentional dependency updates

For normal setup and after switching branches, use `npm ci`.

To preserve the dependency graph recorded in `package-lock.json`, do not use an
unqualified `npm install` for normal installation. Use `npm ci` instead. It
fails when `package.json` and the lockfile disagree.

For an intentional dependency update, perform the applicable action:

| Dependency type | Action |
| --- | --- |
| Direct npm development dependency | Run `npm install --save-dev --save-exact <package>@<version>` and retain the resulting changes to `package.json` and `package-lock.json` |
| Transitive npm dependency | Update the direct dependency that introduces it; if the project uses an `overrides` entry, update that exact value and run `npm install --package-lock-only` |
| Composer development dependency | Run `npm run composer:update -- <vendor/package>`; omit the package name only when all Composer dependencies should be updated |
| GitHub Action | Replace the action revision with the reviewed release's full commit SHA and update its version comment |
| Composer container image | Update every matching version reference in the wrapper, CI configuration, browser fixtures and documentation |

Inspect the resulting manifest and lockfile diff. Then recreate the local
installation and run the project gates:

```bash
npm ci
npm run composer:install
npm run check:docs
npm run test:local
```

Expected result: installation from the updated lockfiles succeeds. The
documentation check and complete local quality gate pass.

The required security review, Dependabot handling, CI checks and release rules
are defined in [maintenance](../operations/maintenance.md).

## WordPress environments

No separate WordPress installation or manual WordPress configuration is
required. The locally installed [`@wordpress/env`](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-env/)
package provisions WordPress, its database and the configured PHP runtime in
Docker. It also maps this repository into the WordPress plugin directory.

### Daily development environment

Start the development site:

```bash
npm run env:start
```

On the first run, `wp-env` downloads and initializes the required Docker images
and WordPress sources. `.wp-env.json` configures:

| Setting | Value or behavior |
| --- | --- |
| WordPress | Current production release selected by `wp-env` when the environment is provisioned |
| PHP | Configured daily-environment version in the [version matrix](versions.md) |
| URL | <http://localhost:8888> |
| Plugin mapping | Repository root → `wp-content/plugins/yt-playlist-player` |
| Startup action | Activate `yt-playlist-player` |
| Debugging | `WP_DEBUG` and `SCRIPT_DEBUG` enabled |

Expected result: the command reports that WordPress is running. The site and
administration area respond at <http://localhost:8888>. The local-only initial
login is `admin` / `password`.

Use these commands to manage the daily environment:

| Command | Purpose and expected result |
| --- | --- |
| `npm run env:status` | Show whether the WordPress containers are running and list their ports |
| `npm run env:logs` | Print the current environment logs once and then exit |
| `npm run env:stop` | Stop the containers while retaining the site database for the next start |
| `npm run env:reset` | Delete the site's content and settings, then restore a clean WordPress database |
| `npm run env:destroy` | After confirmation, remove the environment's containers, networks, volumes, images and generated files; the next start provisions it again |

`env:reset` and `env:destroy` discard local site data.

### Isolated test environment

Start the environment used by the complete local quality gate:

```bash
npm run env:test:start
```

`.wp-env.test.json` creates an independent site with the WordPress and PHP
integration versions in the [version matrix](versions.md) and port 8889. It
installs and activates Plugin Check and activates this plugin.

Expected result: the isolated WordPress site responds at
<http://localhost:8889>. Its initial login is also `admin` / `password`.

Stop it after inspection or testing:

```bash
npm run env:test:stop
```

Expected result: the test containers stop. Their stored site data remains
available for the next start.

The test environment is newer than the declared WordPress minimum because the
current Plugin Check integration requires a newer installation. Compatibility
with the declared PHP minimum is checked statically and in CI. Direct runtime
coverage of the WordPress minimum remains a documented future idea. The
[version matrix](versions.md) lists the concrete boundaries.

## Browser for manual testing

Use a normal desktop browser to open the daily development site at
<http://localhost:8888>. No Playwright installation is required for manual
testing. Use the local credentials only for these disposable development
environments.

The isolated site at <http://localhost:8889> can also be opened manually while
it is running. Reserve it for reproducing the automated environment or
inspecting a failed quality-gate run. Manual acceptance procedures are in the
[manual acceptance checks](../testing/manual-acceptance.md).

## Browser for automated testing

The **complete local quality gate** is the `npm run test:local` command described
in the [development workflow](workflow.md). It starts the isolated WordPress
site and runs Plugin Check plus every Playwright suite.

By default, the gate starts the Playwright version from the
[version matrix](versions.md) in the matching official Docker image. It connects
that browser server to the test site on port 8889. No browser installation is
required in WSL or on the Windows host. The temporary Playwright container is
removed when the script exits.

To run Playwright directly in WSL instead, install Chromium and its system
dependencies:

```bash
npx playwright install chromium
npx playwright install-deps chromium
```

Expected result: the Playwright version installed in `node_modules/` has a
matching local Chromium executable and the required Linux libraries. The system
dependency command may request administrative permission.

Start the isolated WordPress environment and pass its URL when running all
browser suites locally:

```bash
npm run env:test:start
WP_E2E_BASE_URL=http://localhost:8889 npm run test:browser
```

Expected result: the production assets build and all Playwright suites pass in
headless Chromium. `WP_E2E_BASE_URL` enables the WordPress editor and frontend
integration suite; without it, that suite is skipped.

For an existing remote Playwright server, set `PW_TEST_CONNECT_WS_ENDPOINT`.
Set `WP_E2E_BASE_URL` as well when the WordPress test site is not available at
<http://localhost:8889>.

## IDE setup

Any IDE may be used if it can work with a project stored in WSL. Configure the
IDE so that its version-control integration, terminal, tasks and run
configurations all use the same WSL distribution as the repository.

The IDE must use:

- the Git executable installed in WSL
- the Node.js runtime installed in WSL
- the npm installation associated with that WSL Node.js runtime

Do not run project commands with Windows installations of Git, Node.js or npm.
Mixing Windows and WSL tools can produce different paths, permissions,
line endings and dependency binaries.

Examples:

- JetBrains IDEs can be configured to use
  [Git from WSL](https://www.jetbrains.com/help/idea/set-up-a-git-repository.html)
  and a [Node.js runtime from WSL](https://www.jetbrains.com/help/idea/developing-node-js-applications.html).
- Visual Studio Code can open the repository through its
  [WSL development support](https://code.visualstudio.com/docs/remote/wsl).
  Extensions, terminals and project commands then run in the selected WSL
  distribution.

Verify the configuration in the IDE's integrated terminal:

```bash
command -v git
command -v node
command -v npm
node --version
npm --version
```

Expected result: all three executable paths are Linux paths inside WSL. The
Node.js and npm versions satisfy the minimum versions documented under
[prerequisites](#prerequisites).

Where supported, mark `node_modules`, `vendor`, `build`, `dist` and `coverage`
as excluded directories. Shared formatting rules come from `.editorconfig` and
the repository commands; IDE-specific formatting is not authoritative.
