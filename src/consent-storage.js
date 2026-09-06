const CONSENT_STORAGE_PREFIX = 'ytpp-consent-v1:';

/**
 * Build the local-storage key for one canonical playlist ID.
 *
 * @param {string} playlistId Playlist ID.
 * @return {string} Storage key.
 */
export function getConsentStorageKey( playlistId ) {
	return `${ CONSENT_STORAGE_PREFIX }${ playlistId }`;
}

/**
 * Check whether this browser previously allowed the playlist to load.
 *
 * @param {string} playlistId Playlist ID.
 * @return {boolean} Whether consent is stored.
 */
export function hasStoredConsent( playlistId ) {
	try {
		return (
			localStorage.getItem( getConsentStorageKey( playlistId ) ) === '1'
		);
	} catch {
		return false;
	}
}

/**
 * Remember consent locally without storing visitor identity.
 *
 * @param {string} playlistId Playlist ID.
 */
export function rememberConsent( playlistId ) {
	try {
		localStorage.setItem( getConsentStorageKey( playlistId ), '1' );
	} catch {
		// Loading still works when storage is blocked; consent then lasts one page.
	}
}

/**
 * Remove stored consent for one playlist.
 *
 * @param {string} playlistId Playlist ID.
 */
export function forgetConsent( playlistId ) {
	try {
		localStorage.removeItem( getConsentStorageKey( playlistId ) );
	} catch {
		// The desired state is already effectively reached when storage is blocked.
	}
}
