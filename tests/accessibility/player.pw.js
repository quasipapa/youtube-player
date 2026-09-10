const { test, expect } = require( '@playwright/test' );
const AxeBuilder = require( '@axe-core/playwright' ).default;
const { execFileSync } = require( 'node:child_process' );
const { readFileSync } = require( 'node:fs' );
const path = require( 'node:path' );

const root = path.resolve( __dirname, '../..' );
const css = readFileSync( path.join( root, 'build/style-index.css' ), 'utf8' );
const script = readFileSync( path.join( root, 'build/view.js' ), 'utf8' );
let fixtures;

test.beforeAll( () => {
	fixtures = [ true, false ].map( ( requireConsent ) =>
		execFileSync(
			'docker',
			[
				'run',
				'--rm',
				'--volume',
				`${ root }:/app`,
				'--workdir',
				'/app',
				'composer:2.9.5',
				'php',
				'tests/responsive/render.php',
				JSON.stringify( {
					playlistId: 'PL-test-playlist',
					requireConsent,
				} ),
			],
			{ encoding: 'utf8' }
		)
	);
} );

// Exercise the production view script with a deterministic, local YouTube double.
function installMockPlayer() {
	window.ytppTestPlayers = [];
	window.YT = {
		Player: function ( iframe, { events } ) {
			let index = 0;
			const player = {
				getPlaylist: () => [ 'one', 'two', 'three' ],
				getPlaylistIndex: () => index,
				playVideoAt: ( value ) => {
					index = value;
					events.onStateChange( { target: player } );
				},
				cuePlaylist: ( { index: value } ) => {
					index = value;
					events.onStateChange( { target: player } );
				},
				nextVideo: () => player.playVideoAt( index + 1 ),
				previousVideo: () => player.playVideoAt( index - 1 ),
				destroy: () => iframe.remove(),
			};
			window.ytppTestPlayers.push( { player, events } );
			setTimeout( () => events.onReady( { target: player } ), 0 );
			return player;
		},
	};
	window.onYouTubeIframeAPIReady();
}

async function openFixture(
	page,
	{ requireConsent = true, count = 1, veto = false, apiFailure = false } = {}
) {
	const requests = [];
	await page.addInitScript( ( shouldVeto ) => {
		window.wp = {
			i18n: {
				__: ( text ) => text,
				sprintf: ( text, ...args ) =>
					text.replace(
						/%(\d+)\$d/g,
						( _, index ) => args[ Number( index ) - 1 ]
					),
			},
		};
		window.ytppTestVeto = shouldVeto;
		document.addEventListener( 'ytpp:before-load', ( event ) => {
			if ( window.ytppTestVeto ) {
				event.preventDefault();
			}
		} );
	}, veto );
	await page.route( '**/*', async ( route ) => {
		const url = new URL( route.request().url() );
		if ( url.hostname === 'ytpp.test' ) {
			return route.fulfill( {
				contentType: 'text/html',
				body: `<!doctype html><html lang="en"><head><title>Player accessibility test</title><style>body { background: #fff; color: #1e1e1e; } ${ css }</style></head><body><button id="before">Before</button><main>${ fixtures[
					requireConsent ? 0 : 1
				].repeat(
					count
				) }</main><button id="after">After</button><script>${ script }</script></body></html>`,
			} );
		}
		requests.push( url.href );
		if ( url.href === 'https://www.youtube.com/iframe_api' ) {
			return apiFailure
				? route.abort()
				: route.fulfill( {
						contentType: 'application/javascript',
						body: `(${ installMockPlayer.toString() })();`,
				  } );
		}
		if ( url.hostname === 'www.youtube-nocookie.com' ) {
			return route.fulfill( {
				contentType: 'text/html',
				body: '<!doctype html><html lang="en"><title>Mock player</title><body><button>Mock playback</button></body></html>',
			} );
		}
		return route.abort();
	} );
	await page.goto( 'http://ytpp.test/' );
	return requests;
}

async function audit( page ) {
	const result = await new AxeBuilder( { page } )
		.include( '.ytpp-player' )
		.exclude( 'iframe' )
		.withTags( [ 'wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa' ] )
		.analyze();
	expect( result.violations ).toEqual( [] );
}

test( 'keyboard consent, all four actions, boundary focus and exit', async ( {
	page,
} ) => {
	const requests = await openFixture( page );
	expect( requests ).toEqual( [] );
	await page.keyboard.press( 'Tab' );
	await expect( page.locator( '#before' ) ).toBeFocused();
	await page.keyboard.press( 'Tab' );
	const consent = page.getByRole( 'button', {
		name: 'Load YouTube playlist',
	} );
	await expect( consent ).toBeFocused();
	await expect( consent ).toHaveCSS( 'outline-style', 'solid' );
	await audit( page );
	await page.keyboard.press( 'Enter' );
	await expect( page.locator( 'iframe' ) ).toBeFocused();
	await expect(
		page.getByRole( 'region', { name: 'YouTube playlist player' } )
	).toBeVisible();
	await expect(
		page.getByRole( 'status', { name: 'Video 1 of 3' } )
	).toBeVisible();
	await expect(
		page.getByTitle( 'YouTube playlist player: Video 1 of 3' )
	).toBeVisible();
	const playback = page
		.frameLocator( 'iframe' )
		.getByRole( 'button', { name: 'Mock playback' } );
	await expect( playback ).toBeVisible();
	await page.keyboard.press( 'Tab' );
	await expect( playback ).toBeFocused();
	await page.keyboard.press( 'Tab' );
	const next = page.getByRole( 'button', {
		name: 'Next video',
		exact: true,
	} );
	await expect( next ).toBeFocused();
	await page.keyboard.press( 'Space' );
	await expect( page.locator( '.ytpp-player__position-visual' ) ).toHaveText(
		'2 / 3'
	);
	await expect( next ).toBeFocused();
	await page.keyboard.press( 'Shift+Tab' );
	await expect(
		page.getByRole( 'button', { name: 'Previous video' } )
	).toBeFocused();
	await page.keyboard.press( 'Enter' );
	await expect( next ).toBeFocused();
	await page.keyboard.press( 'Tab' );
	await page.keyboard.press( 'Enter' );
	const first = page.getByRole( 'button', { name: 'First video' } );
	await expect( first ).toBeFocused();
	await expect( page.locator( '.ytpp-player__position-visual' ) ).toHaveText(
		'3 / 3'
	);
	await page.keyboard.press( 'Enter' );
	await expect( next ).toBeFocused();
	await page.keyboard.press( 'Tab' );
	await page.keyboard.press( 'Tab' );
	await expect( page.locator( '#after' ) ).toBeFocused();
	await audit( page );
	expect(
		requests.some( ( url ) =>
			url.startsWith( 'https://www.youtube-nocookie.com/embed?' )
		)
	).toBe( true );
} );

test( 'API errors are announced and keyboard retry remains reachable', async ( {
	page,
} ) => {
	await openFixture( page, { apiFailure: true } );
	await page.keyboard.press( 'Tab' );
	await page.keyboard.press( 'Tab' );
	await page.keyboard.press( 'Enter' );
	const retry = page.getByRole( 'button', {
		name: 'Retry loading playlist',
	} );
	await expect( retry ).toBeFocused();
	await expect( page.getByRole( 'alert' ) ).toContainText(
		'Please try again.'
	);
	await expect( page.locator( '.ytpp-player__video' ) ).toHaveAttribute(
		'aria-busy',
		'false'
	);
	await audit( page );
} );

test( 'external veto, grant, revoke and renewed grant stay isolated per block', async ( {
	page,
} ) => {
	const requests = await openFixture( page, {
		requireConsent: false,
		count: 2,
		veto: true,
	} );
	await expect(
		page.locator( '.ytpp-player__status' ).first()
	).toContainText( 'blocked by the consent manager' );
	expect( requests ).toEqual( [] );
	await page.evaluate( () => {
		window.ytppTestVeto = false;
	} );
	const first = page.locator( '.ytpp-player' ).first();
	const second = page.locator( '.ytpp-player' ).nth( 1 );
	for ( const block of [ first, second ] ) {
		await block.dispatchEvent( 'ytpp:grant-consent' );
		await expect(
			block.locator( '.ytpp-player__position-visual' )
		).toHaveText( '1 / 3' );
	}
	await first.dispatchEvent( 'ytpp:revoke-consent' );
	await expect( first.locator( 'iframe' ) ).toHaveCount( 0 );
	await expect( second.locator( 'iframe' ) ).toHaveCount( 1 );
	await expect(
		first.getByRole( 'button', { name: 'Next video' } )
	).toBeDisabled();
	await first.dispatchEvent( 'ytpp:grant-consent' );
	await expect( first.locator( '.ytpp-player__position-visual' ) ).toHaveText(
		'1 / 3'
	);
	await first.getByRole( 'button', { name: 'Next video' } ).click();
	await expect( first.locator( '.ytpp-player__position-visual' ) ).toHaveText(
		'2 / 3'
	);
	await expect(
		second.locator( '.ytpp-player__position-visual' )
	).toHaveText( '1 / 3' );
	expect( await page.evaluate( () => localStorage.length ) ).toBe( 0 );
} );

test( 'default contrast and focus remain usable on light and dark themes', async ( {
	page,
} ) => {
	await openFixture( page );
	const colors = await page
		.locator( '.ytpp-player__consent-button' )
		.evaluate( ( element ) => {
			const style = getComputedStyle( element );
			return [ style.color, style.backgroundColor, style.borderTopColor ];
		} );
	const luminance = ( color ) =>
		color
			.match( /\d+/g )
			.slice( 0, 3 )
			.map( ( value ) => {
				const s = Number( value ) / 255;
				return s <= 0.04045
					? s / 12.92
					: ( ( s + 0.055 ) / 1.055 ) ** 2.4;
			} )
			.reduce(
				( sum, value, index ) =>
					sum + value * [ 0.2126, 0.7152, 0.0722 ][ index ],
				0
			);
	const contrast = ( a, b ) =>
		( Math.max( luminance( a ), luminance( b ) ) + 0.05 ) /
		( Math.min( luminance( a ), luminance( b ) ) + 0.05 );
	expect( contrast( colors[ 0 ], colors[ 1 ] ) ).toBeGreaterThanOrEqual(
		4.5
	);
	expect( contrast( colors[ 2 ], colors[ 1 ] ) ).toBeGreaterThanOrEqual( 3 );
	await page.addStyleTag( { content: 'body{background:#111;color:#fff}' } );
	await page.keyboard.press( 'Tab' );
	await page.keyboard.press( 'Tab' );
	await expect(
		page.getByRole( 'button', { name: 'Load YouTube playlist' } )
	).toHaveCSS( 'box-shadow', 'rgb(255, 255, 255) 0px 0px 0px 6px' );
	await audit( page );
	await page.emulateMedia( { forcedColors: 'active' } );
	await expect(
		page.getByRole( 'button', { name: 'Load YouTube playlist' } )
	).toHaveCSS( 'outline-style', 'solid' );
} );
