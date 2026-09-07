/**
 * Normalize saved dimensions before using them in CSS.
 *
 * @param {Object} attributes Saved block attributes.
 * @return {Object} Safe styles, validation errors and the effective ratio.
 */
export function getPlayerSizing( attributes = {} ) {
	const input =
		attributes.aspectRatio === 'custom'
			? attributes.customAspectRatio
			: attributes.aspectRatio ?? '16:9';
	const match =
		typeof input === 'string' &&
		input.match(
			/^(\d{1,4}(?:\.\d{1,3})?)\s*:\s*(\d{1,4}(?:\.\d{1,3})?)$/
		);
	const candidate = match ? Number( match[ 1 ] ) / Number( match[ 2 ] ) : 0;
	const validRatio =
		Number.isFinite( candidate ) && candidate >= 0.25 && candidate <= 4;
	const ratio = validRatio ? candidate : 16 / 9;
	const errors = validRatio ? [] : [ 'aspectRatio' ];
	const style = {};
	if ( input !== undefined && input !== '16:9' && validRatio ) {
		style[ '--ytpp-aspect-ratio' ] = ratio;
	}
	for ( const [ key, css, minimum ] of [
		[
			'maxWidth',
			'--ytpp-max-width',
			Math.ceil( 200 * Math.max( 1, ratio ) ),
		],
		[
			'maxHeight',
			'--ytpp-max-height',
			Math.ceil( 200 / Math.min( 1, ratio ) ),
		],
	] ) {
		const value = attributes[ key ] ?? '';
		if ( value === '' ) {
			continue;
		}
		if (
			typeof value === 'string' &&
			/^\d{1,5}$/.test( value ) &&
			Number( value ) >= minimum &&
			Number( value ) <= 10000
		) {
			style[ css ] = `${ Number( value ) }px`;
		} else {
			errors.push( key );
		}
	}
	return { style, errors, ratio };
}
