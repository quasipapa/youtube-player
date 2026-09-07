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
 * Domain Path:       /languages
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

require_once YTPP_PLUGIN_DIR . 'includes/class-ytpp-playlist-parser.php';
require_once YTPP_PLUGIN_DIR . 'includes/class-ytpp-player-sizing.php';
require_once YTPP_PLUGIN_DIR . 'includes/class-ytpp-editor-preview.php';


/**
 * Register the player block and its metadata-defined assets.
 *
 * @return void
 */
function ytpp_register_block(): void {
	load_plugin_textdomain(
		'yt-playlist-player',
		false,
		dirname( plugin_basename( __FILE__ ) ) . '/languages'
	);

	$block_type     = register_block_type( YTPP_PLUGIN_DIR . 'build' );
	$script_handles = array_merge(
		$block_type && isset( $block_type->editor_script_handles ) ? $block_type->editor_script_handles : array(),
		$block_type && isset( $block_type->view_script_handles ) ? $block_type->view_script_handles : array()
	);

	foreach ( $script_handles as $script_handle ) {
		wp_set_script_translations(
			$script_handle,
			'yt-playlist-player',
			YTPP_PLUGIN_DIR . 'languages'
		);
	}

	if ( ! $block_type || empty( $block_type->editor_script_handles[0] ) ) {
		return;
	}

	$preview_url = add_query_arg(
		array(
			'action' => 'ytpp_editor_preview',
			'nonce'  => wp_create_nonce( 'ytpp_editor_preview' ),
		),
		admin_url( 'admin-ajax.php' )
	);

	wp_add_inline_script(
		$block_type->editor_script_handles[0],
		'window.ytppEditorSettings = ' . wp_json_encode(
			array(
				'previewUrl' => $preview_url,
			)
		) . ';',
		'before'
	);
}

add_action( 'init', 'ytpp_register_block' );

/**
 * Return the authenticated same-origin document for an editor preview.
 *
 * @return void
 */
function ytpp_render_editor_preview(): void {
	check_ajax_referer( 'ytpp_editor_preview', 'nonce' );

	if ( ! current_user_can( 'edit_posts' ) ) {
		wp_die( esc_html__( 'You are not allowed to preview this playlist.', 'yt-playlist-player' ), '', array( 'response' => 403 ) );
	}

	$input       = isset( $_GET['playlist_id'] ) ? sanitize_text_field( wp_unslash( $_GET['playlist_id'] ) ) : '';
	$playlist_id = YTPP_Playlist_Parser::parse( $input );

	if ( null === $playlist_id ) {
		wp_die( esc_html__( 'The playlist ID is invalid.', 'yt-playlist-player' ), '', array( 'response' => 400 ) );
	}

	$site_url    = wp_parse_url( home_url( '/' ) );
	$site_origin = is_array( $site_url ) && isset( $site_url['scheme'], $site_url['host'] )
		? $site_url['scheme'] . '://' . $site_url['host'] . ( isset( $site_url['port'] ) ? ':' . $site_url['port'] : '' )
		: home_url( '/' );

	nocache_headers();
	header( 'Content-Type: text/html; charset=UTF-8' );
	$is_availability_check = isset( $_GET['availability_check'] ) && '1' === sanitize_text_field( wp_unslash( $_GET['availability_check'] ) );
	$controller_path       = YTPP_PLUGIN_DIR . 'assets/js/editor-preview-controller.js';
	$controller_version    = file_exists( $controller_path )
		? YTPP_VERSION . '-' . (string) filemtime( $controller_path )
		: YTPP_VERSION;
	$controller_url        = $is_availability_check
		? add_query_arg(
			array( 'ver' => $controller_version ),
			YTPP_PLUGIN_URL . 'assets/js/editor-preview-controller.js'
		)
		: '';

	echo YTPP_Editor_Preview::render( $playlist_id, $site_origin, $controller_url ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- The complete document is escaped while it is built.
	wp_die();
}

add_action( 'wp_ajax_ytpp_editor_preview', 'ytpp_render_editor_preview' );
