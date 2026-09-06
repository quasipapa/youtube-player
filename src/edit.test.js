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
	it( 'renders the playlist field and stores its value', () => {
		const setAttributes = jest.fn();

		render(
			<Edit
				attributes={ { playlistId: '' } }
				setAttributes={ setAttributes }
			/>
		);

		const input = screen.getByRole( 'textbox', { name: 'Playlist ID' } );
		fireEvent.change( input, { target: { value: 'PL-test-playlist' } } );

		expect( setAttributes ).toHaveBeenCalledWith( {
			playlistId: 'PL-test-playlist',
		} );
	} );
} );
