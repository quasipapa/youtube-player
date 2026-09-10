import { __, sprintf } from '@wordpress/i18n';

import {
	forgetConsent,
	hasStoredConsent,
	rememberConsent,
} from './consent-storage';

const API_URL = 'https://www.youtube.com/iframe_api';
const PLAYER_SELECTOR =
	'.ytpp-player[data-playlist-id]:not([data-playlist-id=""])';
let apiPromise;
const LOAD_TIMEOUT = 15000;
const states = new WeakMap();

function stateFor( container ) {
	if ( ! states.has( container ) ) {
		const target = container.querySelector( '.ytpp-player__target' );
		states.set( container, {
			attempt: 0,
			player: null,
			timers: new Set(),
			placeholder: Array.from( target.childNodes, ( node ) =>
				node.cloneNode( true )
			),
		} );
	}
	return states.get( container );
}

function emit( container, name, source, cancelable = false ) {
	return container.dispatchEvent(
		new CustomEvent( name, {
			bubbles: true,
			cancelable,
			detail: { playlistId: container.dataset.playlistId, source },
		} )
	);
}

function setBusy( container, busy ) {
	container
		.querySelector( '.ytpp-player__video' )
		?.setAttribute( 'aria-busy', String( busy ) );
}

function setRetry( container, visible ) {
	const retry = container.querySelector( '.ytpp-player__retry' );
	if ( retry ) {
		retry.hidden = ! visible;
	}
}

function navigationButtons( container ) {
	return Array.from(
		container.querySelectorAll(
			'.ytpp-player__first, .ytpp-player__previous, .ytpp-player__next, .ytpp-player__last'
		)
	);
}

function retainNavigationFocus( container, focused ) {
	if (
		focused?.disabled &&
		navigationButtons( container ).includes( focused )
	) {
		const nextFocus = navigationButtons( container ).find(
			( button ) => ! button.disabled
		);
		(
			nextFocus || container.querySelector( '.ytpp-player__target' )
		).focus();
	}
}

function clearPlayer( container ) {
	const state = stateFor( container );
	state.attempt++;
	state.timers.forEach( ( timer ) => window.clearTimeout( timer ) );
	state.timers.clear();
	try {
		state.player?.destroy?.();
	} catch {
		// Removing the iframe also works when the external API cannot clean up.
	}
	state.player = null;
	container
		.querySelector( '.ytpp-player__target' )
		.replaceChildren(
			...state.placeholder.map( ( node ) => node.cloneNode( true ) )
		);
	delete container.dataset.ytppState;
	setBusy( container, false );
	navigationButtons( container ).forEach( ( button ) => {
		button.disabled = true;
	} );
	for ( const selector of [
		'.ytpp-player__position',
		'.ytpp-player__position-announcement',
	] ) {
		const position = container.querySelector( selector );
		if ( position ) {
			position.textContent = '';
		}
	}
}

function failPlayer( container ) {
	const focused = container.ownerDocument.activeElement;
	const ownsFocus = container.contains( focused );
	clearPlayer( container );
	setStatus(
		container,
		__(
			'The YouTube playlist could not be loaded. Please try again.',
			'yt-playlist-player'
		),
		true
	);
	setRetry( container, true );
	if ( ownsFocus ) {
		(
			container.querySelector( '.ytpp-player__retry' ) ||
			container.querySelector( '.ytpp-player__consent-button' ) ||
			container.querySelector( '.ytpp-player__target' )
		).focus();
	}
}

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
		let script = document.querySelector( `script[src="${ API_URL }"]` );
		const ownsScript = ! script;
		const fail = () => {
			cleanup();
			apiPromise = undefined;
			if ( ownsScript ) {
				script.remove();
			}
			reject( new Error( 'YouTube IFrame API failed to load' ) );
		};
		const timeout = window.setTimeout( fail, LOAD_TIMEOUT );
		const cleanup = () => {
			window.clearTimeout( timeout );
			script.removeEventListener( 'error', fail );
			if ( window.onYouTubeIframeAPIReady === ready ) {
				window.onYouTubeIframeAPIReady = previousReadyCallback;
			}
		};

		const ready = () => {
			try {
				if ( typeof previousReadyCallback === 'function' ) {
					previousReadyCallback();
				}
			} finally {
				if ( window.YT && window.YT.Player ) {
					cleanup();
					resolve( window.YT );
				} else {
					fail();
				}
			}
		};

		window.onYouTubeIframeAPIReady = ready;

		if ( ! script ) {
			script = document.createElement( 'script' );
			script.src = API_URL;
			script.async = true;
			document.head.appendChild( script );
		}

		script.addEventListener( 'error', fail, { once: true } );
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
	const error = container.querySelector( '.ytpp-player__error' );

	status.textContent = isError ? '' : message;
	if ( error ) {
		error.textContent = isError ? message : '';
	}
}

/**
 * Display the current position reported by the player.
 *
 * @param {HTMLElement} container Player wrapper.
 * @param {Object}      player    YouTube player instance.
 */
function updatePosition( container, player ) {
	const position = container.querySelector( '.ytpp-player__position' );
	const firstButton = container.querySelector( '.ytpp-player__first' );
	const previousButton = container.querySelector( '.ytpp-player__previous' );
	const nextButton = container.querySelector( '.ytpp-player__next' );
	const lastButton = container.querySelector( '.ytpp-player__last' );

	if (
		! position ||
		! firstButton ||
		! previousButton ||
		! nextButton ||
		! lastButton
	) {
		return;
	}

	const announcement = container.querySelector(
		'.ytpp-player__position-announcement'
	);
	const focused = container.ownerDocument.activeElement;
	const playlist = player.getPlaylist();
	const index = player.getPlaylistIndex();

	if (
		Array.isArray( playlist ) &&
		playlist.length > 0 &&
		index >= 0 &&
		index < playlist.length
	) {
		position.textContent = sprintf(
			/* translators: 1: Current video number. 2: Total number of videos. */
			__( '%1$d / %2$d', 'yt-playlist-player' ),
			index + 1,
			playlist.length
		);
		const description = sprintf(
			/* translators: 1: Current video number. 2: Total number of videos. */
			__( 'Video %1$d of %2$d', 'yt-playlist-player' ),
			index + 1,
			playlist.length
		);
		if ( announcement && announcement.textContent !== description ) {
			announcement.textContent = description;
		}
		firstButton.disabled = index <= 0;
		previousButton.disabled = index <= 0;
		nextButton.disabled = index >= playlist.length - 1;
		lastButton.disabled = index >= playlist.length - 1;
	} else {
		position.textContent = '';
		if ( announcement ) {
			announcement.textContent = '';
		}
		firstButton.disabled = true;
		previousButton.disabled = true;
		nextButton.disabled = true;
		lastButton.disabled = true;
	}
	retainNavigationFocus( container, focused );
}

/**
 * Create the privacy-enhanced player after the external API is available.
 *
 * @param {HTMLElement} container Player wrapper.
 * @param {Object}      youtube   YouTube API namespace.
 * @param {number}      attempt   Generation of this loading attempt.
 */
function createPlayer( container, youtube, attempt ) {
	const state = stateFor( container );
	const current = () => state.attempt === attempt && container.isConnected;
	const playlistId = container.dataset.playlistId;
	const playerTarget = container.querySelector( '.ytpp-player__target' );
	const firstButton = container.querySelector( '.ytpp-player__first' );
	const previousButton = container.querySelector( '.ytpp-player__previous' );
	const nextButton = container.querySelector( '.ytpp-player__next' );
	const lastButton = container.querySelector( '.ytpp-player__last' );

	if (
		! playlistId ||
		! playerTarget ||
		! firstButton ||
		! previousButton ||
		! nextButton ||
		! lastButton
	) {
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

	const readyTimeout = window.setTimeout( () => {
		if ( current() ) {
			failPlayer( container );
		}
	}, LOAD_TIMEOUT );
	state.timers.add( readyTimeout );
	state.player = new youtube.Player( iframe, {
		events: {
			onReady: ( event ) => {
				if ( ! current() ) {
					return;
				}
				window.clearTimeout( readyTimeout );
				state.timers.delete( readyTimeout );
				setBusy( container, false );
				setStatus( container, '' );
				updatePosition( container, event.target );
				if ( container.ownerDocument.activeElement === playerTarget ) {
					iframe.focus();
				}
			},
			onStateChange: ( event ) => {
				if ( current() ) {
					updatePosition( container, event.target );
				}
			},
			onError: () => {
				if ( current() ) {
					failPlayer( container );
				}
			},
		},
	} );
}

/**
 * Start one player after consent or immediately when the local gate is disabled.
 *
 * @param {HTMLElement} container         Player wrapper.
 * @param {boolean}     consentGrantedNow Whether this call follows a new choice.
 * @param {string}      source            Activation origin for integrations.
 */
export function activatePlayer(
	container,
	consentGrantedNow = false,
	source = 'automatic'
) {
	if ( container.dataset.ytppState ) {
		return;
	}
	if ( ! emit( container, 'ytpp:before-load', source, true ) ) {
		setStatus(
			container,
			__(
				'Loading is blocked by the consent manager.',
				'yt-playlist-player'
			)
		);
		return;
	}
	const state = stateFor( container );
	const attempt = ++state.attempt;

	const consentButton = container.querySelector(
		'.ytpp-player__consent-button'
	);

	container.dataset.ytppState = 'loading';
	setBusy( container, true );
	const focused = container.ownerDocument.activeElement;
	if (
		focused === consentButton ||
		focused === container.querySelector( '.ytpp-player__retry' )
	) {
		container.querySelector( '.ytpp-player__target' ).focus();
	}
	setRetry( container, false );
	setStatus(
		container,
		__( 'The video playlist is loading.', 'yt-playlist-player' )
	);

	if ( consentButton ) {
		consentButton.disabled = true;
	}

	if ( consentGrantedNow ) {
		rememberConsent( container.dataset.playlistId );
		emit( container, 'ytpp:consent', source );
	}

	// An integration may revoke permission synchronously in the consent event.
	if ( state.attempt !== attempt ) {
		return;
	}
	loadYouTubeApi()
		.then( ( youtube ) => {
			if ( state.attempt !== attempt || ! container.isConnected ) {
				return;
			}
			createPlayer( container, youtube, attempt );
			if ( state.attempt === attempt ) {
				container.dataset.ytppState = 'initialized';
			}
		} )
		.catch( () => {
			if ( state.attempt === attempt && container.isConnected ) {
				failPlayer( container );
			}
		} );
}

/**
 * Withdraw permission for one block and cancel its pending player creation.
 *
 * @param {HTMLElement} container Player wrapper.
 */
export function revokePlayer( container ) {
	const ownsFocus = container.contains(
		container.ownerDocument.activeElement
	);
	forgetConsent( container.dataset.playlistId );
	clearPlayer( container );
	setRetry( container, false );
	setStatus(
		container,
		__(
			'Consent was withdrawn. The playlist is stopped.',
			'yt-playlist-player'
		)
	);
	if ( ownsFocus ) {
		(
			container.querySelector( '.ytpp-player__consent-button' ) ||
			container.querySelector( '.ytpp-player__target' )
		).focus();
	}
	emit( container, 'ytpp:consent-revoked', 'integration' );
}

function navigate( container, button ) {
	const state = stateFor( container );
	const player = state.player;
	if ( ! player || button.disabled ) {
		return;
	}
	if ( button.classList.contains( 'ytpp-player__first' ) ) {
		player.playVideoAt( 0 );
	} else if ( button.classList.contains( 'ytpp-player__previous' ) ) {
		player.previousVideo();
	} else if ( button.classList.contains( 'ytpp-player__next' ) ) {
		player.nextVideo();
	} else {
		const playlist = player.getPlaylist();
		if ( Array.isArray( playlist ) && playlist.length > 0 ) {
			player.playVideoAt( playlist.length - 1 );
		}
	}
	const attempt = state.attempt;
	const timer = window.setTimeout( () => {
		state.timers.delete( timer );
		if ( state.attempt === attempt && container.isConnected ) {
			updatePosition( container, player );
		}
	}, 250 );
	state.timers.add( timer );
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
		stateFor( container );
		container.addEventListener( 'click', ( event ) => {
			const button = event.target.closest( 'button' );
			if ( ! button || ! container.contains( button ) ) {
				return;
			}
			if ( button.classList.contains( 'ytpp-player__consent-button' ) ) {
				activatePlayer( container, true, 'button' );
			} else if ( button.classList.contains( 'ytpp-player__retry' ) ) {
				activatePlayer( container, false, 'retry' );
			} else if ( navigationButtons( container ).includes( button ) ) {
				navigate( container, button );
			}
		} );
		container.addEventListener( 'ytpp:grant-consent', ( event ) => {
			if ( event.target === container ) {
				activatePlayer( container, false, 'integration' );
			}
		} );
		container.addEventListener( 'ytpp:revoke-consent', ( event ) => {
			if ( event.target === container ) {
				revokePlayer( container );
			}
		} );

		if (
			container.dataset.requireConsent === 'false' ||
			hasStoredConsent( container.dataset.playlistId )
		) {
			activatePlayer(
				container,
				false,
				container.dataset.requireConsent === 'false'
					? 'configuration'
					: 'storage'
			);
		}
	} );
}

if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', () => initializePlayers() );
} else {
	initializePlayers();
}
