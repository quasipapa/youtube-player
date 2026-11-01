import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export function checkVersions( root, tag ) {
	const read = ( path ) => readFileSync( resolve( root, path ), 'utf8' );
	const pkg = JSON.parse( read( 'package.json' ) );
	const block = JSON.parse( read( 'src/block.json' ) );
	const composer = JSON.parse( read( 'composer.json' ) );
	const plugin = read( 'yt-playlist-player.php' );
	const readme = read( 'readme.txt' );
	const versions = [
		pkg.version,
		block.version,
		plugin.match( /\n \* Version:\s+([^\n]+)/ )?.[ 1 ],
		plugin.match( /YTPP_VERSION',\s*\n\s*'([^']+)'/ )?.[ 1 ],
		readme.match( /Stable tag:\s*(\S+)/ )?.[ 1 ],
	];
	if ( tag !== undefined )
		versions.push(
			tag.match( /^v(\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?)$/ )?.[ 1 ]
		);
	if (
		versions.some( ( value ) => ! value ) ||
		new Set( versions ).size !== 1
	)
		throw new Error( `Version mismatch: ${ versions }` );
	if (
		pkg.license !== 'GPL-2.0-or-later' ||
		composer.license !== pkg.license ||
		! /License:\s+GPL-2\.0-or-later/.test( plugin ) ||
		! /License:\s+(?:GPL-2\.0-or-later|GPLv2 or later)(?:\r?\n|$)/.test(
			readme
		)
	)
		throw new Error( 'License metadata mismatch' );
	if (
		block.textdomain !== 'yt-playlist-player' ||
		! /Text Domain:\s+yt-playlist-player(?:\r?\n|$)/.test( plugin )
	) {
		throw new Error( 'Text domain metadata mismatch' );
	}
	console.log(
		`Version ${ pkg.version } and license metadata are consistent.`
	);
}

export function checkPackage( zipPath ) {
	const zip = resolve( zipPath );
	const digest = createHash( 'sha256' )
		.update( readFileSync( zip ) )
		.digest( 'hex' );
	const expected = readFileSync( `${ zip }.sha256`, 'utf8' )
		.trim()
		.split( /\s+/ )[ 0 ];
	if ( digest !== expected ) throw new Error( 'Package checksum mismatch' );
	const entries = JSON.parse(
		execFileSync(
			'python3',
			[
				'-c',
				'import json, sys, zipfile\nwith zipfile.ZipFile(sys.argv[1]) as z:\n if z.testzip() is not None: raise ValueError("Corrupt ZIP entry")\n if any(i.external_attr >> 28 == 10 for i in z.infolist()): raise ValueError("Symlink in ZIP")\n print(json.dumps(z.namelist()))',
				zip,
			],
			{ encoding: 'utf8' }
		)
	);
	const prefix = 'yt-playlist-player/';
	const allowed =
		/^(?:yt-playlist-player\.php|readme\.txt|LICENSE|THIRD_PARTY_NOTICES\.md|(?:build|includes|languages)\/.+)$/;
	for ( const entry of entries ) {
		const path = entry.slice( prefix.length );
		if (
			! entry.startsWith( prefix ) ||
			! allowed.test( path ) ||
			path
				.split( '/' )
				.some( ( part ) => ! part || part === '.' || part === '..' ) ||
			/(^|\/)(?:src|tests|node_modules|vendor|\.git|\.github)(\/|$)/.test(
				path
			)
		) {
			throw new Error( `Unexpected package entry: ${ entry }` );
		}
	}
	for ( const required of [
		'yt-playlist-player.php',
		'readme.txt',
		'LICENSE',
		'THIRD_PARTY_NOTICES.md',
		'build/block.json',
		'build/render.php',
		'build/index.js',
		'build/index.asset.php',
		'build/index.css',
		'build/view.js',
		'build/view.asset.php',
		'build/style-index.css',
		'includes/class-ytpp-editor-preview.php',
		'includes/class-ytpp-player-sizing.php',
		'includes/class-ytpp-playlist-parser.php',
	] ) {
		if ( ! entries.includes( prefix + required ) )
			throw new Error( `Missing package entry: ${ required }` );
	}
	if ( new Set( entries ).size !== entries.length )
		throw new Error( 'Duplicate package entries' );
	console.log(
		`Package contents and SHA-256 verified (${ entries.length } files).`
	);
}

if (
	process.argv[ 1 ] &&
	import.meta.url === pathToFileURL( process.argv[ 1 ] ).href
) {
	try {
		checkVersions( process.cwd(), process.env.RELEASE_TAG );
		if ( process.argv[ 2 ] ) checkPackage( process.argv[ 2 ] );
	} catch ( error ) {
		console.error( error.message );
		process.exitCode = 1;
	}
}
