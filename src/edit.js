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
import { useState } from '@wordpress/element';

import './editor.scss';
import { forgetConsent } from './consent-storage';
import {
	parsePlaylistInput,
	VALIDATION_INVALID,
	VALIDATION_VALID,
} from './playlist-parser';

export default function Edit( { attributes, setAttributes } ) {
	const [ consentRemoved, setConsentRemoved ] = useState( false );
	const { playlistId, requireConsent = true } = attributes;
	const blockProps = useBlockProps( {
		className: 'ytpp-player-editor',
	} );
	const validation = parsePlaylistInput( playlistId );
	const configuredPreviewUrl = window.ytppEditorSettings?.previewUrl;
	const previewUrl = configuredPreviewUrl
		? `${ configuredPreviewUrl }&playlist_id=${ encodeURIComponent(
				validation.id
		  ) }`
		: '';

	function updatePlaylist( value ) {
		const result = parsePlaylistInput( value );
		setConsentRemoved( false );

		setAttributes( {
			playlistId: result.status === VALIDATION_VALID ? result.id : value,
		} );
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
									'Playlist ID: %s. The syntax is valid; availability on YouTube has not been checked.',
									'yt-playlist-player'
								),
								validation.id
							) }
						</p>
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
							<div className="ytpp-player-editor__preview">
								<iframe
									title={ __(
										'YouTube playlist preview',
										'yt-playlist-player'
									) }
									src={ previewUrl }
									loading="lazy"
								/>
							</div>
							<div
								className="ytpp-player-editor__controls"
								aria-label={ __(
									'Playlist navigation preview',
									'yt-playlist-player'
								) }
							>
								<button type="button" disabled>
									{ __(
										'Previous video',
										'yt-playlist-player'
									) }
								</button>
								<span>
									{ __(
										'Playlist preview',
										'yt-playlist-player'
									) }
								</span>
								<button type="button" disabled>
									{ __( 'Next video', 'yt-playlist-player' ) }
								</button>
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
