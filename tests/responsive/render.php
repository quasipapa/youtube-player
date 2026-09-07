<?php
/**
 * Render production markup for isolated browser layout tests.
 *
 * @package YouTube_Playlist_Player
 */

if ( 'cli' !== PHP_SAPI ) {
	exit;
}

require dirname( __DIR__ ) . '/bootstrap.php';

/**
 * Provide attributes in the same local scope as a WordPress render callback.
 *
 * @param array $attributes Fixture block attributes.
 * @return void
 */
function ytpp_render_layout_fixture( array $attributes ): void { // phpcs:ignore Generic.CodeAnalysis.UnusedFunctionParameter.Found -- The included render template consumes $attributes.
	require dirname( __DIR__, 2 ) . '/src/render.php';
}

ytpp_render_layout_fixture( json_decode( $argv[1], true ) );
