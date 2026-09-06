import { registerBlockType } from '@wordpress/blocks';

import Edit from './edit';
import metadata from './block.json';
import './style.scss';

export const settings = {
	edit: Edit,
	save: () => null,
};

registerBlockType( metadata.name, settings );
