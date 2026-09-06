<?php
/**
 * Tests for the same-origin editor preview document.
 *
 * @package YouTube_Playlist_Player
 */

use PHPUnit\Framework\TestCase;

/**
 * Verify the isolated preview document and its privacy-enhanced player URL.
 */
final class Test_Editor_Preview extends TestCase {
	/**
	 * A valid playlist produces one correctly identified no-cookie iframe.
	 *
	 * @return void
	 */
	public function test_renders_privacy_enhanced_iframe_with_referrer_policy(): void {
		$playlist_id = 'OLAK5uy_mIGiJKnSXHRCdD6WbGjuZWNTpeXhIo2TU';
		$document    = YTPP_Editor_Preview::render( $playlist_id, 'https://example.test' );

		$this->assertStringContainsString( '<meta name="referrer" content="origin-when-cross-origin">', $document );
		$this->assertStringContainsString( 'https://www.youtube-nocookie.com/embed?', $document );
		$this->assertStringContainsString( 'list=' . $playlist_id, $document );
		$this->assertStringContainsString( 'origin=https%3A%2F%2Fexample.test', $document );
		$this->assertStringContainsString( 'widget_referrer=https%3A%2F%2Fexample.test', $document );
		$this->assertStringContainsString( 'referrerpolicy="origin-when-cross-origin"', $document );
		$this->assertStringNotContainsString( 'https://www.youtube.com/embed', $document );
	}
}
