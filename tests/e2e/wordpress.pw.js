const { test, expect } = require( '@playwright/test' );

const baseURL = process.env.WP_E2E_BASE_URL;
const playlistId = 'PLpGa2TIfKL3ESCccL_giri9ZdFI0QLK_I';

test.describe( 'WordPress editor and frontend integration', () => {
	test.skip(
		! baseURL,
		'Set WP_E2E_BASE_URL to run against the isolated WordPress test instance.'
	);

	test( 'stores block attributes and renders the privacy gate', async ( {
		page,
	} ) => {
		const externalRequests = [];
		page.on( 'request', ( request ) => {
			const host = new URL( request.url() ).hostname;
			if (
				host.includes( 'youtube.com' ) ||
				host.includes( 'youtube-nocookie.com' ) ||
				host.includes( 'googlevideo.com' )
			) {
				externalRequests.push( request.url() );
			}
		} );

		await page.goto( `${ baseURL }/wp-login.php` );
		await page.locator( '#user_login' ).fill( 'admin' );
		await page.locator( '#user_pass' ).fill( 'password' );
		await Promise.all( [
			page.waitForURL( /wp-admin/ ),
			page.locator( '#wp-submit' ).click(),
		] );

		await page.goto( `${ baseURL }/wp-admin/post-new.php` );
		await page.waitForFunction( () =>
			Boolean(
				window.wp?.blocks && window.wp?.data?.select( 'core/editor' )
			)
		);

		const saved = await page.evaluate(
			async ( attributes ) => {
				const block = window.wp.blocks.createBlock(
					'yt-playlist-player/player',
					attributes
				);
				window.wp.data
					.dispatch( 'core/block-editor' )
					.resetBlocks( [ block ] );
				window.wp.data.dispatch( 'core/editor' ).editPost( {
					title: 'Automated playlist player test',
					status: 'publish',
				} );
				await window.wp.data.dispatch( 'core/editor' ).savePost();
				return {
					id: window.wp.data
						.select( 'core/editor' )
						.getCurrentPostId(),
					permalink: window.wp.data
						.select( 'core/editor' )
						.getPermalink(),
				};
			},
			{
				playlistId,
				playlistTitle: 'Automated playlist',
				showPlaylistTitle: true,
				requireConsent: true,
				aspectRatio: '4:3',
			}
		);

		expect( saved.id ).toBeGreaterThan( 0 );
		await page.goto(
			`${ baseURL }/wp-admin/post.php?post=${ saved.id }&action=edit`
		);
		await page.waitForFunction(
			() =>
				window.wp?.data?.select( 'core/block-editor' )?.getBlocks()
					.length > 0
		);
		const attributes = await page.evaluate(
			() =>
				window.wp.data.select( 'core/block-editor' ).getBlocks()[ 0 ]
					.attributes
		);
		expect( attributes ).toMatchObject( {
			playlistId,
			playlistTitle: 'Automated playlist',
			showPlaylistTitle: true,
			requireConsent: true,
			aspectRatio: '4:3',
		} );

		externalRequests.length = 0;
		await page.goto( saved.permalink );
		await expect(
			page.getByText( 'Automated playlist', { exact: true } )
		).toBeVisible();
		await expect(
			page.getByRole( 'button', { name: 'Load YouTube playlist' } )
		).toBeVisible();
		await expect( page.locator( '.ytpp-player' ) ).toHaveAttribute(
			'style',
			/--ytpp-aspect-ratio:1\.333/
		);
		expect( externalRequests ).toEqual( [] );
		expect( await page.locator( '.ytpp-player iframe' ).count() ).toBe( 0 );
	} );
} );
