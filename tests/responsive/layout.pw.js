const { test, expect } = require( '@playwright/test' );
const { execFileSync } = require( 'node:child_process' );
const { readFileSync } = require( 'node:fs' );
const path = require( 'node:path' );

const root = path.resolve( __dirname, '../..' );
const css = readFileSync( path.join( root, 'build/style-index.css' ), 'utf8' );
const scenarios = [
	{ name: 'default', attributes: {}, ratio: 16 / 9 },
	{
		name: 'width limit',
		attributes: { maxWidth: '640' },
		ratio: 16 / 9,
		width: 640,
	},
	{
		name: 'height limit',
		attributes: { maxHeight: '300', aspectRatio: '4:3' },
		ratio: 4 / 3,
		height: 300,
	},
	{
		name: 'both limits',
		attributes: { maxWidth: '600', maxHeight: '400', aspectRatio: '1:1' },
		ratio: 1,
		width: 600,
		height: 400,
	},
	{
		name: 'portrait',
		attributes: {
			aspectRatio: 'custom',
			customAspectRatio: '9:16',
			maxHeight: '600',
		},
		ratio: 9 / 16,
		height: 600,
	},
	...[ 'wide', 'full', 'center', 'left', 'right' ].map( ( alignment ) => ( {
		name: `${ alignment } alignment`,
		attributes: { align: alignment, maxWidth: '320' },
		ratio: 16 / 9,
		width: 320,
	} ) ),
];
let fixtures;
test.beforeAll( () => {
	fixtures = scenarios.map( ( scenario ) =>
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
					showPlaylistTitle: true,
					playlistTitle: 'A long playlist title '.repeat( 8 ),
					...scenario.attributes,
				} ),
			],
			{ encoding: 'utf8' }
		)
	);
} );

for ( const viewport of [ 320, 768, 1440 ] ) {
	for ( const [ index, scenario ] of scenarios.entries() ) {
		test( `${ scenario.name } at ${ viewport }px`, async ( { page } ) => {
			await page.setViewportSize( { width: viewport, height: 1000 } );
			await page.route( '**/*', ( route ) => route.abort() );
			await page.setContent(
				`<style>body{margin:16px} ${ css }</style><main>${ fixtures[ index ] }</main>`
			);
			const video = page.locator( '.ytpp-player__video' );
			const box = await video.boundingBox();
			expect( box.width ).toBeLessThanOrEqual(
				Math.min( viewport - 32, scenario.width || Infinity ) + 1
			);
			expect( box.height ).toBeLessThanOrEqual(
				( scenario.height || Infinity ) + 1
			);
			expect( box.height ).toBeGreaterThanOrEqual( 200 );
			expect(
				Math.abs(
					box.height - Math.max( 200, box.width / scenario.ratio )
				)
			).toBeLessThan( 1 );
			expect(
				await page.evaluate(
					() =>
						document.documentElement.scrollWidth <=
						window.innerWidth
				)
			).toBe( true );
			await expect(
				page.getByRole( 'button', { name: 'Load YouTube playlist' } )
			).toBeInViewport();
			// Mimic the API replacing its target, retaining the production dimensions.
			await page
				.locator( '.ytpp-player__target' )
				.evaluate( ( target ) => {
					const iframe = document.createElement( 'iframe' );
					iframe.title = 'Mock YouTube player';
					target.replaceWith( iframe );
				} );
			const iframeBox = await page.locator( 'iframe' ).boundingBox();
			expect( Math.abs( iframeBox.height - box.height ) ).toBeLessThan(
				1
			);
			expect( Math.abs( iframeBox.width - box.width ) ).toBeLessThan( 1 );
			for ( const button of await page.locator( 'nav button' ).all() ) {
				const bounds = await button.boundingBox();
				expect( bounds.x ).toBeGreaterThanOrEqual( box.x );
				expect( bounds.x + bounds.width ).toBeLessThanOrEqual(
					box.x + box.width + 1
				);
				expect( bounds.height ).toBe( 32 );
				expect( bounds.width ).toBe( 48 );
			}
		} );
	}
}

test( 'navigation keeps button pairs together in a narrow content column', async ( {
	page,
} ) => {
	await page.setContent(
		`<style>${ css }</style><main style="width:200px;font-size:24px">${ fixtures[ 0 ] }</main>`
	);
	const position = page.locator( '.ytpp-player__position' );
	await position.evaluate( ( element ) => {
		element.textContent = '1000 / 1000';
	} );
	await expect( position ).toHaveCSS( 'font-size', '16px' );
	const buttons = page.locator( 'nav button' );
	const first = await buttons.nth( 0 ).boundingBox();
	const previous = await buttons.nth( 1 ).boundingBox();
	expect( previous.y ).toBe( first.y );
	expect( previous.x - first.x - first.width ).toBe( 12 );
	const next = await buttons.nth( 2 ).boundingBox();
	const last = await buttons.nth( 3 ).boundingBox();
	expect( last.y ).toBe( next.y );
	expect( last.x - next.x - next.width ).toBe( 12 );
	for ( const button of await buttons.all() ) {
		const bounds = await button.boundingBox();
		expect( bounds.width ).toBe( 48 );
		expect( bounds.height ).toBe( 32 );
	}
	expect(
		await page
			.locator( 'main' )
			.evaluate(
				( element ) => element.scrollWidth <= element.clientWidth
			)
	).toBe( true );
} );

test( 'left and right alignment float beside following text on desktop', async ( {
	page,
} ) => {
	for ( const alignment of [ 'left', 'right' ] ) {
		const fixture = execFileSync(
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
					align: alignment,
					maxWidth: '320',
				} ),
			],
			{ encoding: 'utf8' }
		);
		await page.setViewportSize( { width: 1000, height: 1000 } );
		await page.setContent(
			`<style>${ css }</style><main style="width:900px"><div>${ fixture }</div><p class="following">${ 'Following text '.repeat(
				80
			) }</p></main>`
		);
		const player = page.locator( '.ytpp-player' );
		await expect( player ).toHaveCSS( 'float', alignment );
		const playerBox = await player.boundingBox();
		const textBox = await page
			.locator( '.following' )
			.evaluate( ( element ) => {
				const range = document.createRange();
				range.setStart( element.firstChild, 0 );
				range.setEnd( element.firstChild, 12 );
				const rect = range.getBoundingClientRect();
				return { x: rect.x, right: rect.right };
			} );
		if ( alignment === 'left' ) {
			expect( textBox.x ).toBeGreaterThan(
				playerBox.x + playerBox.width
			);
		} else {
			expect( textBox.right ).toBeLessThan( playerBox.x );
		}
	}
} );

test( 'side alignment falls back to full width on a narrow viewport', async ( {
	page,
} ) => {
	await page.setViewportSize( { width: 320, height: 1000 } );
	for ( const alignment of [ 'left', 'right' ] ) {
		await page.setContent(
			`<style>${ css }</style><main style="width:288px">${
				fixtures[ alignment === 'left' ? 8 : 9 ]
			}</main>`
		);
		const player = page.locator( `.ytpp-player.align${ alignment }` );
		await expect( player ).toHaveCSS( 'float', 'none' );
		const box = await player.boundingBox();
		expect( box.width ).toBeLessThanOrEqual( 288 );
	}
} );
