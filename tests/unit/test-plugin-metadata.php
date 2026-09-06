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

	/**
	 * The plugin registers the generated metadata directory.
	 *
	 * @return void
	 */
	public function test_plugin_registers_block_from_build_directory(): void {
		$GLOBALS['ytpp_test_registered_blocks'] = array();
		$GLOBALS['ytpp_test_inline_scripts']    = array();

		ytpp_register_block();

		$this->assertCount( 1, $GLOBALS['ytpp_test_registered_blocks'] );
		$this->assertSame(
			YTPP_PLUGIN_DIR . 'build',
			$GLOBALS['ytpp_test_registered_blocks'][0]->path
		);
		$this->assertSame(
			'yt-playlist-player-player-editor-script',
			$GLOBALS['ytpp_test_inline_scripts'][0]['handle']
		);
		$this->assertSame( 'before', $GLOBALS['ytpp_test_inline_scripts'][0]['position'] );
		$this->assertStringContainsString(
			'action=ytpp_editor_preview',
			$GLOBALS['ytpp_test_inline_scripts'][0]['data']
		);
	}
}
