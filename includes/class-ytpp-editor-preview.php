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
	 * @param string $playlist_id Canonical playlist ID.
	 * @param string $site_origin Site origin passed to the YouTube player.
	 * @return string
	 */
	public static function render( string $playlist_id, string $site_origin ): string {
		$parameters = http_build_query(
			array(
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

		return sprintf(
			'<!doctype html><html><head><meta charset="utf-8"><meta name="referrer" content="origin-when-cross-origin"><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{width:100%%;height:100%%;margin:0;background:#000}iframe{display:block;width:100%%;height:100%%;border:0}</style></head><body><iframe title="%1$s" src="%2$s" loading="eager" referrerpolicy="origin-when-cross-origin" allow="encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe></body></html>',
			esc_attr__( 'YouTube playlist preview', 'yt-playlist-player' ),
			esc_url( $player_url )
		);
	}
}
