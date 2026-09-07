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

Run the isolated PHP unit-test scaffold:

```bash
npm run test:php
```

The initial test bootstrap supplies only the small set of WordPress functions
needed to load the plugin. Later implementation steps will add the WordPress test
suite for integration tests.

Only use `npm run composer:update` when dependencies are intentionally being
updated. Commit the resulting `composer.lock`. The `vendor` directory is local
build output and is not committed.

## JavaScript and CSS build

The editable frontend sources live in `src`. Create optimized JavaScript and CSS
in the generated `build` directory with:

```bash
npm run build
```

For continuous rebuilding during development, use:

```bash
npm start
```

Run the JavaScript/CSS checks or apply the project formatting independently
with:

```bash
npm run lint:js
npm run lint:css
npm run format:check
npm run format
```

The WordPress formatter checks the supported JavaScript, JSON and YAML files
across the repository; the formatting command also applies safe Stylelint fixes
to the SCSS sources.

Do not edit files in `build` manually. The directory is ignored by Git and is
recreated from `src`; release packaging will run the production build before the
plugin ZIP is assembled.

The navigation icons use two public CSS custom properties so themes can adjust
their visual weight without replacing the SVGs:

```css
.ytpp-player {
	--ytpp-navigation-skip-icon-size: 1rem;
	--ytpp-navigation-step-icon-size: 1rem;
}
```

Both icon types default to the same size. Each button is `3rem` wide and `2rem`
high, while the two buttons in each outer group are separated by `0.75rem`. The
translated accessible name and tooltip remain on each icon-only button.

## Complete local verification

After installing both npm and Composer dependencies, run all currently available
format, lint, unit-test and production-build checks with one command:

```bash
npm run check
```

The PHP checks in this command use Docker. A shell that was opened before the
current user joined the `docker` group must be restarted or activated with
`newgrp docker` first.

`@wordpress/scripts` and all npm packages are development-only dependencies and
are not included in the plugin runtime or release ZIP. npm can currently report
upstream advisories in this toolchain even at its current pinned version. Review
updates through Dependabot; do not use `npm audit fix --force`, because npm
currently proposes an incompatible downgrade of `@wordpress/scripts`.

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

## Playlist input and block smoke test

After `npm run build` and `npm run env:start`, open the block editor and insert
the **YouTube Playlist Player** block from the Media category. Enter either this
agreed smoke-test playlist ID:

```text
OLAK5uy_mIGiJKnSXHRCdD6WbGjuZWNTpeXhIo2TU
```

or the corresponding playlist URL:

```text
https://youtube.com/playlist?list=OLAK5uy_mIGiJKnSXHRCdD6WbGjuZWNTpeXhIo2TU&si=xkRDc2cSiYN9u7jP
```

The editor accepts playlist IDs containing 10 to 100 ASCII letters, digits,
hyphens or underscores. It also extracts exactly one `list` parameter from
HTTP(S) URLs on these exact hosts:

- `youtube.com`, `www.youtube.com`, `m.youtube.com`, `music.youtube.com`
- `youtu.be`, `www.youtu.be`
- `youtube-nocookie.com`, `www.youtube-nocookie.com`

Other hosts, credentials, non-default ports, duplicate `list` parameters and
malformed IDs are rejected. Additional query parameters such as YouTube's `si`
tracking parameter are discarded when the canonical playlist ID is stored.

Select the block and enter the value in **Playlist settings** in the block
settings sidebar. For valid input, confirm that the block canvas shows the video
preview without YouTube player error 153 and displays the navigation bar below
it. The inspector explains that the preview makes an external connection. The
outer preview document is loaded from the local WordPress site and embeds its
player exclusively from `youtube-nocookie.com` to preserve the required HTTP
referrer inside Gutenberg's editor canvas.

Change the playlist setting, then use WordPress **Undo** and **Redo**. Confirm
that the playlist selection follows both commands. This was manually verified
during step 8.

Save the post, reload the editor and confirm that the canonical ID is retained.
Enable **Show playlist title above the video**, enter an editorial title and
confirm that it appears above the preview and above the frontend player. Disable
the setting again and confirm that the title is not rendered. This manually
entered title does not trigger a YouTube request.

View the post and confirm that a local consent message is shown. To test a fresh
consent state after previously agreeing, select **Forget saved consent for this
playlist** in the block inspector and reload the public page. Before selecting
**Load YouTube playlist**, use the browser network panel to confirm that no
YouTube request occurs. After selecting it, confirm that the first video appears
without autoplay and that the iframe uses `www.youtube-nocookie.com`. Reload the
page and confirm that this playlist now loads without asking again.

Also enter `invalid!` and confirm that both editor and frontend show the plugin's
validation message without rendering player controls or an external preview.

Finally, disable **Require consent before loading YouTube** and confirm that the
frontend loads the player without the local consent message. This mode is only
for sites where an external consent or content blocker handles YouTube requests.
The detailed behavior is documented in [privacy.md](privacy.md).

This validation is deliberately local and syntactic. A syntactically valid but
non-existent, private or unavailable playlist is not rejected while typing. For
a valid value, select **Check playlist availability** and confirm that the editor
first displays its checking state and then one of the available, unavailable or
not-clearly-determinable results. The additional IFrame API request must not occur
before the button is selected. Repeat the check with a syntactically valid but
unavailable ID and, with the network blocked, confirm that technical failure is
not mislabeled as an invalid playlist. The architectural limits are documented
in [ADR 0001](adr/0001-keyless-playlist-availability-check.md).

### Step 8a manual acceptance record

The keyless availability check was successfully tested with multiple existing
playlists and a syntactically valid unavailable ID. In Microsoft Edge, the
`youtube.com/iframe_api` request was blocked through **Network > Block request
URL**. The editor remained in the checking state until the defined timeout and
then correctly reported that availability could not be determined instead of
marking the playlist invalid. Trigger timing, messages and privacy notice were
accepted.

## Complete playlist-navigation smoke test

Use a playlist containing at least three playable videos. After granting consent,
confirm that the position initially reads **1 / n**, **First video** and
**Previous video** are disabled, and **Next video** and **Last video** are
enabled. Navigate to a middle video and verify that all four actions are enabled
and that the position changes. At the final video, **Next video** and **Last
video** must be disabled while both backward actions remain enabled.

Also test a playlist containing exactly one playable video. Its position must be
**1 / 1** and all four navigation actions must be disabled. Finally,
render two blocks on the same page and confirm that navigating one player does
not change the other player's position or controls. The labels and disabled
states must remain understandable with keyboard navigation and a screen reader.

These checks are the manual acceptance test for step 9. The automated tests mock
the YouTube IFrame API and cover the beginning, middle, end, single-video and
multiple-player cases without contacting YouTube.

### Step 9 manual acceptance record

The complete navigation smoke test was successfully performed in the local
WordPress instance. First, previous, next and last navigation, position and
boundary states, the single-video case, keyboard operation and labels behaved as
documented. Two blocks on the same page were also verified to navigate
independently.

### Post-step 9 layout and title acceptance record

The refined navigation layout was successfully checked in both the editor and
frontend. The `3rem` by `2rem` buttons, uniform `1rem` icons, `0.75rem` grouping,
outer alignment and centered short position were accepted. The optional manually
entered playlist title was also verified when enabled, after saving and when
disabled again.

### Step 8 manual acceptance record

The complete step 8 smoke test was successfully performed in the local WordPress
instance. The verified behavior includes block selection and inspector access,
an editor preview without player error 153, the visible editor navigation bar,
Undo/Redo, consent persistence after a public-page refresh, and removal of the
playlist-specific consent followed by the consent gate appearing again. The
previously verified syntax validation, privacy gate, no-cookie iframe, disabled
autoplay and external-content-blocker mode remain successful as well.

The editor script, block styles and frontend view script are declared in
`block.json`. WordPress therefore enqueues them for the relevant editor or only
when the block is rendered instead of loading player assets globally.

## Minimum-version WordPress instance

The separate `.wp-env.test.json` configuration uses the latest maintenance state
of the WordPress 6.1 branch with PHP 8.0 and port 8889:

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
