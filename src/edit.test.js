import { fireEvent, render, screen } from '@testing-library/react';

import Edit from './edit';

jest.mock( '@wordpress/block-editor', () => ( {
	InspectorControls: ( { children } ) => <aside>{ children }</aside>,
	useBlockProps: () => ( {} ),
} ) );

jest.mock( '@wordpress/components', () => ( {
	Button: ( { children, disabled, onClick } ) => (
		<button type="button" disabled={ disabled } onClick={ onClick }>
			{ children }
		</button>
	),
	Disabled: ( { children } ) => (
		<div data-testid="disabled-preview">{ children }</div>
	),
	PanelBody: ( { children, title } ) => (
		<section>
			<h2>{ title }</h2>
			{ children }
		</section>
	),
	Placeholder: ( { instructions, label } ) => (
		<section>
			<h2>{ label }</h2>
			<p>{ instructions }</p>
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
	ToggleControl: ( { checked, label, onChange } ) => (
		<label htmlFor="consent-test-input">
			{ label }
			<input
				id="consent-test-input"
				type="checkbox"
				checked={ checked }
				onChange={ ( event ) => onChange( event.target.checked ) }
			/>
		</label>
	),
} ) );

describe( 'Edit', () => {
	beforeEach( () => {
		window.ytppEditorSettings = {
			previewUrl:
				'http://localhost/wp-admin/admin-ajax.php?action=ytpp_editor_preview&nonce=test',
		};
		localStorage.clear();
	} );

	it( 'places the playlist field in the block settings sidebar', () => {
		const setAttributes = jest.fn();

		render(
			<Edit
				attributes={ { playlistId: '', requireConsent: true } }
				setAttributes={ setAttributes }
			/>
		);

		const input = screen.getByRole( 'textbox', {
			name: 'Playlist ID or URL',
		} );

		expect( input.closest( 'aside' ) ).not.toBeNull();
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
				attributes={ { playlistId: '', requireConsent: true } }
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

	it( 'renders a privacy-enhanced playlist preview for valid input', () => {
		const playlistId = 'OLAK5uy_mIGiJKnSXHRCdD6WbGjuZWNTpeXhIo2TU';

		render(
			<Edit
				attributes={ { playlistId, requireConsent: true } }
				setAttributes={ jest.fn() }
			/>
		);

		const preview = screen.getByTitle( 'YouTube playlist preview' );
		const previewUrl = new URL( preview.getAttribute( 'src' ) );

		expect(
			preview.closest( '[data-testid="disabled-preview"]' )
		).not.toBeNull();
		expect( previewUrl.origin ).toBe( 'http://localhost' );
		expect( previewUrl.searchParams.get( 'action' ) ).toBe(
			'ytpp_editor_preview'
		);
		expect( previewUrl.searchParams.get( 'playlist_id' ) ).toBe(
			playlistId
		);
		expect(
			screen.getByText( /editor preview connects directly/ )
		).not.toBeNull();
		expect(
			screen.getByLabelText( 'Playlist navigation preview' )
		).not.toBeNull();
	} );

	it( 'removes saved consent for the selected playlist', () => {
		const playlistId = 'PL-test-playlist';
		localStorage.setItem( `ytpp-consent-v1:${ playlistId }`, '1' );

		render(
			<Edit
				attributes={ { playlistId, requireConsent: true } }
				setAttributes={ jest.fn() }
			/>
		);

		fireEvent.click(
			screen.getByRole( 'button', {
				name: 'Forget saved consent for this playlist',
			} )
		);

		expect(
			localStorage.getItem( `ytpp-consent-v1:${ playlistId }` )
		).toBeNull();
		expect(
			screen.getByText( 'Saved consent for this playlist was removed.' )
		).not.toBeNull();
	} );

	it( 'checks availability only after an explicit editor action', () => {
		const playlistId = 'PL-test-playlist';

		render(
			<Edit
				attributes={ { playlistId, requireConsent: true } }
				setAttributes={ jest.fn() }
			/>
		);

		const preview = screen.getByTitle( 'YouTube playlist preview' );
		const checkButton = screen.getByRole( 'button', {
			name: 'Check playlist availability',
		} );
		const postMessage = jest.spyOn( preview.contentWindow, 'postMessage' );

		expect( checkButton.disabled ).toBe( true );
		expect( postMessage ).not.toHaveBeenCalled();

		fireEvent.load( preview );
		expect( checkButton.disabled ).toBe( false );
		fireEvent.click( checkButton );

		expect( postMessage ).toHaveBeenCalledWith(
			{ type: 'ytpp:check-availability' },
			'http://localhost'
		);
		expect(
			screen.getByText( 'Checking playlist availability…' )
		).not.toBeNull();
		expect( checkButton.disabled ).toBe( true );
	} );

	it.each( [
		[
			'available',
			'The playlist is available and contains at least one playable item.',
		],
		[
			'unavailable',
			'The playlist is unavailable, empty, or cannot be embedded.',
		],
		[
			'unknown',
			'Playlist availability could not be determined. Check the network or content blocker and try again.',
		],
	] )( 'shows the %s remote-check result', ( status, message ) => {
		render(
			<Edit
				attributes={ {
					playlistId: 'PL-test-playlist',
					requireConsent: true,
				} }
				setAttributes={ jest.fn() }
			/>
		);

		const preview = screen.getByTitle( 'YouTube playlist preview' );
		fireEvent.load( preview );
		fireEvent.click(
			screen.getByRole( 'button', {
				name: 'Check playlist availability',
			} )
		);
		fireEvent(
			window,
			new MessageEvent( 'message', {
				data: { type: 'ytpp:availability-result', status },
				origin: 'http://localhost',
				source: preview.contentWindow,
			} )
		);

		expect( screen.getByText( message ) ).not.toBeNull();
	} );

	it( 'stores the consent-gate setting', () => {
		const setAttributes = jest.fn();

		render(
			<Edit
				attributes={ {
					playlistId: 'PL-test-playlist',
					requireConsent: true,
				} }
				setAttributes={ setAttributes }
			/>
		);

		fireEvent.click(
			screen.getByRole( 'checkbox', {
				name: 'Require consent before loading YouTube',
			} )
		);

		expect( setAttributes ).toHaveBeenCalledWith( {
			requireConsent: false,
		} );
	} );

	it( 'shows an error for invalid syntax without an external preview', () => {
		render(
			<Edit
				attributes={ { playlistId: 'invalid!', requireConsent: true } }
				setAttributes={ jest.fn() }
			/>
		);

		expect( screen.getByRole( 'alert' ).textContent ).toBe(
			'Enter a valid YouTube playlist ID or supported playlist URL.'
		);
		expect( screen.queryByTitle( 'YouTube playlist preview' ) ).toBeNull();
	} );
} );
