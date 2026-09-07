import fs from 'fs';
import path from 'path';

const projectRoot = path.resolve( __dirname, '..' );
const languagesDirectory = path.join( projectRoot, 'languages' );

function loadJavaScriptCatalog( source ) {
	const catalogFile = fs
		.readdirSync( languagesDirectory )
		.filter( ( file ) => file.endsWith( '.json' ) )
		.map( ( file ) => path.join( languagesDirectory, file ) )
		.find( ( file ) => {
			const catalog = JSON.parse( fs.readFileSync( file, 'utf8' ) );
			return catalog.source === source;
		} );

	if ( ! catalogFile ) {
		throw new Error(
			`No German JavaScript catalog found for ${ source }.`
		);
	}

	return JSON.parse( fs.readFileSync( catalogFile, 'utf8' ) );
}

describe( 'internationalization', () => {
	it( 'declares the plugin text domain in the block metadata', () => {
		const metadata = JSON.parse(
			fs.readFileSync( path.join( __dirname, 'block.json' ), 'utf8' )
		);

		expect( metadata.textdomain ).toBe( 'yt-playlist-player' );
	} );

	it( 'ships German catalogs for the editor and frontend scripts', () => {
		const editorCatalog = loadJavaScriptCatalog( 'build/index.js' );
		const viewCatalog = loadJavaScriptCatalog( 'build/view.js' );

		expect( editorCatalog.locale_data.messages[ '' ].lang ).toBe( 'de_DE' );
		expect(
			editorCatalog.locale_data.messages[ 'Playlist settings' ]
		).toEqual( [ 'Playlist-Einstellungen' ] );
		expect(
			viewCatalog.locale_data.messages[
				'The YouTube playlist could not be loaded. Please try again.'
			]
		).toEqual( [
			'Die YouTube-Playlist konnte nicht geladen werden. Bitte versuchen Sie es erneut.',
		] );
	} );

	it( 'does not contain direct visible English literals in JavaScript', () => {
		const sources = [ 'edit.js', 'view.js' ].map( ( file ) => ( {
			file,
			content: fs.readFileSync( path.join( __dirname, file ), 'utf8' ),
		} ) );
		const forbiddenPatterns = [
			/\b(?:label|help|title|aria-label|instructions)\s*=\s*["'][^"']*[A-Za-z][^"']*["']/,
			/\.(?:textContent|innerText)\s*=\s*["'][^"']*[A-Za-z][^"']*["']/,
			/setAttribute\(\s*["'](?:aria-label|title|placeholder)["']\s*,\s*["'][^"']*[A-Za-z][^"']*["']/,
		];

		for ( const source of sources ) {
			for ( const pattern of forbiddenPatterns ) {
				expect( {
					file: source.file,
					match: source.content.match( pattern )?.[ 0 ],
				} ).toEqual( { file: source.file, match: undefined } );
			}
		}
	} );
} );
