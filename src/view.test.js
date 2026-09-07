function playerMarkup( requireConsent = true ) {
	return `
		<div class="ytpp-player" data-playlist-id="PL-test-playlist" data-require-consent="${ requireConsent }">
			<div class="ytpp-player__target">
				${
					requireConsent
						? '<button class="ytpp-player__consent-button">Load</button>'
						: '<p class="ytpp-player__placeholder">Loading</p>'
				}
			</div>
			<p class="ytpp-player__status"></p>
			<button class="ytpp-player__first" disabled>First</button>
			<button class="ytpp-player__previous" disabled>Previous</button>
			<span class="ytpp-player__position"></span>
			<button class="ytpp-player__next" disabled>Next</button>
			<button class="ytpp-player__last" disabled>Last</button>
		</div>`;
}

async function flushPromises() {
	await Promise.resolve();
	await Promise.resolve();
}

describe( 'privacy-aware frontend player', () => {
	beforeEach( () => {
		document.head.innerHTML = '';
		document.body.innerHTML = '';
		delete window.YT;
		delete window.onYouTubeIframeAPIReady;
		localStorage.clear();
		jest.resetModules();
	} );

	it( 'waits for consent and loads one API script for multiple players', async () => {
		document.body.innerHTML = playerMarkup() + playerMarkup();
		const previousReadyCallback = jest.fn();
		window.onYouTubeIframeAPIReady = previousReadyCallback;
		const { initializePlayers } = require( './view' );

		initializePlayers();

		expect(
			document.querySelector( 'script[src*="youtube.com"]' )
		).toBeNull();

		const consentEvents = jest.fn();
		document.addEventListener( 'ytpp:consent', consentEvents );
		const buttons = document.querySelectorAll(
			'.ytpp-player__consent-button'
		);
		buttons[ 0 ].click();
		buttons[ 1 ].click();

		expect(
			document.querySelectorAll(
				'script[src="https://www.youtube.com/iframe_api"]'
			)
		).toHaveLength( 1 );
		expect( consentEvents ).toHaveBeenCalledTimes( 2 );
		expect(
			localStorage.getItem( 'ytpp-consent-v1:PL-test-playlist' )
		).toBe( '1' );

		const players = [];
		window.YT = {
			Player: jest.fn( ( target, options ) => {
				const player = {
					getPlaylist: () => [ 'video-one', 'video-two' ],
					getPlaylistIndex: () => 0,
					nextVideo: jest.fn(),
					playVideoAt: jest.fn(),
					previousVideo: jest.fn(),
				};
				players.push( { options, player, target } );
				return player;
			} ),
		};
		window.onYouTubeIframeAPIReady();
		await flushPromises();

		expect( previousReadyCallback ).toHaveBeenCalledTimes( 1 );
		expect( players ).toHaveLength( 2 );
		expect( players[ 0 ].target.tagName ).toBe( 'IFRAME' );
		const playerUrl = new URL( players[ 0 ].target.src );
		expect( playerUrl.origin ).toBe( 'https://www.youtube-nocookie.com' );
		expect( playerUrl.searchParams.get( 'autoplay' ) ).toBe( '0' );
		expect( playerUrl.searchParams.get( 'enablejsapi' ) ).toBe( '1' );
		expect( playerUrl.searchParams.get( 'index' ) ).toBe( '0' );
		expect( playerUrl.searchParams.get( 'list' ) ).toBe(
			'PL-test-playlist'
		);
		expect( playerUrl.searchParams.get( 'listType' ) ).toBe( 'playlist' );
		expect( playerUrl.searchParams.get( 'origin' ) ).toBe(
			window.location.origin
		);
		expect( players[ 0 ].target.referrerPolicy ).toBe(
			'origin-when-cross-origin'
		);

		players[ 0 ].options.events.onReady( { target: players[ 0 ].player } );
		expect(
			document.querySelector( '.ytpp-player__position' ).textContent
		).toBe( 'Video 1 of 2' );
		expect( document.querySelector( '.ytpp-player__first' ).disabled ).toBe(
			true
		);
		expect(
			document.querySelector( '.ytpp-player__previous' ).disabled
		).toBe( true );
		expect( document.querySelector( '.ytpp-player__next' ).disabled ).toBe(
			false
		);
		expect( document.querySelector( '.ytpp-player__last' ).disabled ).toBe(
			false
		);

		document.querySelector( '.ytpp-player__next' ).click();
		expect( players[ 0 ].player.nextVideo ).toHaveBeenCalledTimes( 1 );
		expect( players[ 1 ].player.nextVideo ).not.toHaveBeenCalled();

		players[ 0 ].options.events.onError();
		expect( document.querySelector( '.ytpp-player__first' ).disabled ).toBe(
			true
		);
		expect( document.querySelector( '.ytpp-player__last' ).disabled ).toBe(
			true
		);
		expect(
			document.querySelector( '.ytpp-player__status' ).textContent
		).toBe( 'The YouTube playlist could not be loaded.' );
	} );

	it( 'navigates to every boundary and updates controls by position', async () => {
		document.body.innerHTML = playerMarkup( false );
		const playlist = [ 'video-one', 'video-two', 'video-three' ];
		let index = 0;
		let events;
		const player = {
			getPlaylist: () => playlist,
			getPlaylistIndex: () => index,
			nextVideo: jest.fn(),
			playVideoAt: jest.fn(),
			previousVideo: jest.fn(),
		};
		window.YT = {
			Player: jest.fn( ( target, options ) => {
				events = options.events;
				return player;
			} ),
		};
		const { initializePlayers } = require( './view' );

		initializePlayers();
		await flushPromises();
		events.onReady( { target: player } );

		const firstButton = document.querySelector( '.ytpp-player__first' );
		const previousButton = document.querySelector(
			'.ytpp-player__previous'
		);
		const nextButton = document.querySelector( '.ytpp-player__next' );
		const lastButton = document.querySelector( '.ytpp-player__last' );
		const position = document.querySelector( '.ytpp-player__position' );

		expect( position.textContent ).toBe( 'Video 1 of 3' );
		expect( firstButton.disabled ).toBe( true );
		expect( previousButton.disabled ).toBe( true );
		expect( nextButton.disabled ).toBe( false );
		expect( lastButton.disabled ).toBe( false );

		index = 1;
		events.onStateChange( { target: player } );
		expect( position.textContent ).toBe( 'Video 2 of 3' );
		expect( firstButton.disabled ).toBe( false );
		expect( previousButton.disabled ).toBe( false );
		expect( nextButton.disabled ).toBe( false );
		expect( lastButton.disabled ).toBe( false );

		firstButton.click();
		previousButton.click();
		nextButton.click();
		lastButton.click();
		expect( player.playVideoAt ).toHaveBeenNthCalledWith( 1, 0 );
		expect( player.previousVideo ).toHaveBeenCalledTimes( 1 );
		expect( player.nextVideo ).toHaveBeenCalledTimes( 1 );
		expect( player.playVideoAt ).toHaveBeenNthCalledWith( 2, 2 );

		index = 2;
		events.onStateChange( { target: player } );
		expect( position.textContent ).toBe( 'Video 3 of 3' );
		expect( firstButton.disabled ).toBe( false );
		expect( previousButton.disabled ).toBe( false );
		expect( nextButton.disabled ).toBe( true );
		expect( lastButton.disabled ).toBe( true );
	} );

	it( 'disables every navigation action for a one-video playlist', async () => {
		document.body.innerHTML = playerMarkup( false );
		let events;
		const player = {
			getPlaylist: () => [ 'only-video' ],
			getPlaylistIndex: () => 0,
			nextVideo: jest.fn(),
			playVideoAt: jest.fn(),
			previousVideo: jest.fn(),
		};
		window.YT = {
			Player: jest.fn( ( target, options ) => {
				events = options.events;
				return player;
			} ),
		};
		const { initializePlayers } = require( './view' );

		initializePlayers();
		await flushPromises();
		events.onReady( { target: player } );

		expect(
			Array.from(
				document.querySelectorAll(
					'.ytpp-player__first, .ytpp-player__previous, .ytpp-player__next, .ytpp-player__last'
				)
			).every( ( button ) => button.disabled )
		).toBe( true );
		expect(
			document.querySelector( '.ytpp-player__position' ).textContent
		).toBe( 'Video 1 of 1' );
	} );

	it( 'reuses stored consent for the same playlist after a page load', async () => {
		localStorage.setItem( 'ytpp-consent-v1:PL-test-playlist', '1' );
		document.body.innerHTML = playerMarkup();
		window.YT = {
			Player: jest.fn( () => ( {
				getPlaylist: () => [],
				getPlaylistIndex: () => -1,
				nextVideo: jest.fn(),
				playVideoAt: jest.fn(),
				previousVideo: jest.fn(),
			} ) ),
		};
		const { initializePlayers } = require( './view' );

		initializePlayers();
		await flushPromises();

		expect( window.YT.Player ).toHaveBeenCalledTimes( 1 );
		expect(
			document.querySelector( '.ytpp-player' ).dataset.ytppState
		).toBe( 'initialized' );
		expect(
			document.querySelector( '.ytpp-player__target iframe' )
		).not.toBeNull();
	} );

	it( 'loads immediately when the local consent gate is disabled', async () => {
		document.body.innerHTML = playerMarkup( false );
		window.YT = {
			Player: jest.fn( () => ( {
				getPlaylist: () => [],
				getPlaylistIndex: () => -1,
				nextVideo: jest.fn(),
				playVideoAt: jest.fn(),
				previousVideo: jest.fn(),
			} ) ),
		};
		const { initializePlayers } = require( './view' );

		initializePlayers();
		await flushPromises();

		expect( window.YT.Player ).toHaveBeenCalledTimes( 1 );
		expect( document.querySelector( 'script' ) ).toBeNull();
	} );

	it( 'shows a retryable local error when the API script fails', async () => {
		document.body.innerHTML = playerMarkup();
		const { initializePlayers } = require( './view' );

		initializePlayers();
		const button = document.querySelector( '.ytpp-player__consent-button' );
		button.click();
		document
			.querySelector( 'script[src="https://www.youtube.com/iframe_api"]' )
			.dispatchEvent( new Event( 'error' ) );
		await flushPromises();

		expect( button.disabled ).toBe( false );
		expect( document.querySelector( 'script' ) ).toBeNull();
		expect(
			document.querySelector( '.ytpp-player__status' ).textContent
		).toBe( 'The YouTube playlist could not be loaded. Please try again.' );
		expect(
			document
				.querySelector( '.ytpp-player__status' )
				.getAttribute( 'role' )
		).toBe( 'alert' );

		button.click();
		expect(
			document.querySelector(
				'script[src="https://www.youtube.com/iframe_api"]'
			)
		).not.toBeNull();
	} );
} );
