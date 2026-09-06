import { useBlockProps } from '@wordpress/block-editor';
import { Placeholder, TextControl } from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';

import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { playlistId } = attributes;
	const blockProps = useBlockProps( {
		className: 'ytpp-player-editor',
	} );

	return (
		<div { ...blockProps }>
			<Placeholder
				icon="video-alt3"
				label={ __( 'YouTube Playlist Player', 'yt-playlist-player' ) }
				instructions={ __(
					'Enter a YouTube playlist ID. Playlist links will be supported in the next development step.',
					'yt-playlist-player'
				) }
			>
				<TextControl
					label={ __( 'Playlist ID', 'yt-playlist-player' ) }
					value={ playlistId }
					onChange={ ( value ) =>
						setAttributes( { playlistId: value } )
					}
				/>
			</Placeholder>
			{ playlistId && (
				<p className="ytpp-player-editor__selection">
					{ sprintf(
						/* translators: %s: YouTube playlist ID. */
						__( 'Current playlist ID: %s', 'yt-playlist-player' ),
						playlistId
					) }
				</p>
			) }
		</div>
	);
}
