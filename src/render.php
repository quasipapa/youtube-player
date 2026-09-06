<?php
/**
 * Render the YouTube Playlist Player block.
 *
 * @var array $attributes Block attributes.
 *
 * @package YouTube_Playlist_Player
 */

$ytpp_playlist_id = isset( $attributes['playlistId'] )
	? sanitize_text_field( (string) $attributes['playlistId'] )
	: '';

$ytpp_wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class'            => 'ytpp-player',
		'data-playlist-id' => $ytpp_playlist_id,
	)
);
?>
<div <?php echo $ytpp_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Escaped by get_block_wrapper_attributes(). ?>>
	<?php if ( '' === $ytpp_playlist_id ) : ?>
		<p class="ytpp-player__empty">
			<?php esc_html_e( 'No playlist ID has been entered yet.', 'yt-playlist-player' ); ?>
		</p>
	<?php else : ?>
		<div class="ytpp-player__video">
			<div class="ytpp-player__target">
				<p class="ytpp-player__placeholder">
					<?php esc_html_e( 'The video playlist is loading.', 'yt-playlist-player' ); ?>
				</p>
			</div>
		</div>
		<nav class="ytpp-player__controls" aria-label="<?php esc_attr_e( 'Playlist navigation', 'yt-playlist-player' ); ?>">
			<button type="button" class="ytpp-player__previous">
				<?php esc_html_e( 'Previous video', 'yt-playlist-player' ); ?>
			</button>
			<span class="ytpp-player__position" aria-live="polite"></span>
			<button type="button" class="ytpp-player__next">
				<?php esc_html_e( 'Next video', 'yt-playlist-player' ); ?>
			</button>
		</nav>
	<?php endif; ?>
</div>
