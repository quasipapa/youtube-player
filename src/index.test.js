import { registerBlockType } from '@wordpress/blocks';

import metadata from './block.json';
import { settings } from './index';

jest.mock( '@wordpress/blocks', () => ( {
	registerBlockType: jest.fn(),
} ) );
jest.mock( './edit', () => () => null );

describe( 'player block registration', () => {
	it( 'registers the block using its metadata name', () => {
		expect( registerBlockType ).toHaveBeenCalledWith(
			metadata.name,
			settings
		);
	} );

	it( 'uses dynamic server-side rendering', () => {
		// expect( settings.save() ).toBeNull();
    expect( settings.save() ).toBe( 'intentional failure' );
  } );

	it( 'supports all standard WordPress alignments', () => {
		expect( metadata.supports.align ).toEqual( [
			'wide',
			'full',
			'center',
			'left',
			'right',
		] );
	} );
} );
