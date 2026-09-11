#!/bin/sh

set -eu

project_root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
staging_root="$project_root/.plugin-check"
plugin_dir="$staging_root/yt-playlist-player"

trap 'rm -rf "$staging_root"' EXIT HUP INT TERM

rm -rf "$staging_root"
mkdir -p "$plugin_dir"

cp "$project_root/yt-playlist-player.php" "$plugin_dir/"
cp "$project_root/readme.txt" "$plugin_dir/"
cp "$project_root/LICENSE" "$plugin_dir/"
cp -R "$project_root/build" "$plugin_dir/"
cp -R "$project_root/includes" "$plugin_dir/"
cp -R "$project_root/languages" "$plugin_dir/"

"$project_root/node_modules/.bin/wp-env" run --config="$project_root/.wp-env.test.json" cli -- \
	wp plugin check wp-content/plugins/yt-playlist-player/.plugin-check/yt-playlist-player \
	--require=wp-content/plugins/plugin-check/cli.php \
	--format=strict-table \
	--ignore-codes=block_api_version_too_low,plugin_updater_detected,trademarked_term,PluginCheck.CodeAnalysis.DiscouragedFunctions.load_plugin_textdomainFound

rm -rf "$staging_root"
