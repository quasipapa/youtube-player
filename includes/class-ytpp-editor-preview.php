<?php
/**
 * Build the same-origin document used by the block-editor preview.
 *
 * @package YouTube_Playlist_Player
 */

defined( 'ABSPATH' ) || exit;

/**
 * Create an isolated preview document for a validated playlist.
 */
final class YTPP_Editor_Preview {
	/**
	 * Render a complete document whose nested YouTube iframe receives an HTTP referrer.
	 *
	 * Gutenberg can render its canvas from a blob URL. Loading this document from a
	 * normal, same-origin WordPress URL avoids losing the referrer at YouTube's
	 * iframe boundary.
	 *
	 * @param string $playlist_id    Canonical playlist ID.
	 * @param string $site_origin    Site origin passed to the YouTube player.
	 * @param string $controller_url Same-origin availability-controller URL.
	 * @return string
	 */
	public static function render( string $playlist_id, string $site_origin, string $controller_url ): string {
		$parameters = http_build_query(
			array(
				'enablejsapi'     => '1',
				'listType'        => 'playlist',
				'list'            => $playlist_id,
				'autoplay'        => '0',
				'origin'          => $site_origin,
				'widget_referrer' => $site_origin,
			),
			'',
			'&',
			PHP_QUERY_RFC3986
		);
		$player_url = 'https://www.youtube-nocookie.com/embed?' . $parameters;

		// phpcs:disable WordPress.WP.EnqueuedResources.NonEnqueuedScript -- This is a complete isolated iframe document, not a WordPress page.
		return '<!doctype html><html><head><meta charset="utf-8">' .
			'<meta name="referrer" content="origin-when-cross-origin">' .
			'<meta name="viewport" content="width=device-width,initial-scale=1">' .
			'<style>html,body{width:100%;height:100%;margin:0;background:#000}' .
			'iframe{display:block;width:100%;height:100%;border:0}</style></head><body>' .
			'<iframe id="ytpp-preview-player" title="' .
			esc_attr__( 'YouTube playlist preview', 'yt-playlist-player' ) .
			'" src="' . esc_url( $player_url ) .
			'" loading="eager" referrerpolicy="origin-when-cross-origin" ' .
			'allow="encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>' .
			'<script src="' . esc_url( $controller_url ) . '"></script></body></html>';
		// phpcs:enable WordPress.WP.EnqueuedResources.NonEnqueuedScript
	}
}
