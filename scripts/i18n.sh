#!/bin/sh

set -eu

project_root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
plugin_container_path='wp-content/plugins/yt-playlist-player'
catalog_name='yt-playlist-player'
locale='de_DE'

run_wp_cli() {
	if [ -n "${YTPP_WP_ENV_CONFIG:-}" ]; then
		"$project_root/node_modules/.bin/wp-env" run --config="$YTPP_WP_ENV_CONFIG" cli -- "$@"
	else
		"$project_root/node_modules/.bin/wp-env" run cli -- "$@"
	fi
}

generate_catalogs() {
	output_dir=$1
	output_relative=${output_dir#"$project_root"/}
	output_container_path="$plugin_container_path/$output_relative"

	mkdir -p "$output_dir"
	find "$output_dir" -maxdepth 1 -type f -name "$catalog_name-$locale-*.json" -delete

	run_wp_cli wp i18n make-pot \
		"$plugin_container_path" \
		"$output_container_path/$catalog_name.pot" \
		--domain="$catalog_name" \
		--exclude=build,tests,node_modules,vendor,languages,playwright-report,test-results,.i18n-check \
		--headers='{"Report-Msgid-Bugs-To":"https://github.com/quasipapa/youtube-player/issues","POT-Creation-Date":""}' \
		--package-name='YouTube Playlist Player'

	run_wp_cli wp i18n update-po \
		"$output_container_path/$catalog_name.pot" \
		"$output_container_path/$catalog_name-$locale.po"

	run_wp_cli wp i18n make-mo \
		"$output_container_path/$catalog_name-$locale.po" \
		"$output_container_path/$catalog_name-$locale.mo"

	run_wp_cli wp i18n make-json \
		"$output_container_path/$catalog_name-$locale.po" \
		"$output_container_path" \
		--domain="$catalog_name" \
		--no-purge \
		--pretty-print \
		--use-map='{"src/edit.js":"build/index.js","src/view.js":"build/view.js"}'

	"$project_root/node_modules/.bin/wp-scripts" format \
		"$output_dir"/"$catalog_name-$locale-"*.json
}

case "${1:-}" in
	generate)
		generate_catalogs "$project_root/languages"
		;;
	check)
		check_dir=$(mktemp -d "$project_root/.i18n-check.XXXXXX")
		trap 'rm -rf "$check_dir"' EXIT HUP INT TERM
		cp "$project_root/languages/$catalog_name-$locale.po" "$check_dir/"
		generate_catalogs "$check_dir"
		diff -ru "$project_root/languages" "$check_dir"
		;;
	*)
		echo "Usage: $0 generate|check" >&2
		exit 2
		;;
esac
