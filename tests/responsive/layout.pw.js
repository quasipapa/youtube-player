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
				expect( bounds.height ).toBeGreaterThanOrEqual( 44 );
			}
		} );
	}
}

test( 'navigation wraps in a narrow content column', async ( { page } ) => {
	await page.setContent(
		`<style>${ css }</style><main style="width:200px">${ fixtures[ 0 ] }</main>`
	);
	const buttons = page.locator( 'nav button' );
	const first = await buttons.nth( 0 ).boundingBox();
	const previous = await buttons.nth( 1 ).boundingBox();
	expect( previous.y ).toBeGreaterThan( first.y );
	expect(
		await page
			.locator( 'main' )
			.evaluate(
				( element ) => element.scrollWidth <= element.clientWidth
			)
	).toBe( true );
} );
