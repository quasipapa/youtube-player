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
	 * Saved sizing is validated before reaching the style attribute.
	 *
	 * @return void
	 */
	public function test_sizing_validation_and_rendering(): void {
		$output = $this->render_block(
			array(
				'playlistId'  => 'PL-test-playlist',
				'maxWidth'    => '640',
				'maxHeight'   => '480',
				'aspectRatio' => '4:3',
			)
		);
		$this->assertStringContainsString( '--ytpp-max-width:640px', $output );
		$this->assertStringContainsString( '--ytpp-max-height:480px', $output );
		$this->assertStringContainsString( '--ytpp-aspect-ratio:1.333', $output );
		foreach ( array( '199', '355', '10001', '600px', '600;color:red', array(), 600 ) as $width ) {
			$this->assertSame( '', YTPP_Player_Sizing::style( array( 'maxWidth' => $width ) ) );
		}
		foreach ( array( '0:1', '1:0', '1:100', '100:1', '1:1;color:red', array() ) as $ratio ) {
			$this->assertSame(
				'',
				YTPP_Player_Sizing::style(
					array(
						'aspectRatio'       => 'custom',
						'customAspectRatio' => $ratio,
					)
				)
			);
		}
		$this->assertSame(
			'--ytpp-max-width:356px;--ytpp-max-height:200px',
			YTPP_Player_Sizing::style(
				array(
					'maxWidth'  => '356',
					'maxHeight' => '200',
				)
			)
		);
		$this->assertSame(
			'--ytpp-aspect-ratio:0.5625',
			YTPP_Player_Sizing::style(
				array(
					'aspectRatio'       => 'custom',
					'customAspectRatio' => '9:16',
					'maxHeight'         => '355',
				)
			)
		);
	}

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
	 * A playlist ID renders a local consent gate without external resources.
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
		$this->assertStringContainsString( 'data-require-consent="true"', $output );
		$this->assertStringContainsString( 'ytpp-player__consent-button', $output );
		$this->assertStringContainsString( 'Load YouTube playlist', $output );
		$this->assertStringContainsString( 'saved for this playlist', $output );
		$this->assertStringContainsString( '<nav', $output );
		$this->assertStringContainsString( 'ytpp-player__first', $output );
		$this->assertStringContainsString( 'First video', $output );
		$this->assertStringContainsString( 'ytpp-player__previous', $output );
		$this->assertStringContainsString( 'Previous video', $output );
		$this->assertStringContainsString( 'ytpp-player__position', $output );
		$this->assertStringContainsString( 'role="status"', $output );
		$this->assertStringContainsString( 'role="region"', $output );
		$this->assertStringContainsString( 'aria-label="YouTube playlist player"', $output );
		$this->assertStringContainsString( 'ytpp-player__next', $output );
		$this->assertStringContainsString( 'Next video', $output );
		$this->assertStringContainsString( 'ytpp-player__last', $output );
		$this->assertStringContainsString( 'Last video', $output );
		$this->assertSame( 4, substr_count( $output, 'ytpp-player__icon ' ) );
		$this->assertSame( 2, substr_count( $output, 'ytpp-player__icon--skip' ) );
		$this->assertSame( 2, substr_count( $output, 'ytpp-player__icon--step' ) );
		$this->assertSame( 4, substr_count( $output, 'aria-hidden="true"' ) );
		$this->assertStringNotContainsString( '<iframe', $output );
		$this->assertStringNotContainsString( 'https://www.youtube', $output );
	}

	/**
	 * The local consent gate can be disabled for an external content blocker.
	 *
	 * @return void
	 */
	public function test_consent_gate_can_be_disabled(): void {
		$output = $this->render_block(
			array(
				'playlistId'     => 'PL-test-playlist',
				'requireConsent' => false,
			)
		);

		$this->assertStringContainsString( 'data-require-consent="false"', $output );
		$this->assertStringContainsString( 'The video playlist is loading.', $output );
		$this->assertStringNotContainsString( 'ytpp-player__consent-button', $output );
	}

	/**
	 * A site integration can override the gate, with only explicit false opting out.
	 *
	 * @return void
	 */
	public function test_consent_filter_fails_closed_and_receives_canonical_id(): void {
		try {
			foreach ( array( false, true, null, 0, 'false' ) as $result ) {
				$GLOBALS['ytpp_test_filters']['ytpp_require_consent'] = function ( $required, $playlist_id, $attributes ) use ( $result ) {
					$this->assertTrue( $required );
					$this->assertSame( 'PL-test-playlist', $playlist_id );
					$this->assertArrayHasKey( 'playlistId', $attributes );
					return $result;
				};
				$output = $this->render_block( array( 'playlistId' => 'https://youtube.com/playlist?list=PL-test-playlist' ) );
				$this->assertStringContainsString( 'data-require-consent="' . ( false === $result ? 'false' : 'true' ) . '"', $output );
			}
		} finally {
			unset( $GLOBALS['ytpp_test_filters']['ytpp_require_consent'] );
		}
	}

	/**
	 * The optional editorial title is escaped and rendered only when enabled.
	 *
	 * @return void
	 */
	public function test_optional_playlist_title(): void {
		$hidden_output  = $this->render_block(
			array(
				'playlistId'        => 'PL-test-playlist',
				'playlistTitle'     => 'Hidden title',
				'showPlaylistTitle' => false,
			)
		);
		$visible_output = $this->render_block(
			array(
				'playlistId'        => 'PL-test-playlist',
				'playlistTitle'     => '<strong>Visible title</strong>',
				'showPlaylistTitle' => true,
			)
		);

		$this->assertStringNotContainsString( 'Hidden title', $hidden_output );
		$this->assertStringContainsString( 'ytpp-player__title', $visible_output );
		$this->assertStringContainsString(
			'&lt;strong&gt;Visible title&lt;/strong&gt;',
			$visible_output
		);
		$this->assertStringNotContainsString( '<strong>', $visible_output );
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
