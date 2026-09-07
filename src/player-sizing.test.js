import { getPlayerSizing } from './player-sizing';

describe( 'player sizing', () => {
	it( 'preserves automatic sizing for existing blocks', () => {
		expect( getPlayerSizing() ).toMatchObject( { style: {}, errors: [] } );
	} );
	it.each( [ '16:9', '4:3', '1:1', '9:16', '1:4', '4:1', '1.5:1' ] )(
		'accepts ratio %s',
		( ratio ) => {
			expect(
				getPlayerSizing( {
					aspectRatio: 'custom',
					customAspectRatio: ratio,
				} ).errors
			).toEqual( [] );
		}
	);
	it.each( [
		'0:1',
		'1:0',
		'-1:1',
		'100:1',
		'1:100',
		'16/9',
		'1:1;color:red',
		null,
		{},
	] )( 'rejects unsafe or unusable ratios: %s', ( ratio ) => {
		expect(
			getPlayerSizing( {
				aspectRatio: 'custom',
				customAspectRatio: ratio,
			} )
		).toMatchObject( {
			style: {},
			errors: [ 'aspectRatio' ],
			ratio: 16 / 9,
		} );
	} );
	it( 'checks both minimum dimensions for the chosen ratio', () => {
		expect(
			getPlayerSizing( { maxWidth: '355', maxHeight: '199' } ).errors
		).toEqual( [ 'maxWidth', 'maxHeight' ] );
		expect(
			getPlayerSizing( {
				aspectRatio: 'custom',
				customAspectRatio: '9:16',
				maxHeight: '355',
			} ).errors
		).toEqual( [ 'maxHeight' ] );
		expect(
			getPlayerSizing( { maxWidth: '356', maxHeight: '200' } ).style
		).toEqual( {
			'--ytpp-max-width': '356px',
			'--ytpp-max-height': '200px',
		} );
	} );
	it.each( [
		'10001',
		'-400',
		'600px',
		'600.5',
		'600;color:red',
		'Infinity',
		{},
		600,
	] )( 'rejects invalid saved widths: %s', ( maxWidth ) => {
		expect( getPlayerSizing( { maxWidth } ).errors ).toEqual( [
			'maxWidth',
		] );
	} );
} );
