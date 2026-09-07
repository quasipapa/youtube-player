( () => {
	const apiUrl = 'https://www.youtube.com/iframe_api';
	const resultType = 'ytpp:availability-result';
	const unavailableErrors = [ 100, 101, 150 ];
	let apiPromise;

	function report( status ) {
		window.parent.postMessage(
			{ type: resultType, status },
			window.location.origin
		);
	}

	function loadApi() {
		if ( window.YT && window.YT.Player ) {
			return Promise.resolve( window.YT );
		}
		if ( apiPromise ) {
			return apiPromise;
		}

		apiPromise = new Promise( ( resolve, reject ) => {
			const previousReady = window.onYouTubeIframeAPIReady;
			window.onYouTubeIframeAPIReady = () => {
				if ( typeof previousReady === 'function' ) {
					previousReady();
				}
				if ( window.YT && window.YT.Player ) {
					resolve( window.YT );
				} else {
					reject( new Error( 'YouTube IFrame API unavailable' ) );
				}
			};

			const script = document.createElement( 'script' );
			script.src = apiUrl;
			script.async = true;
			script.addEventListener(
				'error',
				() => {
					apiPromise = undefined;
					script.remove();
					reject( new Error( 'YouTube IFrame API failed to load' ) );
				},
				{ once: true }
			);
			document.head.appendChild( script );
		} );

		return apiPromise;
	}

	function inspectPlayer( event ) {
		const playlist = event.target.getPlaylist();
		report(
			Array.isArray( playlist ) && playlist.length > 0
				? 'available'
				: 'unavailable'
		);
	}

	function createCheckedPlayer( youtube ) {
		const currentIframe = document.getElementById( 'ytpp-preview-player' );
		const checkedIframe = currentIframe.cloneNode( false );
		currentIframe.replaceWith( checkedIframe );

		new youtube.Player( checkedIframe, {
			events: {
				onReady: inspectPlayer,
				onError: ( event ) => {
					report(
						unavailableErrors.includes( event.data )
							? 'unavailable'
							: 'unknown'
					);
				},
			},
		} );
	}

	loadApi()
		.then( createCheckedPlayer )
		.catch( () => report( 'unknown' ) );
} )();
