function flushPromises() {
	return new Promise( ( resolve ) => {
		setTimeout( resolve, 0 );
	} );
}

function initializeController( playerImplementation ) {
	document.body.innerHTML =
		'<iframe id="ytpp-preview-player" src="https://www.youtube-nocookie.com/embed?list=PL-test-playlist"></iframe>';
	window.YT = {
		Player: jest.fn( playerImplementation ),
	};
	const postMessage = jest
		.spyOn( window.parent, 'postMessage' )
		.mockImplementation( () => {} );

	jest.resetModules();
	require( './editor-preview-controller' );

	return { postMessage, player: window.YT.Player };
}

describe( 'editor preview availability controller', () => {
	afterEach( () => {
		delete window.YT;
		delete window.onYouTubeIframeAPIReady;
		document.head.innerHTML = '';
		document.body.innerHTML = '';
		jest.restoreAllMocks();
	} );

	it( 'reports an available playlist to its direct parent', async () => {
		const { player, postMessage } = initializeController(
			( iframe, options ) => {
				options.events.onReady( {
					target: { getPlaylist: () => [ 'video-one' ] },
				} );
			}
		);

		await flushPromises();
		expect( player ).toHaveBeenCalledTimes( 1 );
		expect( postMessage ).toHaveBeenCalledWith(
			{ type: 'ytpp:availability-result', status: 'available' },
			window.location.origin
		);
	} );

	it( 'reports an empty ready playlist as unavailable', async () => {
		const { postMessage } = initializeController( ( iframe, options ) => {
			options.events.onReady( {
				target: { getPlaylist: () => [] },
			} );
		} );

		await flushPromises();

		expect( postMessage ).toHaveBeenCalledWith(
			{ type: 'ytpp:availability-result', status: 'unavailable' },
			window.location.origin
		);
	} );

	it( 'reports API loading failure as unknown', async () => {
		document.body.innerHTML =
			'<iframe id="ytpp-preview-player" src="https://www.youtube-nocookie.com/embed?list=PL-test-playlist"></iframe>';
		const postMessage = jest
			.spyOn( window.parent, 'postMessage' )
			.mockImplementation( () => {} );
		jest.resetModules();
		require( './editor-preview-controller' );

		const apiScript = document.querySelector(
			'script[src="https://www.youtube.com/iframe_api"]'
		);
		expect( apiScript ).not.toBeNull();
		apiScript.dispatchEvent( new Event( 'error' ) );
		await flushPromises();

		expect( postMessage ).toHaveBeenCalledWith(
			{ type: 'ytpp:availability-result', status: 'unknown' },
			window.location.origin
		);
	} );

	it.each( [
		[ 100, 'unavailable' ],
		[ 101, 'unavailable' ],
		[ 150, 'unavailable' ],
		[ 5, 'unknown' ],
		[ 153, 'unknown' ],
	] )( 'maps player error %d to %s', async ( error, status ) => {
		const { postMessage } = initializeController( ( iframe, options ) => {
			options.events.onError( { data: error } );
		} );

		await flushPromises();

		expect( postMessage ).toHaveBeenCalledWith(
			{ type: 'ytpp:availability-result', status },
			window.location.origin
		);
	} );
} );
