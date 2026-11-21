# shellcheck shell=sh
# Shared Playwright browser server for the local quality gates. Source this
# file; it defines functions only. The version must match @playwright/test in
# package.json (verified by npm run check:docs).

playwright_version="1.65.1"

# Start the browser server container and wait until it accepts connections.
# Usage: start_playwright_server <container-name> <port>
start_playwright_server() {
	docker run --detach --rm --init --shm-size=1g --network host \
		--name "$1" \
		--user pwuser \
		--workdir /home/pwuser \
		"mcr.microsoft.com/playwright:v${playwright_version}-noble" \
		npx --yes "playwright@${playwright_version}" run-server \
		--port "$2" --host 127.0.0.1 >/dev/null

	attempt=0
	until docker logs "$1" 2>&1 | grep -q 'Listening'; do
		attempt=$((attempt + 1))
		if [ "$attempt" -ge 30 ]; then
			printf '%s\n' 'Playwright browser server did not become ready.' >&2
			return 1
		fi
		sleep 1
	done
}

# Usage: stop_playwright_server <container-name>
stop_playwright_server() {
	docker rm -f "$1" >/dev/null 2>&1 || true
}
