import { fireEvent, render, screen } from '@testing-library/react';

import Edit from './edit';

jest.mock( '@wordpress/block-editor', () => ( {
	useBlockProps: () => ( {} ),
} ) );

jest.mock( '@wordpress/components', () => ( {
	Placeholder: ( { children, instructions, label } ) => (
		<section>
			<h2>{ label }</h2>
			<p>{ instructions }</p>
			{ children }
		</section>
	),
	TextControl: ( { label, onChange, value } ) => (
		<label htmlFor="playlist-id-test-input">
			{ label }
			<input
				id="playlist-id-test-input"
				aria-label={ label }
				value={ value }
				onChange={ ( event ) => onChange( event.target.value ) }
			/>
		</label>
	),
} ) );

describe( 'Edit', () => {
	it( 'renders the playlist field and stores a plain ID', () => {
		const setAttributes = jest.fn();

		render(
			<Edit
				attributes={ { playlistId: '' } }
				setAttributes={ setAttributes }
			/>
		);

		const input = screen.getByRole( 'textbox', {
			name: 'Playlist ID or URL',
		} );
		fireEvent.change( input, { target: { value: 'PL-test-playlist' } } );

		expect( setAttributes ).toHaveBeenCalledWith( {
			playlistId: 'PL-test-playlist',
		} );
	} );

	it( 'normalizes a supported URL before storing it', () => {
		const setAttributes = jest.fn();
		const playlistId = 'OLAK5uy_mIGiJKnSXHRCdD6WbGjuZWNTpeXhIo2TU';

		render(
			<Edit
				attributes={ { playlistId: '' } }
				setAttributes={ setAttributes }
			/>
		);

		fireEvent.change(
			screen.getByRole( 'textbox', { name: 'Playlist ID or URL' } ),
			{
				target: {
					value: `https://youtube.com/playlist?list=${ playlistId }&si=tracking`,
				},
			}
		);

		expect( setAttributes ).toHaveBeenCalledWith( { playlistId } );
	} );

	it( 'shows an error for invalid syntax', () => {
		render(
			<Edit
				attributes={ { playlistId: 'invalid!' } }
				setAttributes={ jest.fn() }
			/>
		);

		expect( screen.getByRole( 'alert' ).textContent ).toBe(
			'Enter a valid YouTube playlist ID or supported playlist URL.'
		);
	} );
} );
