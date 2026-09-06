import { useBlockProps } from '@wordpress/block-editor';
import { Placeholder, TextControl } from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';

import './editor.scss';
import {
	parsePlaylistInput,
	VALIDATION_INVALID,
	VALIDATION_VALID,
} from './playlist-parser';

export default function Edit( { attributes, setAttributes } ) {
	const { playlistId } = attributes;
	const blockProps = useBlockProps( {
		className: 'ytpp-player-editor',
	} );
	const validation = parsePlaylistInput( playlistId );

	function updatePlaylist( value ) {
		const result = parsePlaylistInput( value );

		setAttributes( {
			playlistId: result.status === VALIDATION_VALID ? result.id : value,
		} );
	}

	return (
		<div { ...blockProps }>
			<Placeholder
				icon="video-alt3"
				label={ __( 'YouTube Playlist Player', 'yt-playlist-player' ) }
				instructions={ __(
					'Enter a playlist ID or a supported YouTube playlist URL.',
					'yt-playlist-player'
				) }
			>
				<TextControl
					label={ __( 'Playlist ID or URL', 'yt-playlist-player' ) }
					value={ playlistId }
					onChange={ updatePlaylist }
				/>
			</Placeholder>
			{ validation.status === VALIDATION_INVALID && (
				<p className="ytpp-player-editor__error" role="alert">
					{ __(
						'Enter a valid YouTube playlist ID or supported playlist URL.',
						'yt-playlist-player'
					) }
				</p>
			) }
			{ validation.status === VALIDATION_VALID && (
				<p className="ytpp-player-editor__selection" role="status">
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
		</div>
	);
}
