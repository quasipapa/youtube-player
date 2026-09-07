import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	Disabled,
	Button,
	PanelBody,
	Placeholder,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';
import { useEffect, useRef, useState } from '@wordpress/element';

import './editor.scss';
import { forgetConsent } from './consent-storage';
import {
	parsePlaylistInput,
	VALIDATION_INVALID,
	VALIDATION_VALID,
} from './playlist-parser';

const AVAILABILITY_IDLE = 'idle';
const AVAILABILITY_CHECKING = 'checking';
const AVAILABILITY_AVAILABLE = 'available';
const AVAILABILITY_UNAVAILABLE = 'unavailable';
const AVAILABILITY_UNKNOWN = 'unknown';
const AVAILABILITY_TIMEOUT = 15000;

const NAVIGATION_ICON_PATHS = {
	first: 'm17.5 18-9-6 9-6zM8 6.5v11H6.5v-11z',
	previous: 'M14.6 7l-1.2-1L8 12l5.4 6 1.2-1-4.6-5z',
	next: 'M10.6 6L9.4 7l4.6 5-4.6 5 1.2 1 5.4-6z',
	last: 'm15.5 12-9 6V6zm2 5.5H16v-11h1.5z',
};

function NavigationIcon( { name, variant } ) {
	return (
		<svg
			className={ `ytpp-player__icon ytpp-player__icon--${ variant }` }
			viewBox="0 0 24 24"
			fill="currentColor"
			aria-hidden="true"
			focusable="false"
		>
			<path d={ NAVIGATION_ICON_PATHS[ name ] } />
		</svg>
	);
}

export default function Edit( { attributes, setAttributes } ) {
	const [ consentRemoved, setConsentRemoved ] = useState( false );
	const [ availability, setAvailability ] = useState( AVAILABILITY_IDLE );
	const [ availabilityCheckUrl, setAvailabilityCheckUrl ] = useState( '' );
	const [ previewReady, setPreviewReady ] = useState( false );
	const previewIframe = useRef();
	const availabilityIframe = useRef();
	const availabilityTimeout = useRef();
	const {
		playlistId,
		playlistTitle = '',
		showPlaylistTitle = false,
		requireConsent = true,
	} = attributes;
	const blockProps = useBlockProps( {
		className: 'ytpp-player-editor',
	} );
	const validation = parsePlaylistInput( playlistId );
	const configuredPreviewUrl = window.ytppEditorSettings?.previewUrl;
	const previewOrigin = configuredPreviewUrl
		? new URL( configuredPreviewUrl, window.location.href ).origin
		: window.location.origin;
	const previewUrl = configuredPreviewUrl
		? `${ configuredPreviewUrl }&playlist_id=${ encodeURIComponent(
				validation.id
		  ) }`
		: '';

	useEffect( () => {
		setAvailability( AVAILABILITY_IDLE );
		setAvailabilityCheckUrl( '' );
		setPreviewReady( false );
		window.clearTimeout( availabilityTimeout.current );
	}, [ validation.id ] );

	useEffect( () => {
		function receiveAvailability( event ) {
			if (
				event.source !== availabilityIframe.current?.contentWindow ||
				event.origin !== previewOrigin ||
				event.data?.type !== 'ytpp:availability-result' ||
				! [
					AVAILABILITY_AVAILABLE,
					AVAILABILITY_UNAVAILABLE,
					AVAILABILITY_UNKNOWN,
				].includes( event.data.status )
			) {
				return;
			}

			window.clearTimeout( availabilityTimeout.current );
			setAvailability( event.data.status );
			setAvailabilityCheckUrl( '' );
		}

		window.addEventListener( 'message', receiveAvailability );

		return () => {
			window.removeEventListener( 'message', receiveAvailability );
			window.clearTimeout( availabilityTimeout.current );
		};
	}, [ previewOrigin ] );

	function updatePlaylist( value ) {
		const result = parsePlaylistInput( value );
		setConsentRemoved( false );
		setAvailability( AVAILABILITY_IDLE );
		setAvailabilityCheckUrl( '' );
		setPreviewReady( false );

		setAttributes( {
			playlistId: result.status === VALIDATION_VALID ? result.id : value,
		} );
	}

	function checkAvailability() {
		if ( ! previewUrl ) {
			setAvailability( AVAILABILITY_UNKNOWN );
			return;
		}

		setAvailability( AVAILABILITY_CHECKING );
		setAvailabilityCheckUrl(
			`${ previewUrl }&availability_check=1&request_id=${ Date.now() }`
		);
		window.clearTimeout( availabilityTimeout.current );
		availabilityTimeout.current = window.setTimeout( () => {
			setAvailability( AVAILABILITY_UNKNOWN );
			setAvailabilityCheckUrl( '' );
		}, AVAILABILITY_TIMEOUT );
	}

	function clearStoredConsent() {
		forgetConsent( validation.id );
		setConsentRemoved( true );
	}

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Playlist settings', 'yt-playlist-player' ) }
					initialOpen={ true }
				>
					<TextControl
						label={ __(
							'Playlist ID or URL',
							'yt-playlist-player'
						) }
						help={ __(
							'Enter a playlist ID or a supported YouTube playlist URL.',
							'yt-playlist-player'
						) }
						value={ playlistId }
						onChange={ updatePlaylist }
					/>
					{ validation.status === VALIDATION_INVALID && (
						<p className="ytpp-player-editor__error" role="alert">
							{ __(
								'Enter a valid YouTube playlist ID or supported playlist URL.',
								'yt-playlist-player'
							) }
						</p>
					) }
					{ validation.status === VALIDATION_VALID && (
						<p
							className="ytpp-player-editor__selection"
							role="status"
						>
							{ sprintf(
								/* translators: %s: YouTube playlist ID. */
								__(
									'Playlist ID: %s. The syntax is valid.',
									'yt-playlist-player'
								),
								validation.id
							) }
						</p>
					) }
					<ToggleControl
						label={ __(
							'Show playlist title above the video',
							'yt-playlist-player'
						) }
						checked={ showPlaylistTitle }
						onChange={ ( value ) =>
							setAttributes( { showPlaylistTitle: value } )
						}
					/>
					{ showPlaylistTitle && (
						<TextControl
							label={ __(
								'Playlist title',
								'yt-playlist-player'
							) }
							help={ __(
								'This title is entered manually and does not create an additional YouTube request.',
								'yt-playlist-player'
							) }
							value={ playlistTitle }
							onChange={ ( value ) =>
								setAttributes( { playlistTitle: value } )
							}
						/>
					) }
					<ToggleControl
						label={ __(
							'Require consent before loading YouTube',
							'yt-playlist-player'
						) }
						help={
							requireConsent
								? __(
										'Visitors must actively load the playlist before any connection to YouTube is made.',
										'yt-playlist-player'
								  )
								: __(
										'YouTube loads immediately. Disable this only when another consent or content blocker reliably prevents external requests.',
										'yt-playlist-player'
								  )
						}
						checked={ requireConsent }
						onChange={ ( value ) =>
							setAttributes( { requireConsent: value } )
						}
					/>
					{ validation.status === VALIDATION_VALID && (
						<>
							<p className="ytpp-player-editor__privacy-note">
								{ __(
									'The editor preview connects directly to youtube-nocookie.com.',
									'yt-playlist-player'
								) }
							</p>
							<div className="ytpp-player-editor__availability-check">
								<Button
									variant="secondary"
									disabled={
										! previewReady ||
										availability === AVAILABILITY_CHECKING
									}
									onClick={ checkAvailability }
								>
									{ __(
										'Check playlist availability',
										'yt-playlist-player'
									) }
								</Button>
								<p className="ytpp-player-editor__availability-help">
									{ __(
										'The additional check loads the YouTube IFrame API only after you select the button. The editor preview itself already connects to YouTube.',
										'yt-playlist-player'
									) }
								</p>
								{ availability === AVAILABILITY_CHECKING && (
									<p role="status" aria-live="polite">
										{ __(
											'Checking playlist availability…',
											'yt-playlist-player'
										) }
									</p>
								) }
								{ availability === AVAILABILITY_AVAILABLE && (
									<p
										className="ytpp-player-editor__availability-success"
										role="status"
									>
										{ __(
											'The playlist is available and contains at least one playable item.',
											'yt-playlist-player'
										) }
									</p>
								) }
								{ availability === AVAILABILITY_UNAVAILABLE && (
									<p
										className="ytpp-player-editor__error"
										role="alert"
									>
										{ __(
											'The playlist is unavailable, empty, or cannot be embedded.',
											'yt-playlist-player'
										) }
									</p>
								) }
								{ availability === AVAILABILITY_UNKNOWN && (
									<p role="status" aria-live="polite">
										{ __(
											'Playlist availability could not be determined. Check the network or content blocker and try again.',
											'yt-playlist-player'
										) }
									</p>
								) }
								{ availabilityCheckUrl && (
									<iframe
										ref={ availabilityIframe }
										className="ytpp-player-editor__availability-frame"
										title={ __(
											'Playlist availability check',
											'yt-playlist-player'
										) }
										src={ availabilityCheckUrl }
									/>
								) }
							</div>
							<Button
								variant="secondary"
								onClick={ clearStoredConsent }
							>
								{ __(
									'Forget saved consent for this playlist',
									'yt-playlist-player'
								) }
							</Button>
							{ consentRemoved && (
								<p
									className="ytpp-player-editor__consent-status"
									role="status"
								>
									{ __(
										'Saved consent for this playlist was removed.',
										'yt-playlist-player'
									) }
								</p>
							) }
						</>
					) }
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				{ validation.status === VALIDATION_VALID && previewUrl ? (
					<Disabled>
						<div>
							{ showPlaylistTitle && playlistTitle.trim() && (
								<p className="ytpp-player__title">
									{ playlistTitle }
								</p>
							) }
							<div className="ytpp-player-editor__preview">
								<iframe
									ref={ previewIframe }
									title={ __(
										'YouTube playlist preview',
										'yt-playlist-player'
									) }
									src={ previewUrl }
									loading="lazy"
									onLoad={ () => setPreviewReady( true ) }
								/>
							</div>
							<div
								className="ytpp-player-editor__controls"
								aria-label={ __(
									'Playlist navigation preview',
									'yt-playlist-player'
								) }
							>
								<div className="ytpp-player-editor__control-group">
									<button
										type="button"
										disabled
										aria-label={ __(
											'First video',
											'yt-playlist-player'
										) }
										title={ __(
											'First video',
											'yt-playlist-player'
										) }
									>
										<NavigationIcon
											name="first"
											variant="skip"
										/>
									</button>
									<button
										type="button"
										disabled
										aria-label={ __(
											'Previous video',
											'yt-playlist-player'
										) }
										title={ __(
											'Previous video',
											'yt-playlist-player'
										) }
									>
										<NavigationIcon
											name="previous"
											variant="step"
										/>
									</button>
								</div>
								<span>
									{ __( '– / –', 'yt-playlist-player' ) }
								</span>
								<div className="ytpp-player-editor__control-group">
									<button
										type="button"
										disabled
										aria-label={ __(
											'Next video',
											'yt-playlist-player'
										) }
										title={ __(
											'Next video',
											'yt-playlist-player'
										) }
									>
										<NavigationIcon
											name="next"
											variant="step"
										/>
									</button>
									<button
										type="button"
										disabled
										aria-label={ __(
											'Last video',
											'yt-playlist-player'
										) }
										title={ __(
											'Last video',
											'yt-playlist-player'
										) }
									>
										<NavigationIcon
											name="last"
											variant="skip"
										/>
									</button>
								</div>
							</div>
						</div>
					</Disabled>
				) : (
					<Placeholder
						icon="video-alt3"
						label={ __(
							'YouTube Playlist Player',
							'yt-playlist-player'
						) }
						instructions={ __(
							'Select this block and enter the playlist in the block settings sidebar.',
							'yt-playlist-player'
						) }
					/>
				) }
			</div>
		</>
	);
}
