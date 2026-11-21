#!/bin/sh

set -eu

project_root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
container_name="ytpp-playwright-local-$$"

# Keep wp-env's generated Docker configuration inside the project when the
# quality gate runs in a restricted or disposable WSL environment.
export WP_ENV_HOME="${WP_ENV_HOME:-$project_root/.wp-env-home}"

cd "$project_root"

. "$project_root/scripts/playwright-server.sh"

npm run composer:install
npm run env:test:start
YTPP_WP_ENV_CONFIG=.wp-env.test.json npm run check
npm run test:plugin-check

if [ -n "${PW_TEST_CONNECT_WS_ENDPOINT:-}" ]; then
	WP_E2E_BASE_URL="${WP_E2E_BASE_URL:-http://localhost:8889}" npm run test:browser
	PW_TEST_CONNECT_WS_ENDPOINT="$PW_TEST_CONNECT_WS_ENDPOINT" npm run test:js:browser
	exit 0
fi

trap 'stop_playwright_server "$container_name"' EXIT HUP INT TERM

start_playwright_server "$container_name" 9323

WP_E2E_BASE_URL=http://localhost:8889 \
	PW_TEST_CONNECT_WS_ENDPOINT=ws://127.0.0.1:9323/ \
	npm run test:browser

PW_TEST_CONNECT_WS_ENDPOINT=ws://127.0.0.1:9323/ npm run test:js:browser
