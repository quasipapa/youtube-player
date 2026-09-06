<?php
/**
 * Tests for playlist input parsing.
 *
 * @package YouTube_Playlist_Player
 */

use PHPUnit\Framework\TestCase;

/**
 * Verify supported and rejected playlist input.
 */
final class Test_Playlist_Parser extends TestCase {
	private const PLAYLIST_ID = 'OLAK5uy_mIGiJKnSXHRCdD6WbGjuZWNTpeXhIo2TU';

	/**
	 * Supported input is normalized to one canonical ID.
	 *
	 * @dataProvider valid_input_provider
	 *
	 * @param string $input User input.
	 * @return void
	 */
	public function test_valid_input_is_normalized( string $input ): void {
		$this->assertSame( self::PLAYLIST_ID, YTPP_Playlist_Parser::parse( $input ) );
	}

	/**
	 * Provide supported ID and URL forms.
	 *
	 * @return array<string,array{string}>
	 */
	public function valid_input_provider(): array {
		$id = self::PLAYLIST_ID;

		return array(
			'plain ID'              => array( $id ),
			'ID with whitespace'    => array( " \n{$id}\t" ),
			'playlist URL'          => array( "https://www.youtube.com/playlist?list={$id}&si=tracking" ),
			'watch URL'             => array( "https://youtube.com/watch?v=TsCvNtCgKZ8&list={$id}" ),
			'short URL'             => array( "https://youtu.be/TsCvNtCgKZ8?list={$id}&si=tracking" ),
			'no-cookie embed URL'   => array( "https://www.youtube-nocookie.com/embed/videoseries?list={$id}" ),
			'mobile URL'            => array( "https://m.youtube.com/playlist?list={$id}" ),
			'music URL'             => array( "https://music.youtube.com/playlist?list={$id}" ),
			'explicit default port' => array( "https://youtube.com:443/playlist?list={$id}" ),
		);
	}

	/**
	 * Unsupported or ambiguous input is rejected.
	 *
	 * @dataProvider invalid_input_provider
	 *
	 * @param string $input User input.
	 * @return void
	 */
	public function test_invalid_input_is_rejected( string $input ): void {
		$this->assertNull( YTPP_Playlist_Parser::parse( $input ) );
	}

	/**
	 * Provide malformed and disallowed inputs.
	 *
	 * @return array<string,array{string}>
	 */
	public function invalid_input_provider(): array {
		$id = self::PLAYLIST_ID;

		return array(
			'empty'                => array( '' ),
			'too short'            => array( 'invalid' ),
			'invalid character'    => array( 'PL-invalid!' ),
			'missing scheme'       => array( "youtube.com/playlist?list={$id}" ),
			'foreign host'         => array( "https://example.com/playlist?list={$id}" ),
			'host suffix attack'   => array( "https://youtube.com.example.org/playlist?list={$id}" ),
			'unapproved subdomain' => array( "https://evil.youtube.com/playlist?list={$id}" ),
			'unsupported scheme'   => array( "ftp://youtube.com/playlist?list={$id}" ),
			'credentials'          => array( "https://user@youtube.com/playlist?list={$id}" ),
			'non-default port'     => array( "https://youtube.com:444/playlist?list={$id}" ),
			'missing list'         => array( 'https://youtube.com/watch?v=TsCvNtCgKZ8' ),
			'duplicate list'       => array( "https://youtube.com/playlist?list={$id}&list={$id}" ),
			'array parameter'      => array( "https://youtube.com/playlist?list%5B%5D={$id}" ),
		);
	}
}
