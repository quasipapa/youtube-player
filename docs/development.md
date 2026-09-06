# Development environment

## Requirements

- WSL with Docker Engine
- Node.js 20 or later
- npm 10.2.3 or later

The repository should remain in the WSL filesystem for predictable file
permissions and better Docker performance.

Verify the tools from a WSL terminal:

```bash
docker --version
docker compose version
docker ps
node --version
npm --version
```

## Install dependencies

Use the lockfile for reproducible installations:

```bash
npm ci
```

Do not edit files inside `node_modules`.

## Development WordPress instance

Start the current stable WordPress version with PHP 8.0:

```bash
npm run env:start
```

Open <http://localhost:8888>. The initial local credentials provided by `wp-env`
are:

```text
Username: admin
Password: password
```

Useful commands:

```bash
npm run env:status
npm run env:logs
npm run env:stop
npm run env:reset
npm run env:destroy
```

`env:reset` recreates WordPress data. `env:destroy` removes the environment for
this project. Do not use either command when local test content must be retained.

## Minimum-version WordPress instance

The separate `.wp-env.test.json` configuration uses the latest maintenance state
of the WordPress 6.0 branch with PHP 8.0 and port 8889:

```bash
npm run env:test:start
npm run env:test:stop
```

The development and minimum-version instances use separate configurations. Check
their status before assuming which site is available.

## Docker permissions

If `docker ps` reports a permission error in a normal WSL terminal, verify that
the Docker daemon is running and that the current user can access its socket.
After changing group membership, close all WSL sessions or restart WSL before
testing again.

## IntelliJ

Configure Git and Node.js from the WSL distribution rather than from a separate
Windows installation. Mark these generated directories as excluded when they
appear:

- `node_modules`
- `build`
- `dist`
- `coverage`

Project-specific IntelliJ metadata is intentionally ignored. Shared formatting
rules are defined in `.editorconfig` and will later be enforced by the project
linters.

## Known bootstrap requirements

The current WSL installation has Node.js 22.22.1 and npm 9.2.0. The selected
`@wordpress/env` dependency requires npm 10.2.3 or later. Upgrade npm before M0 is
considered complete, then run `npm ci` again and confirm that no engine warning is
reported.

PHP and Composer are not currently available directly in WSL. Their installation
or a documented Docker-based Composer workflow will be decided when the PHP test
toolchain is added.
