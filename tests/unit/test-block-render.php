<?php
/**
 * Tests for the dynamic block renderer.
 *
 * @package YouTube_Playlist_Player
 */

use PHPUnit\Framework\TestCase;

/**
 * Verify the minimal frontend markup.
 */
final class Test_Block_Render extends TestCase {
	/**
	 * An empty block renders an explanatory placeholder without player controls.
	 *
	 * @return void
	 */
	public function test_empty_playlist_renders_placeholder(): void {
		$output = $this->render_block( array() );

		$this->assertStringContainsString( 'No playlist ID has been entered yet.', $output );
		$this->assertStringNotContainsString( 'ytpp-player__controls', $output );
	}

	/**
	 * A playlist ID is preserved in escaped semantic player markup.
	 *
	 * @return void
	 */
	public function test_playlist_id_renders_player_markup(): void {
		$output = $this->render_block( array( 'playlistId' => 'PL-test-playlist' ) );

		$this->assertStringContainsString( 'class="ytpp-player"', $output );
		$this->assertStringContainsString(
			'data-playlist-id="PL-test-playlist"',
			$output
		);
		$this->assertStringContainsString( 'ytpp-player__target', $output );
		$this->assertStringContainsString( '<nav', $output );
	}

	/**
	 * A supported URL renders only its canonical playlist ID.
	 *
	 * @return void
	 */
	public function test_playlist_url_is_normalized_for_rendering(): void {
		$playlist_id = 'OLAK5uy_mIGiJKnSXHRCdD6WbGjuZWNTpeXhIo2TU';
		$output      = $this->render_block(
			array(
				'playlistId' => "https://youtube.com/playlist?list={$playlist_id}&si=tracking",
			)
		);

		$this->assertStringContainsString(
			"data-playlist-id=\"{$playlist_id}\"",
			$output
		);
		$this->assertStringNotContainsString( 'si=tracking', $output );
	}

	/**
	 * Invalid input produces a safe local error without player markup.
	 *
	 * @return void
	 */
	public function test_invalid_input_renders_local_error(): void {
		$output = $this->render_block(
			array( 'playlistId' => 'PL-test" onmouseover="bad' )
		);

		$this->assertStringContainsString( 'role="alert"', $output );
		$this->assertStringContainsString( 'Enter a valid YouTube playlist ID', $output );
		$this->assertStringNotContainsString( 'onmouseover="bad', $output );
		$this->assertStringNotContainsString( 'ytpp-player__controls', $output );
	}

	/**
	 * Render the source template with block attributes.
	 *
	 * @param array $block_attributes Block attributes.
	 * @return string
	 */
	private function render_block( array $block_attributes ): string {
		$attributes = $block_attributes;

		ob_start();
		require dirname( __DIR__, 2 ) . '/src/render.php';

		return (string) ob_get_clean();
	}
}
