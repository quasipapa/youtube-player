<?php
/**
 * Plugin Name:       YouTube Playlist Player
 * Description:       Adds an enhanced navigation interface to embedded YouTube playlists.
 * Version:           0.1.0
 * Requires at least: 6.0
 * Requires PHP:      8.0
 * Author:            quasipapa
 * Copyright:         2026 quasipapa
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 * Text Domain:       yt-playlist-player
 * Update URI:        https://github.com/quasipapa/youtube-player
 *
 * @package YouTube_Playlist_Player
 */

defined( 'ABSPATH' ) || exit;

define(
	'YTPP_VERSION',
	'0.1.0'
);

define(
	'YTPP_PLUGIN_URL',
	plugin_dir_url( __FILE__ )
);

define(
	'YTPP_PLUGIN_DIR',
	plugin_dir_path( __FILE__ )
);


/**
 * Enqueue the prototype player assets.
 *
 * @return void
 */
function ytpp_enqueue_assets(): void {
	wp_enqueue_style(
		'ytpp-player',
		YTPP_PLUGIN_URL . 'build/style-index.css',
		array(),
		YTPP_VERSION
	);

	$asset_file = YTPP_PLUGIN_DIR . 'build/index.asset.php';
	$asset      = file_exists( $asset_file )
		? require $asset_file
		: array(
			'dependencies' => array(),
			'version'      => YTPP_VERSION,
		);

	wp_enqueue_script(
		'ytpp-player',
		YTPP_PLUGIN_URL . 'build/index.js',
		$asset['dependencies'],
		$asset['version'],
		array(
			'in_footer' => true,
			'strategy'  => 'defer',
		)
	);
}

add_action(
	'wp_enqueue_scripts',
	'ytpp_enqueue_assets'
);
