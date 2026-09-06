<?php
/**
 * Parse and validate YouTube playlist input.
 *
 * @package YouTube_Playlist_Player
 */

defined( 'ABSPATH' ) || exit;

/**
 * Convert supported playlist input to a canonical playlist ID.
 */
final class YTPP_Playlist_Parser {
	/**
	 * Hosts accepted for playlist links.
	 *
	 * @var string[]
	 */
	private const ALLOWED_HOSTS = array(
		'youtube.com',
		'www.youtube.com',
		'm.youtube.com',
		'music.youtube.com',
		'youtube-nocookie.com',
		'www.youtube-nocookie.com',
		'youtu.be',
		'www.youtu.be',
	);

	/**
	 * Return the canonical ID for supported input or null when it is invalid.
	 *
	 * This validates syntax only. It does not contact YouTube or guarantee that
	 * the playlist exists, is public, contains videos or permits embedding.
	 *
	 * @param string $input Playlist ID or absolute YouTube URL.
	 * @return string|null
	 */
	public static function parse( string $input ): ?string {
		$input = trim( $input );

		if ( self::is_valid_id( $input ) ) {
			return $input;
		}

		$url = wp_parse_url( $input );

		if ( ! is_array( $url ) || ! isset( $url['scheme'], $url['host'] ) ) {
			return null;
		}

		$scheme = strtolower( $url['scheme'] );
		$host   = strtolower( $url['host'] );

		if (
			! in_array( $scheme, array( 'http', 'https' ), true ) ||
			! in_array( $host, self::ALLOWED_HOSTS, true ) ||
			isset( $url['user'] ) ||
			isset( $url['pass'] ) ||
			self::has_non_default_port( $url, $scheme ) ||
			! isset( $url['query'] )
		) {
			return null;
		}

		$playlist_id = self::extract_list_parameter( $url['query'] );

		return self::is_valid_id( $playlist_id ) ? $playlist_id : null;
	}

	/**
	 * Check the conservative character and length constraints for playlist IDs.
	 *
	 * YouTube does not publish one fixed playlist-ID length. The broad length
	 * range accommodates known playlist types while rejecting arbitrary input.
	 *
	 * @param string|null $playlist_id Candidate ID.
	 * @return bool
	 */
	private static function is_valid_id( ?string $playlist_id ): bool {
		return is_string( $playlist_id ) &&
			1 === preg_match( '/\A[A-Za-z0-9_-]{10,100}\z/', $playlist_id );
	}

	/**
	 * Reject non-default ports while allowing explicitly written defaults.
	 *
	 * @param array  $url    Parsed URL.
	 * @param string $scheme Normalized scheme.
	 * @return bool
	 */
	private static function has_non_default_port( array $url, string $scheme ): bool {
		if ( ! isset( $url['port'] ) ) {
			return false;
		}

		$port = (int) $url['port'];

		return ! ( ( 'http' === $scheme && 80 === $port ) || ( 'https' === $scheme && 443 === $port ) );
	}

	/**
	 * Extract exactly one list query parameter without accepting ambiguity.
	 *
	 * @param string $query Raw URL query.
	 * @return string|null
	 */
	private static function extract_list_parameter( string $query ): ?string {
		$values = array();

		foreach ( explode( '&', $query ) as $parameter ) {
			$parts = explode( '=', $parameter, 2 );
			$key   = rawurldecode( $parts[0] );

			if ( 'list' === $key ) {
				$values[] = isset( $parts[1] )
					? rawurldecode( str_replace( '+', ' ', $parts[1] ) )
					: '';
			}
		}

		return 1 === count( $values ) ? $values[0] : null;
	}
}
