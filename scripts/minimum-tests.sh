#!/bin/sh

# Minimum-platform integration lane: runs the WordPress E2E suite against the
# declared WordPress and PHP minimums from .wp-env.minimum.json. Plugin Check is
# not part of this lane because it requires a newer WordPress installation.

set -eu

project_root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
container_name="ytpp-playwright-minimum-$$"
config=.wp-env.minimum.json
base_url=http://localhost:8890

# Keep wp-env's generated Docker configuration inside the project when the
# quality gate runs in a restricted or disposable WSL environment.
export WP_ENV_HOME="${WP_ENV_HOME:-$project_root/.wp-env-home}"

cd "$project_root"

. "$project_root/scripts/playwright-server.sh"

npm run build
npm run env:minimum:start

# Fail if the environment does not run the configured minimum versions, so the
# lane cannot silently test a different platform.
expected_wp=$(node -p "require('./$config').core.match(/#([\d.]+)-branch\$/)[1]")
expected_php=$(node -p "require('./$config').phpVersion")
actual_wp=$("$project_root/node_modules/.bin/wp-env" run --config="$config" cli \
	wp core version 2>/dev/null | tail -n 1)
actual_php=$("$project_root/node_modules/.bin/wp-env" run --config="$config" cli \
	php -r 'echo PHP_MAJOR_VERSION . "." . PHP_MINOR_VERSION;' 2>/dev/null | tail -n 1)
printf 'Minimum lane: WordPress %s (expected %s.x), PHP %s (expected %s)\n' \
	"$actual_wp" "$expected_wp" "$actual_php" "$expected_php"
case "$actual_wp" in
	"$expected_wp" | "$expected_wp".*) ;;
	*)
		printf '%s\n' "WordPress $actual_wp does not match minimum $expected_wp." >&2
		exit 1
		;;
esac
if [ "$actual_php" != "$expected_php" ]; then
	printf '%s\n' "PHP $actual_php does not match minimum $expected_php." >&2
	exit 1
fi

if [ -n "${PW_TEST_CONNECT_WS_ENDPOINT:-}" ]; then
	WP_E2E_BASE_URL="$base_url" npx playwright test tests/e2e
	exit 0
fi

trap 'stop_playwright_server "$container_name"' EXIT HUP INT TERM

start_playwright_server "$container_name" 9324

WP_E2E_BASE_URL="$base_url" \
	PW_TEST_CONNECT_WS_ENDPOINT=ws://127.0.0.1:9324/ \
	npx playwright test tests/e2e
