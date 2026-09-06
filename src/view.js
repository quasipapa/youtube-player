import { __, sprintf } from '@wordpress/i18n';

( () => {
	'use strict';

	const SELECTOR =
		'.ytpp-player[data-playlist-id]:not([data-playlist-id=""])';
	let apiLoading = false;
	let apiReady = false;

	function loadYouTubeApi() {
		if ( ! document.querySelector( SELECTOR ) ) {
			return;
		}

		if ( window.YT && window.YT.Player ) {
			apiReady = true;
			initializePlayers();
			return;
		}
		if ( apiLoading ) {
			return;
		}

		apiLoading = true;
		const script = document.createElement( 'script' );
		script.src = 'https://www.youtube.com/iframe_api';
		document.head.appendChild( script );
	}

	function initializePlayers() {
		if ( ! apiReady && ! ( window.YT && window.YT.Player ) ) {
			return;
		}

		document.querySelectorAll( SELECTOR ).forEach( initializePlayer );
	}

	function initializePlayer( container ) {
		if ( container.dataset.ytppInitialized === 'true' ) {
			return;
		}

		const playlistId = container.dataset.playlistId;
		const playerTarget = container.querySelector( '.ytpp-player__target' );
		const previousButton = container.querySelector(
			'.ytpp-player__previous'
		);
		const nextButton = container.querySelector( '.ytpp-player__next' );
		const position = container.querySelector( '.ytpp-player__position' );

		if (
			! playlistId ||
			! playerTarget ||
			! previousButton ||
			! nextButton ||
			! position
		) {
			return;
		}

		container.dataset.ytppInitialized = 'true';

		function updatePosition() {
			const playlist = player.getPlaylist();
			const index = player.getPlaylistIndex();

			if (
				Array.isArray( playlist ) &&
				playlist.length > 0 &&
				index >= 0
			) {
				position.textContent = sprintf(
					/* translators: 1: Current video number. 2: Total number of videos. */
					__( 'Video %1$d of %2$d', 'yt-playlist-player' ),
					index + 1,
					playlist.length
				);
			} else {
				position.textContent = '';
			}
		}

		const player = new window.YT.Player( playerTarget, {
			host: 'https://www.youtube-nocookie.com',
			playerVars: {
				listType: 'playlist',
				list: playlistId,
				controls: 1,
			},
			events: {
				onReady: updatePosition,
				onStateChange: updatePosition,
			},
		} );

		previousButton.addEventListener( 'click', () => {
			player.previousVideo();
			window.setTimeout( updatePosition, 250 );
		} );

		nextButton.addEventListener( 'click', () => {
			player.nextVideo();
			window.setTimeout( updatePosition, 250 );
		} );
	}

	const previousApiReadyCallback = window.onYouTubeIframeAPIReady;

	window.onYouTubeIframeAPIReady = function () {
		if ( typeof previousApiReadyCallback === 'function' ) {
			previousApiReadyCallback();
		}

		apiReady = true;
		initializePlayers();
	};

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', loadYouTubeApi );
	} else {
		loadYouTubeApi();
	}
} )();
