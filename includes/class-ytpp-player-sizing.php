<?php
/**
 * Validate dimensions before emitting CSS custom properties.
 *
 * @package YouTube_Playlist_Player
 */

defined( 'ABSPATH' ) || exit;

/** Normalize dimensions consistently with the editor. */
final class YTPP_Player_Sizing {
	/**
	 * Build safe inline CSS from saved block attributes.
	 *
	 * @param array $attributes Saved block attributes.
	 * @return string
	 */
	public static function style( array $attributes ): string {
		$input = ( $attributes['aspectRatio'] ?? '' ) === 'custom'
			? ( $attributes['customAspectRatio'] ?? '' )
			: ( $attributes['aspectRatio'] ?? '16:9' );
		$ratio = 16 / 9;
		$style = array();
		if ( is_string( $input ) && preg_match( '/^(\d{1,4}(?:\.\d{1,3})?)\s*:\s*(\d{1,4}(?:\.\d{1,3})?)$/D', $input, $parts ) && (float) $parts[2] > 0 ) {
			$candidate = (float) $parts[1] / (float) $parts[2];
			if ( $candidate >= 0.25 && $candidate <= 4 ) {
				$ratio = $candidate;
				if ( '16:9' !== $input ) {
					$style[] = '--ytpp-aspect-ratio:' . wp_json_encode( $ratio );
				}
			}
		}
		foreach ( array(
			'maxWidth'  => array( '--ytpp-max-width', ceil( 200 * max( 1, $ratio ) ) ),
			'maxHeight' => array( '--ytpp-max-height', ceil( 200 / min( 1, $ratio ) ) ),
		) as $key => $rule ) {
			$value = $attributes[ $key ] ?? '';
			if ( is_string( $value ) && preg_match( '/^\d{1,5}$/D', $value ) && (int) $value >= $rule[1] && (int) $value <= 10000 ) {
				$style[] = $rule[0] . ':' . (int) $value . 'px';
			}
		}
		return implode( ';', $style );
	}
}
