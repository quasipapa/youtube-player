const ALLOWED_HOSTS = new Set( [
	'youtube.com',
	'www.youtube.com',
	'm.youtube.com',
	'music.youtube.com',
	'youtube-nocookie.com',
	'www.youtube-nocookie.com',
	'youtu.be',
	'www.youtu.be',
] );

const PLAYLIST_ID_PATTERN = /^[A-Za-z0-9_-]{10,100}$/;

export const VALIDATION_EMPTY = 'empty';
export const VALIDATION_INVALID = 'invalid';
export const VALIDATION_VALID = 'valid';

/**
 * Normalize a playlist ID or supported absolute YouTube URL.
 *
 * This checks syntax only and never contacts YouTube.
 *
 * @param {string} input User input.
 * @return {{ id: string, status: string }} Validation result.
 */
export function parsePlaylistInput( input ) {
	const trimmedInput = input.trim();

	if ( ! trimmedInput ) {
		return { id: '', status: VALIDATION_EMPTY };
	}

	if ( PLAYLIST_ID_PATTERN.test( trimmedInput ) ) {
		return { id: trimmedInput, status: VALIDATION_VALID };
	}

	let url;

	try {
		url = new URL( trimmedInput );
	} catch {
		return { id: '', status: VALIDATION_INVALID };
	}

	if (
		! [ 'http:', 'https:' ].includes( url.protocol ) ||
		! ALLOWED_HOSTS.has( url.hostname.toLowerCase() ) ||
		url.username ||
		url.password ||
		url.port
	) {
		return { id: '', status: VALIDATION_INVALID };
	}

	const listParameters = url.searchParams.getAll( 'list' );
	const playlistId = listParameters.length === 1 ? listParameters[ 0 ] : '';

	return PLAYLIST_ID_PATTERN.test( playlistId )
		? { id: playlistId, status: VALIDATION_VALID }
		: { id: '', status: VALIDATION_INVALID };
}
