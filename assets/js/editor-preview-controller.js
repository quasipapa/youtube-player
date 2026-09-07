( () => {
	if ( typeof window.ytppEditorPreviewControllerCleanup === 'function' ) {
		window.ytppEditorPreviewControllerCleanup();
	}

	const apiUrl = 'https://www.youtube.com/iframe_api';
	const requestType = 'ytpp:check-availability';
	const resultType = 'ytpp:availability-result';
	const unavailableErrors = [ 100, 101, 150 ];
	let apiPromise;
	let checking = false;
	let finalStatus = '';

	function report( status ) {
		if ( status === 'available' || status === 'unavailable' ) {
			finalStatus = status;
		}
		checking = false;
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

	function receiveCheckRequest( event ) {
		if (
			event.source !== window.parent ||
			event.origin !== window.location.origin ||
			! event.data ||
			event.data.type !== requestType
		) {
			return;
		}

		if ( finalStatus ) {
			report( finalStatus );
			return;
		}
		if ( checking ) {
			return;
		}

		checking = true;
		loadApi()
			.then( createCheckedPlayer )
			.catch( () => report( 'unknown' ) );
	}

	window.addEventListener( 'message', receiveCheckRequest );
	window.ytppEditorPreviewControllerCleanup = () => {
		window.removeEventListener( 'message', receiveCheckRequest );
	};
} )();
