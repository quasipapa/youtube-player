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

## PHP quality tools

Composer runs in the pinned `composer:2.9.5` Docker image, so no host PHP or
Composer installation is required. Install the locked development dependencies:

```bash
npm run composer:install
```

Run PHP syntax, WordPress Coding Standards, and PHP 8.0+ compatibility checks:

```bash
npm run lint:php
```

Apply automatically fixable PHP coding-style changes:

```bash
npm run format:php
```

Only use `npm run composer:update` when dependencies are intentionally being
updated. Commit the resulting `composer.lock`. The `vendor` directory is local
build output and is not committed.

## Development WordPress instance

Start the current stable WordPress version with PHP 8.3:

```bash
npm run env:start
```

Open <http://localhost:8888>. The initial local credentials provided by `wp-env`
are:

```text
Username: admin
Password: password
```

The source checkout may retain the GitHub directory name
`youtube-playlist-player`. Both wp-env configurations explicitly mount it as
`wp-content/plugins/yt-playlist-player`, which is the plugin's canonical slug,
and activate it after startup.

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

For the standard rootful Docker Engine setup, create the `docker` group if needed
and add the current WSL user:

```bash
sudo groupadd --force docker
sudo usermod -aG docker "$USER"
newgrp docker
docker run --rm hello-world
```

If WSL reports `newgrp: command not found`, install the package that provides the
command and repeat `newgrp docker`:

```bash
sudo apt install util-linux-extra
newgrp docker
```

`newgrp` activates the group in a child shell. To apply the membership to all WSL
processes, close the WSL sessions and run `wsl --shutdown` from Windows PowerShell,
then reopen the distribution. If the Docker service does not start automatically,
start it once with `sudo systemctl start docker`.

Do not make `/var/run/docker.sock` world-writable with `chmod 666`. Membership in
the `docker` group already grants root-equivalent access through the Docker daemon
and should only be given to trusted users. Docker Rootless mode is the more
isolated alternative but requires a separate daemon setup and is not part of the
initial project configuration.

If Docker reports that `~/.docker/config.json` is owned by root because earlier
commands used `sudo`, repair the ownership without deleting the configuration:

```bash
sudo chown "$USER":"$USER" "$HOME/.docker" -R
sudo chmod g+rwx "$HOME/.docker" -R
```

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

The current WSL installation has Node.js 22.22.1 and npm 10.9.9. This satisfies
the engine requirements of the selected `@wordpress/env` dependency.

Docker access without `sudo` was enabled after installing `util-linux-extra` for
the missing `newgrp` command and activating the `docker` group. The first
`npm run env:start` attempt then reached the WordPress image build but failed at
`apt-get -qy install $PHPIZE_DEPS` with exit code 100.

The detailed log initially suggested a stale Docker layer because the package
index requested `libc-dev-bin_2.31-13+deb11u14_amd64.deb`, which returned HTTP
404. A second build with `--pull --no-cache` fetched a fresh Bullseye security
index but received the same broken package reference. The issue therefore belongs
to the retired Debian Bullseye base used by the `wordpress:php8.0` development
image, rather than to the plugin or the local Docker cache.

The normal development environment consequently uses PHP 8.3, the current
WordPress recommendation. PHP 8.0 remains the plugin's declared minimum and is
kept in `.wp-env.test.json`; minimum-version compatibility will also be covered by
the CI matrix without making the daily local environment depend on the old image.
The PHP 8.3 development stack was subsequently started successfully with
`npm run env:start`.

PHP and Composer are not currently available directly in WSL. Their installation
or a documented Docker-based Composer workflow will be decided when the PHP test
toolchain is added.
