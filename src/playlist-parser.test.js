import {
	parsePlaylistInput,
	VALIDATION_EMPTY,
	VALIDATION_INVALID,
	VALIDATION_VALID,
} from './playlist-parser';

const PLAYLIST_ID = 'OLAK5uy_mIGiJKnSXHRCdD6WbGjuZWNTpeXhIo2TU';

describe( 'parsePlaylistInput', () => {
	it.each( [
		[ 'plain ID', PLAYLIST_ID ],
		[
			'playlist URL',
			`https://www.youtube.com/playlist?list=${ PLAYLIST_ID }&si=tracking`,
		],
		[
			'watch URL',
			`https://youtube.com/watch?v=TsCvNtCgKZ8&list=${ PLAYLIST_ID }`,
		],
		[ 'short URL', `https://youtu.be/TsCvNtCgKZ8?list=${ PLAYLIST_ID }` ],
		[
			'no-cookie URL',
			`https://www.youtube-nocookie.com/embed/videoseries?list=${ PLAYLIST_ID }`,
		],
		[
			'mobile URL',
			`https://m.youtube.com/playlist?list=${ PLAYLIST_ID }`,
		],
		[
			'music URL',
			`https://music.youtube.com/playlist?list=${ PLAYLIST_ID }`,
		],
	] )( 'normalizes %s', ( label, input ) => {
		expect( parsePlaylistInput( input ) ).toEqual( {
			id: PLAYLIST_ID,
			status: VALIDATION_VALID,
		} );
	} );

	it.each( [
		[ 'invalid' ],
		[ 'PL-invalid!' ],
		[ `youtube.com/playlist?list=${ PLAYLIST_ID }` ],
		[ `https://example.com/playlist?list=${ PLAYLIST_ID }` ],
		[ `https://youtube.com.example.org/playlist?list=${ PLAYLIST_ID }` ],
		[ `https://evil.youtube.com/playlist?list=${ PLAYLIST_ID }` ],
		[ `ftp://youtube.com/playlist?list=${ PLAYLIST_ID }` ],
		[ `https://user@youtube.com/playlist?list=${ PLAYLIST_ID }` ],
		[ `https://youtube.com:444/playlist?list=${ PLAYLIST_ID }` ],
		[ 'https://youtube.com/watch?v=TsCvNtCgKZ8' ],
		[
			`https://youtube.com/playlist?list=${ PLAYLIST_ID }&list=${ PLAYLIST_ID }`,
		],
	] )( 'rejects %s', ( input ) => {
		expect( parsePlaylistInput( input ).status ).toBe( VALIDATION_INVALID );
	} );

	it( 'reports empty input separately', () => {
		expect( parsePlaylistInput( '  ' ) ).toEqual( {
			id: '',
			status: VALIDATION_EMPTY,
		} );
	} );
} );
