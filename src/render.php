<?php
/**
 * Render the YouTube Playlist Player block.
 *
 * @var array $attributes Block attributes.
 *
 * @package YouTube_Playlist_Player
 */

$ytpp_playlist_input  = isset( $attributes['playlistId'] )
	? (string) $attributes['playlistId']
	: '';
$ytpp_playlist_id     = YTPP_Playlist_Parser::parse( $ytpp_playlist_input );
$ytpp_require_consent = ! isset( $attributes['requireConsent'] ) || true === $attributes['requireConsent'];

$ytpp_wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class'                => 'ytpp-player',
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
		<div class="ytpp-player__video">
			<div class="ytpp-player__target">
				<?php if ( $ytpp_require_consent ) : ?>
					<div class="ytpp-player__consent">
						<p>
							<?php esc_html_e( 'Loading this playlist connects to YouTube and may transfer data to Google.', 'yt-playlist-player' ); ?>
						</p>
						<button type="button" class="ytpp-player__consent-button">
							<?php esc_html_e( 'Load YouTube playlist', 'yt-playlist-player' ); ?>
						</button>
					</div>
				<?php else : ?>
					<p class="ytpp-player__placeholder">
						<?php esc_html_e( 'The video playlist is loading.', 'yt-playlist-player' ); ?>
					</p>
				<?php endif; ?>
			</div>
		</div>
		<p class="ytpp-player__status" aria-live="polite"></p>
		<nav class="ytpp-player__controls" aria-label="<?php esc_attr_e( 'Playlist navigation', 'yt-playlist-player' ); ?>">
			<button type="button" class="ytpp-player__previous" disabled>
				<?php esc_html_e( 'Previous video', 'yt-playlist-player' ); ?>
			</button>
			<span class="ytpp-player__position" aria-live="polite"></span>
			<button type="button" class="ytpp-player__next" disabled>
				<?php esc_html_e( 'Next video', 'yt-playlist-player' ); ?>
			</button>
		</nav>
	<?php endif; ?>
</div>
