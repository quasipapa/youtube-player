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

/**
 * Record block registrations without loading WordPress.
 *
 * @param string $block_type Block metadata directory.
 * @return object
 */
function register_block_type( string $block_type ): object {
	$registered_block = (object) array( 'path' => $block_type );
	$GLOBALS['ytpp_test_registered_blocks'][] = $registered_block;

	return $registered_block;
}

/**
 * Minimal text sanitization for isolated renderer tests.
 *
 * @param string $value Untrusted value.
 * @return string
 */
function sanitize_text_field( string $value ): string {
	return trim( strip_tags( $value ) );
}

/**
 * Parse a URL for isolated parser tests.
 *
 * @param string $url URL to parse.
 * @return array|false
 */
function wp_parse_url( string $url ) {
	return parse_url( $url );
}

/**
 * Build escaped wrapper attributes for isolated renderer tests.
 *
 * @param array $attributes Wrapper attributes.
 * @return string
 */
function get_block_wrapper_attributes( array $attributes = array() ): string {
	$parts = array();

	foreach ( $attributes as $name => $value ) {
		$parts[] = sprintf(
			'%s="%s"',
			htmlspecialchars( (string) $name, ENT_QUOTES, 'UTF-8' ),
			htmlspecialchars( (string) $value, ENT_QUOTES, 'UTF-8' )
		);
	}

	return implode( ' ', $parts );
}

/**
 * Echo escaped translated text for isolated renderer tests.
 *
 * @param string $text Source text.
 * @return void
 */
function esc_html_e( string $text ): void {
	echo htmlspecialchars( $text, ENT_QUOTES, 'UTF-8' );
}

/**
 * Echo an escaped translated attribute for isolated renderer tests.
 *
 * @param string $text Source text.
 * @return void
 */
function esc_attr_e( string $text ): void {
	echo htmlspecialchars( $text, ENT_QUOTES, 'UTF-8' );
}

require dirname( __DIR__ ) . '/yt-playlist-player.php';
