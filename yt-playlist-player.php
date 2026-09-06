<?php
/**
 * Plugin Name:       YouTube Playlist Player
 * Description:       Adds an enhanced navigation interface to embedded YouTube playlists.
 * Version:           0.1.0
 * Requires at least: 6.1
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
 * Register the player block and its metadata-defined assets.
 *
 * @return void
 */
function ytpp_register_block(): void {
	register_block_type( YTPP_PLUGIN_DIR . 'build' );
}

add_action( 'init', 'ytpp_register_block' );
