<?php
/**
 * Tests for the main plugin file metadata.
 *
 * @package YouTube_Playlist_Player
 */

use PHPUnit\Framework\TestCase;

/**
 * Verify the minimum platform and package metadata without booting WordPress.
 */
final class Test_Plugin_Metadata extends TestCase {
	/**
	 * The plugin exposes its current version and filesystem locations.
	 *
	 * @return void
	 */
	public function test_plugin_defines_runtime_constants(): void {
		$this->assertSame( '0.1.0', YTPP_VERSION );
		$this->assertSame(
			'https://example.test/wp-content/plugins/yt-playlist-player/',
			YTPP_PLUGIN_URL
		);
		$this->assertDirectoryExists( YTPP_PLUGIN_DIR );
	}
}
