<?php
/**
 * Render the YouTube Playlist Player block.
 *
 * @var array $attributes Block attributes.
 *
 * @package YouTube_Playlist_Player
 */

defined( 'ABSPATH' ) || exit;

$ytpp_playlist_input  = isset( $attributes['playlistId'] )
	? (string) $attributes['playlistId']
	: '';
$ytpp_playlist_id     = YTPP_Playlist_Parser::parse( $ytpp_playlist_input );
$ytpp_require_consent = ! isset( $attributes['requireConsent'] ) || true === $attributes['requireConsent'];
$ytpp_playlist_title  = isset( $attributes['playlistTitle'] )
	? trim( (string) $attributes['playlistTitle'] )
	: '';
$ytpp_show_title      = isset( $attributes['showPlaylistTitle'] ) && true === $attributes['showPlaylistTitle'];
$ytpp_alignment       = isset( $attributes['align'] ) ? (string) $attributes['align'] : '';
$ytpp_alignment_class = in_array( $ytpp_alignment, array( 'wide', 'full', 'center', 'left', 'right' ), true )
	? ' align' . $ytpp_alignment
	: '';

/**
 * Filter the local consent gate. Only boolean false disables it.
 *
 * @param bool        $require_consent Whether the gate is required.
 * @param string|null $playlist_id     Canonical playlist ID, or null for invalid input.
 * @param array       $attributes      Saved block attributes.
 */
$ytpp_require_consent = false !== apply_filters( 'ytpp_require_consent', $ytpp_require_consent, $ytpp_playlist_id, $attributes );

$ytpp_wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class'                => 'ytpp-player' . $ytpp_alignment_class,
		'style'                => YTPP_Player_Sizing::style( $attributes ),
		'data-playlist-id'     => $ytpp_playlist_id ?? '',
		'data-require-consent' => $ytpp_require_consent ? 'true' : 'false',
	)
);
?>
<div <?php echo $ytpp_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Escaped by get_block_wrapper_attributes(). ?>>
	<?php if ( '' === trim( $ytpp_playlist_input ) ) : ?>
		<p class="ytpp-player__empty">
			<?php esc_html_e( 'No playlist ID has been entered yet.', 'yt-playlist-player' ); ?>
		</p>
	<?php elseif ( null === $ytpp_playlist_id ) : ?>
		<p class="ytpp-player__error" role="alert">
			<?php esc_html_e( 'Enter a valid YouTube playlist ID or supported playlist URL.', 'yt-playlist-player' ); ?>
		</p>
	<?php else : ?>
		<?php if ( $ytpp_show_title && '' !== $ytpp_playlist_title ) : ?>
			<p class="ytpp-player__title"><?php echo esc_html( $ytpp_playlist_title ); ?></p>
		<?php endif; ?>
		<div class="ytpp-player__video" role="region" aria-label="<?php esc_attr_e( 'YouTube playlist player', 'yt-playlist-player' ); ?>" aria-busy="false">
			<p class="ytpp-player__screen-reader-text">
				<?php esc_html_e( 'YouTube playlist player', 'yt-playlist-player' ); ?>
			</p>
			<div class="ytpp-player__target" tabindex="-1" role="group" aria-label="<?php esc_attr_e( 'YouTube playlist player', 'yt-playlist-player' ); ?>">
				<?php if ( $ytpp_require_consent ) : ?>
					<div class="ytpp-player__consent">
						<p>
							<?php esc_html_e( 'Loading this playlist connects to YouTube and may transfer data to Google.', 'yt-playlist-player' ); ?>
							<?php esc_html_e( 'Your choice is saved for this playlist in this browser.', 'yt-playlist-player' ); ?>
						</p>
						<button type="button" class="ytpp-player__consent-button">
							<?php esc_html_e( 'Load YouTube playlist', 'yt-playlist-player' ); ?>
						</button>
					</div>
				<?php else : ?>
					<p class="ytpp-player__placeholder" aria-hidden="true">
						<?php esc_html_e( 'The video playlist is loading.', 'yt-playlist-player' ); ?>
					</p>
				<?php endif; ?>
			</div>
		</div>
		<p class="ytpp-player__status" role="status" aria-live="polite" aria-atomic="true"></p>
		<p class="ytpp-player__error" role="alert" aria-atomic="true"></p>
		<button type="button" class="ytpp-player__retry" hidden><?php esc_html_e( 'Retry loading playlist', 'yt-playlist-player' ); ?></button>
		<nav class="ytpp-player__controls" aria-label="<?php esc_attr_e( 'Playlist navigation', 'yt-playlist-player' ); ?>">
			<div class="ytpp-player__control-group">
				<button type="button" class="ytpp-player__first" title="<?php esc_attr_e( 'First video', 'yt-playlist-player' ); ?>" disabled>
					<svg class="ytpp-player__icon ytpp-player__icon--skip" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="m17.5 18-9-6 9-6zM8 6.5v11H6.5v-11z" /></svg>
					<span class="ytpp-player__screen-reader-text"><?php esc_html_e( 'First video', 'yt-playlist-player' ); ?></span>
				</button>
				<button type="button" class="ytpp-player__previous" title="<?php esc_attr_e( 'Previous video', 'yt-playlist-player' ); ?>" disabled>
					<svg class="ytpp-player__icon ytpp-player__icon--step" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M14.6 7l-1.2-1L8 12l5.4 6 1.2-1-4.6-5z" /></svg>
					<span class="ytpp-player__screen-reader-text"><?php esc_html_e( 'Previous video', 'yt-playlist-player' ); ?></span>
				</button>
			</div>
			<output class="ytpp-player__position" role="status" aria-live="polite" aria-atomic="true"><span class="ytpp-player__position-visual" aria-hidden="true"></span><span class="ytpp-player__screen-reader-text"></span></output>
			<div class="ytpp-player__control-group">
				<button type="button" class="ytpp-player__next" title="<?php esc_attr_e( 'Next video', 'yt-playlist-player' ); ?>" disabled>
					<svg class="ytpp-player__icon ytpp-player__icon--step" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M10.6 6L9.4 7l4.6 5-4.6 5 1.2 1 5.4-6z" /></svg>
					<span class="ytpp-player__screen-reader-text"><?php esc_html_e( 'Next video', 'yt-playlist-player' ); ?></span>
				</button>
				<button type="button" class="ytpp-player__last" title="<?php esc_attr_e( 'Last video', 'yt-playlist-player' ); ?>" disabled>
					<svg class="ytpp-player__icon ytpp-player__icon--skip" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="m15.5 12-9 6V6zm2 5.5H16v-11h1.5z" /></svg>
					<span class="ytpp-player__screen-reader-text"><?php esc_html_e( 'Last video', 'yt-playlist-player' ); ?></span>
				</button>
			</div>
		</nav>
	<?php endif; ?>
</div>
