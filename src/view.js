import { __, sprintf } from '@wordpress/i18n';

import { hasStoredConsent, rememberConsent } from './consent-storage';

const API_URL = 'https://www.youtube.com/iframe_api';
const PLAYER_SELECTOR =
	'.ytpp-player[data-playlist-id]:not([data-playlist-id=""])';
let apiPromise;

/**
 * Load the YouTube IFrame API once while preserving an existing ready callback.
 *
 * @return {Promise<Object>} YouTube API namespace.
 */
export function loadYouTubeApi() {
	if ( window.YT && window.YT.Player ) {
		return Promise.resolve( window.YT );
	}

	if ( apiPromise ) {
		return apiPromise;
	}

	apiPromise = new Promise( ( resolve, reject ) => {
		const previousReadyCallback = window.onYouTubeIframeAPIReady;

		window.onYouTubeIframeAPIReady = () => {
			try {
				if ( typeof previousReadyCallback === 'function' ) {
					previousReadyCallback();
				}
			} finally {
				if ( window.YT && window.YT.Player ) {
					resolve( window.YT );
				} else {
					reject( new Error( 'YouTube IFrame API unavailable' ) );
				}
			}
		};

		let script = document.querySelector( `script[src="${ API_URL }"]` );

		if ( ! script ) {
			script = document.createElement( 'script' );
			script.src = API_URL;
			script.async = true;
			document.head.appendChild( script );
		}

		script.addEventListener(
			'error',
			() => {
				apiPromise = undefined;
				script.remove();
				reject( new Error( 'YouTube IFrame API failed to load' ) );
			},
			{ once: true }
		);
	} );

	return apiPromise;
}

/**
 * Update a player's local status message.
 *
 * @param {HTMLElement} container Player wrapper.
 * @param {string}      message   Translated status text.
 * @param {boolean}     isError   Whether this is an error.
 */
function setStatus( container, message, isError = false ) {
	const status = container.querySelector( '.ytpp-player__status' );

	if ( ! status ) {
		return;
	}

	status.textContent = message;
	status.setAttribute( 'role', isError ? 'alert' : 'status' );
}

/**
 * Display the current position reported by the player.
 *
 * @param {HTMLElement} container Player wrapper.
 * @param {Object}      player    YouTube player instance.
 */
function updatePosition( container, player ) {
	const position = container.querySelector( '.ytpp-player__position' );
	const previousButton = container.querySelector( '.ytpp-player__previous' );
	const nextButton = container.querySelector( '.ytpp-player__next' );

	if ( ! position || ! previousButton || ! nextButton ) {
		return;
	}

	const playlist = player.getPlaylist();
	const index = player.getPlaylistIndex();

	if ( Array.isArray( playlist ) && playlist.length > 0 && index >= 0 ) {
		position.textContent = sprintf(
			/* translators: 1: Current video number. 2: Total number of videos. */
			__( 'Video %1$d of %2$d', 'yt-playlist-player' ),
			index + 1,
			playlist.length
		);
		previousButton.disabled = index <= 0;
		nextButton.disabled = index >= playlist.length - 1;
	} else {
		position.textContent = '';
		previousButton.disabled = true;
		nextButton.disabled = true;
	}
}

/**
 * Create the privacy-enhanced player after the external API is available.
 *
 * @param {HTMLElement} container Player wrapper.
 * @param {Object}      youtube   YouTube API namespace.
 */
function createPlayer( container, youtube ) {
	const playlistId = container.dataset.playlistId;
	const playerTarget = container.querySelector( '.ytpp-player__target' );
	const previousButton = container.querySelector( '.ytpp-player__previous' );
	const nextButton = container.querySelector( '.ytpp-player__next' );

	if ( ! playlistId || ! playerTarget || ! previousButton || ! nextButton ) {
		throw new Error( 'Incomplete player markup' );
	}

	const parameters = new URLSearchParams( {
		enablejsapi: '1',
		origin: window.location.origin,
		listType: 'playlist',
		list: playlistId,
		index: '0',
		autoplay: '0',
		controls: '1',
		playsinline: '1',
	} );
	const iframe = document.createElement( 'iframe' );
	iframe.src = `https://www.youtube-nocookie.com/embed?${ parameters }`;
	iframe.title = __( 'YouTube playlist player', 'yt-playlist-player' );
	iframe.allow = 'encrypted-media; picture-in-picture; fullscreen';
	iframe.allowFullscreen = true;
	iframe.referrerPolicy = 'origin-when-cross-origin';
	playerTarget.replaceChildren( iframe );

	const player = new youtube.Player( iframe, {
		events: {
			onReady: ( event ) => {
				container.setAttribute( 'aria-busy', 'false' );
				setStatus( container, '' );
				updatePosition( container, event.target );
			},
			onStateChange: ( event ) => {
				updatePosition( container, event.target );
			},
			onError: () => {
				container.setAttribute( 'aria-busy', 'false' );
				previousButton.disabled = true;
				nextButton.disabled = true;
				setStatus(
					container,
					__(
						'The YouTube playlist could not be loaded.',
						'yt-playlist-player'
					),
					true
				);
			},
		},
	} );

	previousButton.addEventListener( 'click', () => {
		player.previousVideo();
		window.setTimeout( () => updatePosition( container, player ), 250 );
	} );

	nextButton.addEventListener( 'click', () => {
		player.nextVideo();
		window.setTimeout( () => updatePosition( container, player ), 250 );
	} );
}

/**
 * Start one player after consent or immediately when the local gate is disabled.
 *
 * @param {HTMLElement} container         Player wrapper.
 * @param {boolean}     consentGrantedNow Whether this call follows a new choice.
 */
export function activatePlayer( container, consentGrantedNow = false ) {
	if ( container.dataset.ytppState ) {
		return;
	}

	const consentButton = container.querySelector(
		'.ytpp-player__consent-button'
	);

	container.dataset.ytppState = 'loading';
	container.setAttribute( 'aria-busy', 'true' );
	setStatus(
		container,
		__( 'The video playlist is loading.', 'yt-playlist-player' )
	);

	if ( consentButton ) {
		consentButton.disabled = true;
	}

	if ( consentGrantedNow ) {
		rememberConsent( container.dataset.playlistId );
		container.dispatchEvent(
			new CustomEvent( 'ytpp:consent', {
				bubbles: true,
				detail: { playlistId: container.dataset.playlistId },
			} )
		);
	}

	loadYouTubeApi()
		.then( ( youtube ) => {
			createPlayer( container, youtube );
			container.dataset.ytppState = 'initialized';
		} )
		.catch( () => {
			delete container.dataset.ytppState;
			container.setAttribute( 'aria-busy', 'false' );
			if ( consentButton ) {
				consentButton.disabled = false;
			}
			setStatus(
				container,
				__(
					'The YouTube playlist could not be loaded. Please try again.',
					'yt-playlist-player'
				),
				true
			);
		} );
}

/**
 * Bind every player on the page without loading external resources early.
 *
 * @param {Document|HTMLElement} root Search root.
 */
export function initializePlayers( root = document ) {
	root.querySelectorAll( PLAYER_SELECTOR ).forEach( ( container ) => {
		if ( container.dataset.ytppBound === 'true' ) {
			return;
		}

		container.dataset.ytppBound = 'true';
		const consentButton = container.querySelector(
			'.ytpp-player__consent-button'
		);

		if (
			container.dataset.requireConsent === 'false' ||
			hasStoredConsent( container.dataset.playlistId )
		) {
			activatePlayer( container );
		} else if ( consentButton ) {
			consentButton.addEventListener( 'click', () => {
				activatePlayer( container, true );
			} );
		}
	} );
}

if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', () => initializePlayers() );
} else {
	initializePlayers();
}
