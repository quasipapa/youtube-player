function playerMarkup( requireConsent = true ) {
	return `
		<div class="ytpp-player" data-playlist-id="PL-test-playlist" data-require-consent="${ requireConsent }">
			<div class="ytpp-player__target" tabindex="-1">
				${
					requireConsent
						? '<button class="ytpp-player__consent-button">Load</button>'
						: '<p class="ytpp-player__placeholder">Loading</p>'
				}
			</div>
			<p class="ytpp-player__status" role="status" aria-live="polite"></p>
			<p class="ytpp-player__error" role="alert"></p>
			<button class="ytpp-player__retry" hidden>Retry</button>
			<button class="ytpp-player__first" disabled>First</button>
			<button class="ytpp-player__previous" disabled>Previous</button>
			<output class="ytpp-player__position" role="status"></output>
			<button class="ytpp-player__next" disabled>Next</button>
			<button class="ytpp-player__last" disabled>Last</button>
		</div>`;
}

async function flushPromises() {
	await Promise.resolve();
	await Promise.resolve();
}

function mockYoutube() {
	const players = [];
	window.YT = {
		Player: jest.fn( ( target, { events } ) => {
			const player = {
				index: 0,
				getPlaylist: () => [ 'one', 'two', 'three' ],
				getPlaylistIndex: () => player.index,
				playVideoAt: jest.fn( ( index ) => {
					player.index = index;
					events.onStateChange( { target: player } );
				} ),
				cuePlaylist: jest.fn( ( { index } ) => {
					player.index = index;
					events.onStateChange( { target: player } );
				} ),
				nextVideo: jest.fn( () =>
					player.playVideoAt( player.index + 1 )
				),
				previousVideo: jest.fn( () =>
					player.playVideoAt( player.index - 1 )
				),
				destroy: jest.fn(),
			};
			players.push( { player, events } );
			return player;
		} ),
	};
	return players;
}

describe( 'privacy-aware frontend player', () => {
	beforeEach( () => {
		jest.useFakeTimers();
		document.head.innerHTML = '';
		document.body.innerHTML = '';
		delete window.YT;
		delete window.onYouTubeIframeAPIReady;
		localStorage.clear();
		jest.resetModules();
	} );
	afterEach( () => {
		jest.clearAllTimers();
		jest.useRealTimers();
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
					cuePlaylist: jest.fn(),
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
		).toBe( '1 / 2' );
		expect(
			document
				.querySelector( '.ytpp-player__position' )
				.getAttribute( 'aria-label' )
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
		expect( players[ 0 ].player.cuePlaylist ).toHaveBeenCalledWith( {
			listType: 'playlist',
			list: 'PL-test-playlist',
			index: 1,
		} );
		expect( players[ 0 ].player.nextVideo ).not.toHaveBeenCalled();
		expect( players[ 1 ].player.cuePlaylist ).not.toHaveBeenCalled();

		players[ 0 ].options.events.onError();
		expect( document.querySelector( '.ytpp-player__first' ).disabled ).toBe(
			true
		);
		expect( document.querySelector( '.ytpp-player__last' ).disabled ).toBe(
			true
		);
		expect(
			document.querySelector( '.ytpp-player__error' ).textContent
		).toBe( 'The YouTube playlist could not be loaded. Please try again.' );
		document.removeEventListener( 'ytpp:consent', consentEvents );
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
			cuePlaylist: jest.fn(),
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

		expect( position.textContent ).toBe( '1 / 3' );
		expect( firstButton.disabled ).toBe( true );
		expect( previousButton.disabled ).toBe( true );
		expect( nextButton.disabled ).toBe( false );
		expect( lastButton.disabled ).toBe( false );

		index = 1;
		events.onStateChange( { target: player } );
		expect( position.textContent ).toBe( '2 / 3' );
		expect( firstButton.disabled ).toBe( false );
		expect( previousButton.disabled ).toBe( false );
		expect( nextButton.disabled ).toBe( false );
		expect( lastButton.disabled ).toBe( false );

		firstButton.click();
		previousButton.click();
		nextButton.click();
		lastButton.click();
		expect( player.cuePlaylist ).toHaveBeenNthCalledWith( 1, {
			listType: 'playlist',
			list: 'PL-test-playlist',
			index: 0,
		} );
		expect( player.cuePlaylist ).toHaveBeenNthCalledWith( 2, {
			listType: 'playlist',
			list: 'PL-test-playlist',
			index: 0,
		} );
		expect( player.cuePlaylist ).toHaveBeenNthCalledWith( 3, {
			listType: 'playlist',
			list: 'PL-test-playlist',
			index: 2,
		} );
		expect( player.cuePlaylist ).toHaveBeenNthCalledWith( 4, {
			listType: 'playlist',
			list: 'PL-test-playlist',
			index: 2,
		} );
		expect( player.playVideoAt ).not.toHaveBeenCalled();
		expect( player.previousVideo ).not.toHaveBeenCalled();
		expect( player.nextVideo ).not.toHaveBeenCalled();

		index = 2;
		events.onStateChange( { target: player } );
		expect( position.textContent ).toBe( '3 / 3' );
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
			cuePlaylist: jest.fn(),
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
		).toBe( '1 / 1' );
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

		expect(
			document.querySelector( '.ytpp-player__consent-button' ).disabled
		).toBe( false );
		expect( document.querySelector( 'script' ) ).toBeNull();
		expect(
			document.querySelector( '.ytpp-player__error' ).textContent
		).toBe( 'The YouTube playlist could not be loaded. Please try again.' );
		expect(
			document
				.querySelector( '.ytpp-player__error' )
				.getAttribute( 'role' )
		).toBe( 'alert' );

		document.querySelector( '.ytpp-player__retry' ).click();
		expect(
			document.querySelector(
				'script[src="https://www.youtube.com/iframe_api"]'
			)
		).not.toBeNull();
	} );

	it.each( [ 'button', 'storage', 'configuration', 'integration' ] )(
		'allows a manager to veto %s before any network request or stored choice',
		async ( source ) => {
			document.body.innerHTML = playerMarkup(
				source !== 'configuration'
			);
			const container = document.querySelector( '.ytpp-player' );
			const veto = jest.fn( ( event ) => event.preventDefault() );
			container.addEventListener( 'ytpp:before-load', veto );
			if ( source === 'storage' ) {
				localStorage.setItem( 'ytpp-consent-v1:PL-test-playlist', '1' );
			}
			const { initializePlayers } = require( './view' );
			initializePlayers();
			if ( source === 'button' ) {
				container.querySelector( 'button' ).click();
			} else if ( source === 'integration' ) {
				container.dispatchEvent(
					new CustomEvent( 'ytpp:grant-consent' )
				);
			}
			await flushPromises();
			expect( veto ).toHaveBeenCalledTimes( 1 );
			expect( veto.mock.calls[ 0 ][ 0 ].detail.source ).toBe( source );
			expect( document.querySelector( 'script, iframe' ) ).toBeNull();
			expect( localStorage.length ).toBe( source === 'storage' ? 1 : 0 );
		}
	);

	it( 'cancels a pending activation on revocation and allows a fresh grant', async () => {
		document.body.innerHTML = playerMarkup();
		const { initializePlayers } = require( './view' );
		initializePlayers();
		const container = document.querySelector( '.ytpp-player' );
		container.querySelector( 'button' ).click();
		container.dispatchEvent( new CustomEvent( 'ytpp:revoke-consent' ) );
		const players = mockYoutube();
		window.onYouTubeIframeAPIReady();
		await flushPromises();
		expect( players ).toHaveLength( 0 );
		expect( localStorage.length ).toBe( 0 );
		container.dispatchEvent( new CustomEvent( 'ytpp:grant-consent' ) );
		await flushPromises();
		expect( players ).toHaveLength( 1 );
		expect( localStorage.length ).toBe( 0 );
	} );

	it( 'destroys only the revoked block and ignores its stale player events', async () => {
		document.body.innerHTML = playerMarkup( false ) + playerMarkup( false );
		const players = mockYoutube();
		const { initializePlayers } = require( './view' );
		initializePlayers();
		await flushPromises();
		const containers = document.querySelectorAll( '.ytpp-player' );
		const { player, events } = players[ 0 ];
		events.onReady( { target: player } );
		containers[ 0 ].dispatchEvent(
			new CustomEvent( 'ytpp:revoke-consent' )
		);
		events.onReady( { target: player } );
		events.onStateChange( { target: player } );
		expect( player.destroy ).toHaveBeenCalledTimes( 1 );
		expect( containers[ 0 ].querySelector( 'iframe' ) ).toBeNull();
		expect(
			containers[ 0 ].querySelector( '.ytpp-player__next' ).disabled
		).toBe( true );
		expect( containers[ 1 ].querySelector( 'iframe' ) ).not.toBeNull();
		expect( players[ 1 ].player.destroy ).not.toHaveBeenCalled();
		containers[ 0 ].dispatchEvent(
			new CustomEvent( 'ytpp:grant-consent' )
		);
		await flushPromises();
		players[ 2 ].events.onReady( { target: players[ 2 ].player } );
		containers[ 0 ].querySelector( '.ytpp-player__next' ).click();
		expect( players[ 2 ].player.cuePlaylist ).toHaveBeenCalledWith( {
			listType: 'playlist',
			list: 'PL-test-playlist',
			index: 1,
		} );
		expect( player.nextVideo ).not.toHaveBeenCalled();
	} );

	it( 'keeps keyboard focus through loading and navigation boundaries', async () => {
		document.body.innerHTML = playerMarkup();
		const players = mockYoutube();
		const { initializePlayers } = require( './view' );
		initializePlayers();
		const button = document.querySelector( '.ytpp-player__consent-button' );
		button.focus();
		button.click();
		await flushPromises();
		const { player, events } = players[ 0 ];
		events.onReady( { target: player } );
		expect( document.activeElement.tagName ).toBe( 'IFRAME' );
		const last = document.querySelector( '.ytpp-player__last' );
		last.focus();
		last.click();
		expect( document.activeElement ).toBe(
			document.querySelector( '.ytpp-player__first' )
		);
		expect(
			document
				.querySelector( '.ytpp-player__position' )
				.getAttribute( 'aria-label' )
		).toBe( 'Video 3 of 3' );
		expect( document.querySelector( 'iframe' ).title ).toBe(
			'Video 3 of 3'
		);
	} );

	it( 'does not steal focus if the visitor leaves the block while loading', async () => {
		document.body.innerHTML =
			playerMarkup() + '<button id="outside">Outside</button>';
		const players = mockYoutube();
		const { initializePlayers } = require( './view' );
		initializePlayers();
		document.querySelector( '.ytpp-player__consent-button' ).click();
		const outside = document.querySelector( '#outside' );
		outside.focus();
		await flushPromises();
		players[ 0 ].events.onReady( { target: players[ 0 ].player } );
		expect( document.activeElement ).toBe( outside );
	} );

	it.each( [ 'api', 'player' ] )(
		'offers retry after an unresponsive %s times out',
		async ( stage ) => {
			document.body.innerHTML = playerMarkup( false );
			if ( stage === 'player' ) {
				mockYoutube();
			}
			const { initializePlayers } = require( './view' );
			initializePlayers();
			await flushPromises();
			jest.advanceTimersByTime( 15000 );
			await flushPromises();
			expect(
				document.querySelector( '.ytpp-player__retry' ).hidden
			).toBe( false );
			expect(
				document.querySelector( '.ytpp-player__error' ).textContent
			).toContain( 'Please try again.' );
			expect( document.querySelector( 'iframe' ) ).toBeNull();
		}
	);
} );
