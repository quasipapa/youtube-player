<?php
/**
 * Lightweight bootstrap for tests that do not require a WordPress installation.
 *
 * @package YouTube_Playlist_Player
 */

require dirname( __DIR__ ) . '/vendor/autoload.php';

define( 'ABSPATH', dirname( __DIR__ ) . '/' );

/**
 * Minimal replacement used while loading the plugin in isolated unit tests.
 *
 * @param string $file Plugin file path.
 * @return string
 */
function plugin_dir_url( string $file ): string {
	return 'https://example.test/wp-content/plugins/yt-playlist-player/';
}

/**
 * Minimal replacement used while loading the plugin in isolated unit tests.
 *
 * @param string $file Plugin file path.
 * @return string
 */
function plugin_dir_path( string $file ): string {
	return dirname( $file ) . '/';
}

/**
 * Minimal replacement used while loading the plugin in isolated unit tests.
 *
 * @param string   $hook_name Hook name.
 * @param callable $callback  Registered callback.
 * @return void
 */
function add_action( string $hook_name, callable $callback ): void {
}

require dirname( __DIR__ ) . '/yt-playlist-player.php';
