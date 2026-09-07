<?php
/**
 * Tests for the shipped translation catalogs.
 *
 * @package YouTube_Playlist_Player
 */

use PHPUnit\Framework\TestCase;

/**
 * Verify that the generated German translation artifacts are complete.
 */
final class Test_I18n extends TestCase {
	/**
	 * The PO catalog translates every source entry in the POT template.
	 *
	 * @return void
	 */
	public function test_german_po_catalog_is_complete(): void {
		// phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents -- Read-only local test fixture.
		$pot = file_get_contents( YTPP_PLUGIN_DIR . 'languages/yt-playlist-player.pot' );
		// phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents -- Read-only local test fixture.
		$po = file_get_contents( YTPP_PLUGIN_DIR . 'languages/yt-playlist-player-de_DE.po' );

		$this->assertIsString( $pot );
		$this->assertIsString( $po );
		$this->assertSame( preg_match_all( '/^msgid /m', $pot ), preg_match_all( '/^msgid /m', $po ) );
		$this->assertSame( 1, preg_match_all( '/^msgstr ""$/m', $po ) );
	}

	/**
	 * Compiled PHP and JavaScript translation files are part of the plugin.
	 *
	 * @return void
	 */
	public function test_compiled_german_catalogs_exist(): void {
		$mo_file    = YTPP_PLUGIN_DIR . 'languages/yt-playlist-player-de_DE.mo';
		$json_files = glob( YTPP_PLUGIN_DIR . 'languages/yt-playlist-player-de_DE-*.json' );

		$this->assertFileExists( $mo_file );
		$this->assertGreaterThan( 0, filesize( $mo_file ) );
		$this->assertIsArray( $json_files );
		$this->assertCount( 2, $json_files );
	}
}
